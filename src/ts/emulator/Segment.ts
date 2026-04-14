export class Segment {
    canRead      :boolean    = false;
    canWrite     :boolean    = false;
    bytes        :Uint8Array = new Uint8Array(0);
    name         :string     = "Unknown Segment";
    size         :number     = 0;
    lastFreeByte :number     = 0;
    baseAddress  :number     = 0;
get lastAddress():number{ return this.baseAddress + this.size; }
//----------------------------------------------------------------------------------------------------------------------------
/*constructors*/
//----------------------------------------------------------------------------------------------------------------------------
  static Text  (size:number):Segment{ return new Segment("text"  , size, false, false); }
  static Rodata(size:number):Segment{ return new Segment("rodata", size, true , false); }
  static Data  (size:number):Segment{ return new Segment("data"  , size, true , true ); }
  static Bss   (size:number):Segment{ return new Segment("bss"   , size, true , true ); }
  static Heap  (size:number):Segment{ return new Segment("heap"  , size, true , true ); }
  static Stack (size:number):Segment{ return new Segment("stack" , size, true , true ); }
  private constructor(name:string, size:number, canRead:boolean, canWrite:boolean){
    this.name     = name;
    this.bytes    = new Uint8Array(size).fill(0);
    this.canRead  = canRead;
    this.canWrite = canWrite;
    this.size     = size;
  } 
//----------------------------------------------------------------------------------------------------------------------------
/*execution methods*/
//----------------------------------------------------------------------------------------------------------------------------
  saturate(data:Uint8Array){ 
    for (const byte of data) {
      if (byte > 0xFF) throw new WrongSizedByteError(this.name, data, byte);
      this.bytes[this.lastFreeByte] = byte;
      this.lastFreeByte++;
    }
  } 
//----------------------------------------------------------------------------------------------------------------------------
// html helpers - these just return useful strings for the frontend.
//----------------------------------------------------------------------------------------------------------------------------
  get paddedName():string{ return this.name.padEnd(6, " ");                                            }
  get region    ():string{ return `${this.baseAddress.toString(16)}:${this.lastAddress.toString(16)}`; }

}
//----------------------------------------------------------------------------------------------------------------------------
/*Error Types*/
//----------------------------------------------------------------------------------------------------------------------------
class WrongSizedByteError extends Error {
  constructor(name:string, data:Uint8Array, byte:number){
    super(`Cannot saturate ${name} with ${data}: ${byte} is larger than 0xFF`);
    this.name = "WrongSizedByteError";
  }
}
