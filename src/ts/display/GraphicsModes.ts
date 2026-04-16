import type { Memory } from "../emulator/Memory.ts";

const OPAQUE = 0xFF;

export const GRAPHICS_MODES = [
/*----------------------------------------------------------------------------
[Mode0] None - Function is not even called
----------------------------------------------------------------------------*/
  ()=>{},
/*----------------------------------------------------------------------------
[Mode1] 2-color Mode
----------------------------------------------------------------------------*/
  (imageData:Uint8ClampedArray, memory:Memory, start:number, size:number)=>{
    let   idx = 0;
    const end = start + size / 8; // 1 byte covers 8 pixels
    for (let addr=start; addr<end; addr++) {
      const byte = memory.readByte(addr);  // 8 bits = 8 pixels
      for (let bit=0; bit<8; bit++) {
        const color = ((byte >> bit) & 1) ? 255 : 0;
        imageData[idx++] = color;  // R
        imageData[idx++] = color;  // G
        imageData[idx++] = color;  // B
        imageData[idx++] = OPAQUE; // A
      }
    }
  },
/*----------------------------------------------------------------------------
[Mode2] Monochrome Mode
----------------------------------------------------------------------------*/
  (imageData:Uint8ClampedArray, memory:Memory, start:number, size:number)=>{
    let   idx = 0;
    const end = start + size;

    for (let addr=start;  addr<end;  addr++) {
      const pixel = memory.readByte(addr) & 0xFF;
      imageData[idx++] = pixel;
      imageData[idx++] = pixel;
      imageData[idx++] = pixel;
      imageData[idx++] = OPAQUE;
    }
  }

]


