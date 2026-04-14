import type { Memory } from "../emulator/Memory.ts";

const OPAQUE = 0xFF;

export const GRAPHICS_MODES = [
  /*2-color Mode*/
  (imageData:Uint8ClampedArray, memory:Memory, start:number, size:number)=>{
    let   idx = 0;
    const end = start + size / 32;
    for (let addr = start; addr < end; addr++) {
      const word = memory.readWord(addr); // 32 bits = 32 pixels
      for (let bit = 0; bit < 32; bit++) {
        const on = (word >> bit) & 1;
        const color = on ? 255 : 0;
        imageData[idx++] = color;  // R
        imageData[idx++] = color;  // G
        imageData[idx++] = color;  // B
        imageData[idx++] = OPAQUE; // A
      }
    }
  },
  /*Monochrome Mode*/
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
  },
  /*RGB111 Indexed Mode (3-bit palette)
    Byte 0: [ P0 P0 P0| P1 P1 P1| P2 P2 ]
    Byte 1: [ P2|P3 P3 P3| P4 P4 P4| P5 ]
    Byte 2: [ P5 P5| P6 P6 P6| P7 P7 P7 ]
  * */
  (imageData:Uint8ClampedArray, memory:Memory, start:number, size:number) => {
    let idx = 0;
    const end = start + (size * 3 / 8);  // 3 bytes per 8 pixels
    const PALETTE_ADDR = 0xC00;
    for (let addr = start; addr < end; addr += 3) {
      const b0 = memory.readByte(addr + 0);
      const b1 = memory.readByte(addr + 1);
      const b2 = memory.readByte(addr + 2);
      // unpack 8 x 3-bit indices
      const indices = [
         (b0 >> 5) & 0x7,
         (b0 >> 2) & 0x7,
        ((b0 & 0x3) << 1) | (b1 >> 7),
         (b1 >> 4) & 0x7,
         (b1 >> 1) & 0x7,
        ((b1 & 0x1) << 2) | (b2 >> 6),
         (b2 >> 3) & 0x7,
          b2       & 0x7,
      ];
      for (const i of indices) {
        const pal = PALETTE_ADDR + i * 3;
        imageData[idx++] = memory.readByte(pal + 0); // R
        imageData[idx++] = memory.readByte(pal + 1); // G
        imageData[idx++] = memory.readByte(pal + 2); // B
        imageData[idx++] = OPAQUE;
      }
    }
  },
  /*RGB444 Mode (12-bit, 1.5 bytes per pixel)*/
  (imageData:Uint8ClampedArray, memory:Memory, start:number, size:number) => {
    let   idx = 0;
    const end = start + (size * 3 / 2);  // 3 bytes per 2 pixels
    for (let addr = start; addr < end; addr += 3) {
      const b0 = memory.readByte(addr + 0);
      const b1 = memory.readByte(addr + 1);
      const b2 = memory.readByte(addr + 2);
      // scale nibble 0-15 → 0-255 by multiplying by 17 (255 / 15 = 17)
      // Pixel 1
      imageData[idx++] = ((b0 >> 4) & 0xF) * 17; // R
      imageData[idx++] = ( b0       & 0xF) * 17; // G
      imageData[idx++] = ((b1 >> 4) & 0xF) * 17; // B
      imageData[idx++] = OPAQUE;
      // Pixel 2
      imageData[idx++] = ( b1       & 0xF) * 17; // R
      imageData[idx++] = ((b2 >> 4) & 0xF) * 17; // G
      imageData[idx++] = ( b2       & 0xF) * 17; // B
      imageData[idx++] = OPAQUE;
    }
  },


]
