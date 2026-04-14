import { Segment } from "./Segment";
import { decodeLittleEndian, encodeLittleEndian } from "./util/bitwise";
export type SegmentName= "text"  | "data" | "rodata" | "bss" | "stack" | "heap";

export class Memory {
  text  :Segment = Segment.Text  (0);
  data  :Segment = Segment.Data  (0);
  rodata:Segment = Segment.Rodata(0);
  bss   :Segment = Segment.Bss   (0);
  heap  :Segment = Segment.Heap  (0);
  stack :Segment = Segment.Stack (0);
  size  :number  = 0;

  static readonly segNames = ["text", "rodata", "heap", "stack", "data", "bss"] as const;
  get    segments():    Segment[]{ return Memory.segNames.map(name=>this[name]); }
  get    bytes   (): Uint8Array[]{ return   this.segments.flatMap(s => s.bytes); }
//----------------------------------------------------------------------------------------------------------------------------
/*constructor*/
//----------------------------------------------------------------------------------------------------------------------------
  constructor(segs?:Record<SegmentName, Segment>) {
    this.size = (segs) ? Memory.segNames.reduce((offset, name) => {
      this[name] = segs[name];
      this[name].baseAddress = offset;
      return offset + segs[name].size;
    }, 0) : 0;
  }
//----------------------------------------------------------------------------------------------------------------------------
/*Read/Write*/
//----------------------------------------------------------------------------------------------------------------------------
  readWord (address: number): number       { return this.readLittleEndian( address,        4); }
  readHalf (address: number): number       { return this.readLittleEndian( address,        2); }
  readByte (address: number): number       { return this.readLittleEndian( address,        1); }
  writeWord(address: number, value: number): void { this.writeLittleEndian(address, value, 4); }
  writeHalf(address: number, value: number): void { this.writeLittleEndian(address, value, 2); }
  writeByte(address: number, value: number): void { this.writeLittleEndian(address, value, 1); }
//----------------------------------------------------------------------------------------------------------------------------
/*helpers*/
//----------------------------------------------------------------------------------------------------------------------------
  getSegment(address:number):Segment{
    if (address < 0 || address > this.size) throw new MemoryAccessError(address, this.size);
    for (const seg of this.segments) if (address>=seg.baseAddress && address<seg.lastAddress) return seg;
    throw new MemoryAccessError(address, this.size);
  }
  getSegmentByName(name:SegmentName) {
    if (!Memory.segNames.includes(name)) throw new SegmentNotFoundError(name);
    return this[name as SegmentName];
  }
  private getSegmentOffset(address: number) {
    const segment = this.getSegment(address);
    const bytes   = segment.bytes;
    const offset  = address - segment.baseAddress;
    return { bytes, offset };
  }
  private readLittleEndian(address: number, size: number): number {
    const { bytes, offset } = this.getSegmentOffset(address);
    return decodeLittleEndian(bytes, offset, size) >>> 0;
  }
  private writeLittleEndian(address: number, value: number, size: number): void {
    const { bytes, offset } = this.getSegmentOffset(address);
    bytes.set(encodeLittleEndian(value, size), offset);
  }
}
//----------------------------------------------------------------------------------------------------------------------------
/*Error Types*/
//----------------------------------------------------------------------------------------------------------------------------
class MemoryAccessError extends Error {
  constructor(address: number, limit:number) {
    super(`Address 0x${address.toString(16)} is out of bounds (Legal range is [0:${limit.toString(16)}])`);
    this.name = "MemoryAccessError";
  }
}
class SegmentNotFoundError extends Error {
  constructor(name:string) {
    super(`Segment ${name} does not exist in memory.`);
    this.name = "SegmentNotFoundError";
  }
}
