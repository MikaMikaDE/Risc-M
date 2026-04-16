import { CPU } from "./CPU";
import { asImm, MAX_32, toHi32, toLo32 } from "./util/bitwise";

export const INSTRUCTIONS:Record<string, Function> = Object.freeze({
  /*Fake instructions for this emulator*/
  $exit  :(cpu:CPU                        ) => { cpu.shouldExit=true; cpu.exitCode=1; },
  $assert:(cpu:CPU, rs1:string, imm:string) => {
    const actual   = cpu.getVal_U(rs1) >>> 0; //force both vals
    const expected =        asImm(imm) >>> 0; //to unsigned int
    if (actual !== expected) throw new Error(`Assertion failed: Stored(${actual}), expected(${expected})`);
  },
  /*Load Immediate*/
  li     :(cpu:CPU,   rd:string, imm:string        )=> { cpu.setReg(rd, asImm(imm))                                 },
  lui    :(_cpu:CPU, _rd:string,_imm:string        )=> {throw new UnimplementedInstructionError("lui"  )            }, //todo
  auipc  :(_cpu:CPU, _rd:string,_imm:string        )=> {throw new UnimplementedInstructionError("auipc")            }, //todo
  /*Load And Store*/
  la     :(cpu:CPU, rd:string,   symbol:string     )=> cpu.setReg(rd,  asImm(symbol)                                ),
  lw     :(cpu:CPU, rd:string,offsetReg:string     )=> cpu.setReg(rd,  cpu.getWord_S(cpu.calcOffset(offsetReg))     ),
  lh     :(cpu:CPU, rd:string,offsetReg:string     )=> cpu.setReg(rd,  cpu.getHalf_S(cpu.calcOffset(offsetReg))     ),
  lhu    :(cpu:CPU, rd:string,offsetReg:string     )=> cpu.setReg(rd,  cpu.getHalf_U(cpu.calcOffset(offsetReg))     ),
  lb     :(cpu:CPU, rd:string,offsetReg:string     )=> cpu.setReg(rd,  cpu.getByte_S(cpu.calcOffset(offsetReg))     ),
  lbu    :(cpu:CPU, rd:string,offsetReg:string     )=> cpu.setReg(rd,  cpu.getByte_U(cpu.calcOffset(offsetReg))     ),
  sw     :(cpu:CPU,rs2:string,offsetReg:string     )=> cpu.setWord(cpu.calcOffset(offsetReg), cpu.getVal_S(rs2)     ),
  sh     :(cpu:CPU,rs2:string,offsetReg:string     )=> cpu.setHalf(cpu.calcOffset(offsetReg), cpu.getVal_S(rs2)     ),
  sb     :(cpu:CPU,rs2:string,offsetReg:string     )=> cpu.setByte(cpu.calcOffset(offsetReg), cpu.getVal_S(rs2)     ),
  /*Arithmetic Instructions*/
  neg    :(cpu:CPU, rd:string,rs1:string,          )=> cpu.setReg(rd,        cpu.getVal_S(rs1) * -1                 ),
  rem    :(cpu:CPU, rd:string,rs1:string,rs2:string)=> cpu.setReg(rd,        cpu.getVal_S(rs1) % cpu.getVal_S(rs2)  ),
  add    :(cpu:CPU, rd:string,rs1:string,rs2:string)=> cpu.setReg(rd, toLo32(cpu.getVal_S(rs1) + cpu.getVal_S(rs2)) ),
  sub    :(cpu:CPU, rd:string,rs1:string,rs2:string)=> cpu.setReg(rd, toLo32(cpu.getVal_S(rs1) - cpu.getVal_S(rs2)) ),
  mul    :(cpu:CPU, rd:string,rs1:string,rs2:string)=> cpu.setReg(rd, toLo32(cpu.getVal_S(rs1) * cpu.getVal_S(rs2)) ),
  mulhu  :(cpu:CPU, rd:string,rs1:string,rs2:string)=> cpu.setReg(rd, toHi32(cpu.getVal_U(rs1) * cpu.getVal_U(rs2)) ),
  addi   :(cpu:CPU, rd:string,rs1:string,imm:string)=> cpu.setReg(rd, toLo32(cpu.getVal_S(rs1) +        asImm(imm)) ),
  mulh   :(cpu:CPU, rd:string,rs1:string,rs2:string)=> cpu.setReg(rd, toHi32(cpu.getVal_S(rs1) * cpu.getVal_S(rs2)) ),
  mulhsu :(cpu:CPU, rd:string,rs1:string,rs2:string)=> cpu.setReg(rd, toHi32(cpu.getVal_U(rs1) * cpu.getVal_U(rs2)) ),
  div    :(cpu:CPU, rd:string,rs1:string,rs2:string)=> cpu.setReg(rd, (cpu.getVal_S(rs2)===0) ?MAX_32 :toLo32(cpu.getVal_S(rs1)/cpu.getVal_S(rs2))  ), //spec states that /0 = MAX_INT
  /*Jump and Function Instructions*/                   //saves return address      //performs jump
  j      :(cpu:CPU,                      imm:string)=>                             cpu.incPc(asImm(imm)                 ),
  jal    :(cpu:CPU, rd:string,           imm:string)=> {cpu.setReg( rd, cpu.pc+1); cpu.incPc(asImm(imm));               },
  jalr   :(cpu:CPU, rd:string,     offsetReg:string)=> {cpu.setReg( rd, cpu.pc+1); cpu.setPc(cpu.calcOffset(offsetReg));},
  call   :(cpu:CPU,                      imm:string)=> {cpu.setReg("ra",cpu.pc+1); cpu.incPc(asImm(imm));               },
  jr     :(cpu:CPU, rd:string                      )=>                             cpu.setPc(cpu.getVal_S( rd )         ), //note: not in the https://projectf.io/posts/riscv-cheat-sheet/ docs
  ret    :(cpu:CPU                                 )=>                             cpu.setPc(cpu.getVal_S("ra")         ),
  /*Branch Instructions*/
  bltz   :(cpu:CPU,rs1:string,           imm:string)=> cpu.incPcIf(asImm(imm), cpu.getVal_S(rs1) <   0                  ),
  bgtz   :(cpu:CPU,rs1:string,           imm:string)=> cpu.incPcIf(asImm(imm), cpu.getVal_S(rs1) >   0                  ),
  blez   :(cpu:CPU,rs1:string,           imm:string)=> cpu.incPcIf(asImm(imm), cpu.getVal_S(rs1) <=  0                  ),
  bgez   :(cpu:CPU,rs1:string,           imm:string)=> cpu.incPcIf(asImm(imm), cpu.getVal_S(rs1) >=  0                  ),
  beqz   :(cpu:CPU,rs1:string,           imm:string)=> cpu.incPcIf(asImm(imm), cpu.getVal_S(rs1) === 0                  ),
  bnez   :(cpu:CPU,rs1:string,           imm:string)=> cpu.incPcIf(asImm(imm), cpu.getVal_S(rs1) !== 0                  ),
  beq    :(cpu:CPU,rs1:string,rs2:string,imm:string)=> cpu.incPcIf(asImm(imm), cpu.getVal_S(rs1) === cpu.getVal_S(rs2)  ),
  bne    :(cpu:CPU,rs1:string,rs2:string,imm:string)=> cpu.incPcIf(asImm(imm), cpu.getVal_S(rs1) !== cpu.getVal_S(rs2)  ),
  bltu   :(cpu:CPU,rs1:string,rs2:string,imm:string)=> cpu.incPcIf(asImm(imm), cpu.getVal_U(rs1) <   cpu.getVal_U(rs2)  ), 
  bgtu   :(cpu:CPU,rs1:string,rs2:string,imm:string)=> cpu.incPcIf(asImm(imm), cpu.getVal_U(rs1) >   cpu.getVal_U(rs2)  ),
  bleu   :(cpu:CPU,rs1:string,rs2:string,imm:string)=> cpu.incPcIf(asImm(imm), cpu.getVal_U(rs1) <=  cpu.getVal_U(rs2)  ),
  bgeu   :(cpu:CPU,rs1:string,rs2:string,imm:string)=> cpu.incPcIf(asImm(imm), cpu.getVal_U(rs1) >=  cpu.getVal_U(rs2)  ),
  blt    :(cpu:CPU,rs1:string,rs2:string,imm:string)=> cpu.incPcIf(asImm(imm), cpu.getVal_S(rs1) <   cpu.getVal_S(rs2)  ),
  bgt    :(cpu:CPU,rs1:string,rs2:string,imm:string)=> cpu.incPcIf(asImm(imm), cpu.getVal_S(rs1) >   cpu.getVal_S(rs2)  ),
  ble    :(cpu:CPU,rs1:string,rs2:string,imm:string)=> cpu.incPcIf(asImm(imm), cpu.getVal_S(rs1) <=  cpu.getVal_S(rs2)  ),
  bge    :(cpu:CPU,rs1:string,rs2:string,imm:string)=> cpu.incPcIf(asImm(imm), cpu.getVal_S(rs1) >=  cpu.getVal_S(rs2)  ),
  /*Bitwise Logic*/                                                    
  and    :(cpu:CPU, rd:string,rs1:string,rs2:string)=> cpu.setReg(rd,          cpu.getVal_S(rs1) &   cpu.getVal_S(rs2)  ),
  andi   :(cpu:CPU, rd:string,rs1:string,imm:string)=> cpu.setReg(rd,          cpu.getVal_S(rs1) &          asImm(imm)  ),
  or     :(cpu:CPU, rd:string,rs1:string,rs2:string)=> cpu.setReg(rd,          cpu.getVal_S(rs1) |   cpu.getVal_S(rs2)  ),
  ori    :(cpu:CPU, rd:string,rs1:string,imm:string)=> cpu.setReg(rd,          cpu.getVal_S(rs1) |          asImm(imm)  ),
  xor    :(cpu:CPU, rd:string,rs1:string,rs2:string)=> cpu.setReg(rd,          cpu.getVal_S(rs1) ^   cpu.getVal_S(rs2)  ),
  xori   :(cpu:CPU, rd:string,rs1:string,imm:string)=> cpu.setReg(rd,          cpu.getVal_S(rs1) ^          asImm(imm)  ),
  /*Set Instructions*/
  slt    :(cpu:CPU, rd:string,rs1:string,rs2:string)=> cpu.setReg(rd,          cpu.getVal_S(rs1) <   cpu.getVal_S(rs2) ?1 :0 ),
  slti   :(cpu:CPU, rd:string,rs1:string,imm:string)=> cpu.setReg(rd,          cpu.getVal_S(rs1) <   asImm(imm)        ?1 :0 ),
  sltu   :(cpu:CPU, rd:string,rs1:string,rs2:string)=> cpu.setReg(rd,          cpu.getVal_U(rs1) <   cpu.getVal_U(rs2) ?1 :0 ),
  sltiu  :(cpu:CPU, rd:string,rs1:string,imm:string)=> cpu.setReg(rd,          cpu.getVal_U(rs1) <          asImm(imm) ?1 :0 ),
  seqz   :(cpu:CPU, rd:string,rs1:string           )=> cpu.setReg(rd,          cpu.getVal_S(rs1) === 0                 ?1 :0 ),
  snez   :(cpu:CPU, rd:string,rs1:string           )=> cpu.setReg(rd,          cpu.getVal_S(rs1) !== 0                 ?1 :0 ),
  sltz   :(cpu:CPU, rd:string,rs1:string           )=> cpu.setReg(rd,          cpu.getVal_S(rs1) <   0                 ?1 :0 ),
  sgtz   :(cpu:CPU, rd:string,rs1:string           )=> cpu.setReg(rd,          cpu.getVal_S(rs1) >   0                 ?1 :0 ),
  /*Shifting*/                                                        //& 0x1F ensures shift amounts wrap around and stay within 0-31
  sll    :(cpu:CPU, rd:string,rs1:string,rs2:string)=> cpu.setReg(rd, toLo32(cpu.getVal_S(rs1) <<  (cpu.getVal_S(rs2) & 0x1F)) ),
  slli   :(cpu:CPU, rd:string,rs1:string,imm:string)=> cpu.setReg(rd, toLo32(cpu.getVal_S(rs1) <<  asImm(imm))                 ),
  srl    :(cpu:CPU, rd:string,rs1:string,rs2:string)=> cpu.setReg(rd, toLo32(cpu.getVal_S(rs1) >>> (cpu.getVal_S(rs2) & 0x1F)) ),
  srli   :(cpu:CPU, rd:string,rs1:string,imm:string)=> cpu.setReg(rd, toLo32(cpu.getVal_S(rs1) >>> asImm(imm))                 ),
  sra    :(cpu:CPU, rd:string,rs1:string,rs2:string)=> cpu.setReg(rd, toLo32(cpu.getVal_S(rs1) >>  (cpu.getVal_S(rs2) & 0x1F)) ),
  srai   :(cpu:CPU, rd:string,rs1:string,imm:string)=> cpu.setReg(rd, toLo32(cpu.getVal_S(rs1) >>  asImm(imm))                 ),
  /*Misc - not  all are implemented*/
  nop    :(___:CPU                                 )=> void 0,
  mv     :(cpu:CPU, rd:string,rs1:string           )=> cpu.setReg(rd, cpu.getVal_S(rs1)),
  ecall  :(cpu:CPU                                 )=> cpu.syscall(), 
  ebreak :(cpu:CPU                                 )=>{cpu.pc++; throw new Error("Breakpoint hit - execution paused");}, 
  fence  :(___:CPU                                 )=>{throw new UnimplementedInstructionError("fence");},
  /*Counters - not implemented*/
  rdtime   :(cpu:CPU, rd:string                    )=> cpu.setReg(rd,        cpu.getReg("time").value),
  rdtimeh  :(cpu:CPU, rd:string                    )=> cpu.setReg(rd, toHi32(cpu.getReg("time").value)),
  rdcycle  :()=>{throw new UnimplementedInstructionError("rdcylce"  );},
  rdcycleh :()=>{throw new UnimplementedInstructionError("rdcycleh" );},
  rdinstet :()=>{throw new UnimplementedInstructionError("rdinstet" );},
  rdinsteth:()=>{throw new UnimplementedInstructionError("rdinsteth");},
});

export const LEGAL_INSTRUCTIONS = Object.keys(INSTRUCTIONS);
export const isLegalInstruction = (str:string):boolean => LEGAL_INSTRUCTIONS.includes(str);
export class UnknownInstructionError extends Error {
   constructor(instruction:string) {
    super(`Unknown Instruction: ${instruction}`);
    this.name = "UnknownInstructionError";
  }
}
class UnimplementedInstructionError extends Error {
   constructor(instruction:string) {
    super(`Instruction ${instruction} is not implemented.`);
    this.name = "UnimplementedInstructionError";
  }
}
