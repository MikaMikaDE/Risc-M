import { BYTE, WORD } from "./util";

export const MAX_20      = 0xFFFFF    ; // Max 20-bit unsigned value
export const MAX_32      = 0xFFFFFFFF ; // Max 32-bit unsigned value
export const SIGN_BIT_32 = 0x80000000 ; // Sign bit (bit 31) of 32-bit value
export const BITS_32     = 0x100000000; // 2^32, used to shift between upper/lower 32 bits

export const toLo32   = (x: number): number =>                        x & MAX_32;    // Extract lower 32 bits (handles overflow from mul/div)
export const toHi32   = (x: number): number =>  Math.floor(x / BITS_32) & MAX_32;    // Extract upper 32 bits (for MULH instruction)
export const unsigned = (n: number): number =>  n >>> 0;                             // Convert to unsigned 32-bit representation
export const toSigned = (x: number, bits: number = WORD): number => {
  const signBit   = 2 ** (bits - 1);
  const fullRange = 2 ** (bits    );
  return x >= signBit ? x - fullRange : x;
};

/**Parses as a legal immediate value, or throws if not legal*/
export const asImm = (x:any):number =>  {
  const valueAsNumber = Number(x);
  if    (isNaN(valueAsNumber)) throw new Error(`${x} is Not a Number, and cannot be used as an intermediate value.`);
  return valueAsNumber;
}

/*Parses a string or number as a valid js Number*/
export const parseNumber = (s: number|string): number => {
  const n = Number(String(s).replaceAll(",", ""));
  if (isNaN(n)) throw new Error(`Invalid number: ${s}`);
  return n;
};

/*Flatmaps an Array<Uint8Array> into one single Uint8Array*/
export const concatBytes = (...chunks: Uint8Array[]): Uint8Array => {
  const total = chunks.reduce((sum, chunk) => sum + chunk.length, 0);
  const out   = new Uint8Array(total);
  let offset = 0;
  for (const chunk of chunks) {
    out.set(chunk, offset);
    offset += chunk.length;
  }
  return out;
};

/*Encodes a number or number-parsable string into a Uint8Array of that number*/
export const encodeLittleEndian = (value: number|string, size: number): Uint8Array => {
  const bytes  = new Uint8Array(size);
  let   val    = BigInt(parseNumber(value));  //bigint prevents javascript 32-bit presicion issues 
  for (let i=0; i<size; i++) {                //for each byte:
    bytes[i] = Number(val & 0xFFn);           //set that byte to its number representation 
    val    >>= 8n;                            //get the next byte by right shifting
  }
  return bytes;
};

/**/
export const encodeManyLittleEndian = ( values: Array<number|string>, size: number): Uint8Array =>
  concatBytes(...values.map(v => encodeLittleEndian(v, size)));

/*Decodes a little-endian stored Uint8Array into a numeric representation*/
export const decodeLittleEndian = (bytes:Uint8Array, offset:number, size:number): number => {
  let value = 0n;
  for (let i=0; i<size; i++) {                     //for each required byte i:
    const byte        = BigInt(bytes[offset + i]); //Get curent byte from arr
    const shiftAmount = BigInt(i * BYTE);          //it will go to position i
    const shifted     = byte << shiftAmount;       //shift byte to position i
    value |= shifted;                              //set byte into return int
  }
  return Number(value);
};

/*Converts a string to its byte representation*/
export const asciiToBytes = (s: string): Uint8Array => {
  const bytes = new Uint8Array(s.length);
  for (let i=0; i<s.length; i++) bytes[i] = s.charCodeAt(i) & 0xFF;
  return bytes;
};
