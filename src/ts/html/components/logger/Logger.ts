import { RegisterTable } from "./util/RegistersToTable";
import { MemoryTable   } from "./util/MemoryToTable"   ;
import { type CPU      } from "../../../emulator/CPU"  ;
import { genElem       } from "../../util/genElem"     ;

export class Logger {
  regElem :HTMLElement;
  memElem :HTMLElement;
  logElem :HTMLElement;
  histElem:HTMLElement;
  segmentNameElem:HTMLElement = genElem("p");
  segmentIndex   :number      = 2;
  lastCPU?       :CPU;
  memoryTable    :MemoryTable;
  registerTable  :RegisterTable;
//----------------------------------------------------------------------------------------------------------------------------
// constructor
//----------------------------------------------------------------------------------------------------------------------------
  constructor({registers,memory,history,log,memControl}:{registers:HTMLElement;memory:HTMLElement;history:HTMLElement;log:HTMLElement;memControl:HTMLElement}){
    this.regElem  = registers;
    this.histElem = history  ;
    this.memElem  = memory   ;
    this.logElem  = log      ;
    memControl.replaceChildren(
      genElem("button",{innerText:"Prev", onclick:()=>this.updateActiveSegment(-1)} ),
      this.segmentNameElem,
      genElem("button",{innerText:"Next", onclick:()=>this.updateActiveSegment(+1)} ),
    );
    this.memoryTable   = new MemoryTable();   this.memElem.replaceChildren(  this.memoryTable.element);
    this.registerTable = new RegisterTable(); this.regElem.replaceChildren(this.registerTable.element);
  }
//----------------------------------------------------------------------------------------------------------------------------
// updating
//----------------------------------------------------------------------------------------------------------------------------
  update(cpu?:CPU, message?:string){
    if (!cpu) throw new NoCPUError("Cannot update Log");
    if (this.lastCPU !== cpu) {
      this.lastCPU = cpu;
      this.registerTable.buildRegisters(cpu.registers);
      this.updateActiveSegment(0);
    }
    this.display();
    this.logElem .innerText = this.styleMessage(cpu, message);
    this.histElem.innerText = cpu.history_pretty.join( "\n" );
  }
  private styleMessage(cpu:CPU, message?:string):string{
    if (message!= undefined) return message;
    if (cpu.shouldExit     ) return `Exited with exit code ${cpu.exitCode}`;
                             return `Executing [pc=${cpu.pc}, lastInstruction: ${cpu.history.at(-1)}]`;
  }
  private display() {
    if (!this.lastCPU) throw new NoCPUError("Cannot display segment");
    const segment   = this.lastCPU.memory.segments[this.segmentIndex];
    const registers = this.lastCPU.registers;
    this.memoryTable  .update(segment);
    this.registerTable.update(registers);
  }
  private updateActiveSegment(increment:number){
    const next = this.segmentIndex + increment;
    if (!this.lastCPU) throw new NoCPUError("Cannot increment Segment");
    if (next < 0 || next > this.lastCPU.memory.segments.length-1) return; // out of bounds
    this.segmentIndex = next;
    const mem     = this.lastCPU.memory;
    const segment = mem.segments[this.segmentIndex];
    this.segmentNameElem.innerText = `[${segment.region}]  [ ${this.segmentIndex+1}/${mem.segments.length} : ${segment.paddedName}]`;
    this.memoryTable.newSegment(segment);
  }
}
//----------------------------------------------------------------------------------------------------------------------------
// Error Types
//----------------------------------------------------------------------------------------------------------------------------
class NoCPUError extends Error {
  constructor(action:string){
    super(`${action}: No CPU in logger`);
    this.name = "NoCPUError";
  }
}
