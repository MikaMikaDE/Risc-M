import { WINDOW  } from "./html/HTML.ts";
import {  CPU    } from "./emulator/CPU";
import { Display } from "./display/Display.ts";
import { Logger  } from "./html/components/logger/Logger.ts" ; 

/**Combines the model (CPU) and view (CPU) into a single class*/
export class HTML_CPU {
  private display :Display|undefined;
  private running :boolean = false;
  private cpu     :CPU     = new CPU();
  private logger  :Logger  = new Logger(WINDOW);
  private runId   :number  = 0;
//----------------------------------------------------------------------------------------------//
// Constructors
//----------------------------------------------------------------------------------------------//
  constructor (){ this.init(); }
  reset       (){ this.init(); }
  private init(){
    this.runId++; //
    if (this.display) this.display.delete();
    WINDOW.screen.getContext("2d")?.reset();
    this.running  = false;
    this.cpu      = new CPU();
    this.assemble();
  }
//----------------------------------------------------------------------------------------------//
// Helpers
//----------------------------------------------------------------------------------------------//
  private log(message?:string){
    this.logger.update(this.cpu, message);
  }
  private step() {
    try              { this.cpu.step();                              } 
    catch (err: any) { this.halt(err.message); throw new Error(err); }
  }
  private assemble() {
    try          { this.cpu.feed(WINDOW.input.getValue()); }
    catch (e:any){ this.log(e);        throw new Error(e); }
    this.log("CPU Ready to execute.");
  } 
  private initExecution(){
    this.running = true;
    this.display = new Display(this.cpu.memory, WINDOW.screen);
    this.display.startRendering();
  }
  private run(strategy: (callback: FrameRequestCallback) => void) {
      const id = ++this.runId;
      if (!this.running) this.initExecution();
      const run: FrameRequestCallback = () => {
          if (this.runId  !==  id                 ) return;
          if (this.cpu.shouldExit || !this.running) return this.halt();
          this.step();
          this.log();
          strategy(run);
      };
      run(0);
  }
//----------------------------------------------------------------------------------------------//
// Running the CPU - Exposed Function, applied from user input buttons
//----------------------------------------------------------------------------------------------//
  runSlowly()  { this.run(cb => setTimeout(cb, 100)); } //100= 100ms wait between steps
  runQuickly() { this.run(cb => {
      const batchStart = Date.now();
      while (Date.now() - batchStart < 10) this.step(); //10 = 10 steps per "batch"
      requestAnimationFrame(cb);
  }); }
  runOneStep() {
    this.halt();
    this.step();
    this.log ();
    this.display?.refresh();
  }
  halt(message?:string){
    this.running = false;
    this.display?.stopRendering();
    this.log(message);
  }

}
