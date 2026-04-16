import type { Memory } from "../emulator/Memory.ts";
import { GRAPHICS_MODES } from "./GraphicsModes.ts";

let interval:ReturnType<typeof setInterval>;

export class Display {
  memory:Memory;
  canvas:HTMLCanvasElement;
  ctx   :CanvasRenderingContext2D;
  FPS            = Math.floor(1000 / 60);
  width          = 16;
  height         = 16;
  graphicsModeReg= 0x9FF;
  dispStart      = 0xA00;
  get num_pixels(){ return this.width * this.height }  

  constructor(memory:Memory, canvas:HTMLCanvasElement){
    this.memory        = memory;
    this.canvas        = canvas;
    this.canvas.width  = this.width ;
    this.canvas.height = this.height;
    const ctx = this.canvas.getContext("2d");
    if  (!ctx) throw new Error("Unable to get ctx");
    this.ctx = ctx;
  }
  delete(){ 
    clearInterval(interval); 
  }
  startRendering() {
    if (interval) clearInterval(interval);
    interval = setInterval(()=>this.refresh(), this.FPS);
  }
  stopRendering(){
    if (interval) clearInterval(interval);
  }

  refresh(){ 
    if (!this.canvas) throw new Error("No canvas");
    const mode = this.memory.readByte(this.graphicsModeReg);
    if   (mode === 0) return; //no mode = no refresh
    const drawingStrategy = GRAPHICS_MODES[mode] ?? GRAPHICS_MODES[1];
    const imageData = this.ctx.createImageData(this.width, this.height);
    drawingStrategy(imageData.data, this.memory, this.dispStart, this.num_pixels);
    this.ctx.putImageData(imageData, 0, 0);
  }
}
