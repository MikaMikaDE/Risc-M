import { type RegisterDefinition, REGISTER_REGISTRY } from "./RegisterRegistry"
import { Register, TimeRegister, ZeroRegister       } from "./Register"
import { Memory                           } from "./Memory";
import { INSTRUCTIONS, isLegalInstruction } from "./Instructions";
import { BYTE, HALF, KB, WORD             } from "./util/util";
import { assembleInstructions             } from "./parsing/Assemble";
import { preprocess                       } from "./parsing/Parser";
import { Segment                          } from "./Segment";
import { toSigned, unsigned               } from "./util/bitwise";

const MAX_HISTORY_SIZE = 100;

export class CPU {
//----------------------------------------------------------------------------------------------------------------------------
/*FIELDS*/
//----------------------------------------------------------------------------------------------------------------------------
  _exitCode    :number               = 0;         //some instructions can set an exit code, which is logged on termination.
  pc           :number               = 0;         //pc increments by 1, not 4. Real Instrs are 4 bytes; ours are js string[].
  shouldExit   :boolean              = false;     //if true, will terminate when next able to.
  hasSetPc     :boolean              = false;     //skips pc. used when setting pc directly.
  registers    :Register[]           = [];        //all Register objects - see Register.ts
  instrs       :string[][]           = [];        //all program instructions.
  history      :string[][]           = [];        //logs previous instructions.
  registerMap  :Map<string,Register> = new Map(); //map of abi:register     (easier access for simulator)
  memory       :Memory               = new Memory();
  get exitCode(        ) { return this._exitCode;                          }
  set exitCode(x:number) { this._exitCode = Math.min(0, Math.max(x, 255)); }
  get history_pretty():string[] {
    return this.history.length > 0 ? this.history.map((i, _index)=>{
      const name = i[0].padEnd(4);
      const args = i.slice(1, i.length-1).map(str=>str.padStart(2, " ")).join(", ");
      const pc   = i.at(-1)?.padStart(6, " ");
      return `[pc${pc}]  |  ${name} ${args}`;
    }) : [];
  }
//----------------------------------------------------------------------------------------------------------------------------
/*CONSTRUCTORS*/
//----------------------------------------------------------------------------------------------------------------------------
  constructor(){
    this.registers.push(new ZeroRegister());
    REGISTER_REGISTRY.forEach((cfg:RegisterDefinition)=> this.registers.push(new Register(cfg)));
    this.registers.push(new TimeRegister());

    this.registers.forEach(register=>{
      register.abiNames.forEach(name=>this.registerMap.set(name,register))
    });
  }
//----------------------------------------------------------------------------------------------------------------------------
/*SYSCALL*/
//----------------------------------------------------------------------------------------------------------------------------
  syscall(){
    const  a0         = this.getVal_S("a0");
    const  syscallNum = this.getVal_S("a7");
    switch(syscallNum) {
      case  1: console.log(a0); break; //todo: improve -> terminal output maybe?
      case 10: this.shouldExit=true; this.exitCode = a0; break;
      case 93: this.shouldExit=true; this.exitCode = a0; break;
      default: throw new Error(`Unknown syscall: ${syscallNum}`);
    }
  }
//----------------------------------------------------------------------------------------------------------------------------
/*REGISTERS*/
//----------------------------------------------------------------------------------------------------------------------------
  getRegisterByName(abiName:string): Register{
    const reg = this.registerMap.get(abiName); 
    if (!abiName         ) throw new Error("No register was provided.\nCheck the last instruction entered for further details.");
    if (reg === undefined) throw new Error(`Register "${abiName}" does not exist on this CPU.`);
    return reg;
  }
  /*Converts addresses with dynamic (register) offsets to a valid address*/
  calcOffset(offsetReg:string):number {
    const match = offsetReg.match(/^(-?\d+)\((\w+)\)$/); //match eg offset(reg) as eg 0(t0)
    if  (!match) throw new Error(`Invalid offset(reg) format: "${offsetReg}".\nExpected format like "0(t6)" or "-4(sp)"`);
    const offset = parseInt(match[1]);
    const reg    = match[2];
    return this.getVal_S(reg)+offset;
  }
  setReg (abiName:string, value:number) {
    this.getRegisterByName(abiName).value = value;
  }
//----------------------------------------------------------------------------------------------------------------------------
/*Setting/Getting Programme Counter*/
//----------------------------------------------------------------------------------------------------------------------------
  setPc    (value:number                  ) { this.pc = value; this.hasSetPc = true;      }
  setPcIf  (value:number,condition:boolean) { if (condition) this.setPc(value);           }
  incPc    (value:number                  ) {                this.setPc(this.pc + value); }
  incPcIf  (value:number,condition:boolean) { if (condition) this.setPc(this.pc + value); }
//----------------------------------------------------------------------------------------------------------------------------
/*Setting/Getting Registers*/
//----------------------------------------------------------------------------------------------------------------------------
  getReg   (abiName:string):Register{ return this.getRegisterByName(abiName);        }
  getVal_S (abiName:string):number  { return this.getRegisterByName(abiName).value;  }
  getVal_U (abiName:string):number  { return this.getRegisterByName(abiName).value;  }
//----------------------------------------------------------------------------------------------------------------------------
/*Setting/Getting Memory*/
//----------------------------------------------------------------------------------------------------------------------------
  getWord_U(address:number): number { return unsigned(this.memory.readWord(address)      ); }
  getHalf_U(address:number): number { return unsigned(this.memory.readHalf(address)      ); }
  getByte_U(address:number): number { return unsigned(this.memory.readByte(address)      ); }
  getWord_S(address:number): number { return toSigned(this.memory.readWord(address), WORD); }
  getHalf_S(address:number): number { return toSigned(this.memory.readHalf(address), HALF); }
  getByte_S(address:number): number { return toSigned(this.memory.readByte(address), BYTE); }
  setWord  (address:number, val:number)  {   this.memory.writeWord(address, val); }
  setHalf  (address:number, val:number)  {   this.memory.writeHalf(address, val); }
  setByte  (address:number, val:number)  {   this.memory.writeByte(address, val); }
//----------------------------------------------------------------------------------------------------------------------------
/*EXECUTION*/
//----------------------------------------------------------------------------------------------------------------------------
  feed(programCode: string): CPU {
    const processed = preprocess(programCode);
    this.memory = new Memory({
      text  : processed.text  .memory,
      rodata: processed.rodata.memory,
      data  : processed.data  .memory,
      bss   : processed.bss   .memory,
      heap  : Segment.Heap (KB),
      stack : Segment.Stack(KB),
    });
    this.instrs = assembleInstructions(processed); 
    if (false) {//toggle bool for debuggin
      console.log("memory", this.memory);
      console.log("instrs", this.instrs);
      console.log("labels", processed.text.labels);
    }
    return this;
  }
  step(skipLog:boolean=false){
    if (this.shouldExit) return;
    const instruction = this.instructionAt(this.pc);
    if (!skipLog) this.addToHistory(instruction);
    this.execute     (instruction);
    if (!this.hasSetPc) this.pc++ ; //some operations can set pc; in that case we don't increment 
    this.hasSetPc = false;
  }
  addToHistory(instruction:string[]){
    const historyItem = new Array(...instruction);
    historyItem.push(String(this.pc));
    this.history.push(historyItem);
    if (this.history.length > MAX_HISTORY_SIZE) this.history.shift();
  }
  instructionAt(pc:number):string[]{
    if (pc >= this.instrs.length) throw new Error(`End of instructions has been reached without program termination.\n(PC=${this.pc}, Length of Instructions=${this.instrs.length-1}).\nLast Instruction: [${this.history.at(-1)}]`);
    const  instruction:string[] = this.instrs[this.pc];
    return instruction;
  }
  execute(instruction:string[]){
    const instrName     = instruction[0]; 
    const argumentsList = instruction.slice(1); //format is [name, arg, arg, arg] -> slice(1) makes this [arg, arg, arg]
    if (!isLegalInstruction(instrName)) throw new Error(`instruction "${instrName}" does not exist.`);
    INSTRUCTIONS[instrName](this,...argumentsList);
  }
}
