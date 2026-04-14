import type { Saver, RegisterDefinition } from "./RegisterRegistry";
import { BYTE } from "./util/util";

export class Register {
  private cfg : RegisterDefinition;
  private val : number = 0; 
  set value   (v:number) { this.val = v; }

  get value   ():number            { return this.val;                   }
  get abiNames():string[]          { return this.cfg.abiNames;          }
  get abiName ():string            { return this.cfg.abiNames.map(name=>name.padStart(3)).join(",");}
  get desc    ():string            { return this.cfg.desc  ;            }
  get number  ():number|undefined  { return this.cfg.number;            }
  get saver   ():Saver |undefined  { return this.cfg.saver ;            }
  constructor(cfg:RegisterDefinition) { this.cfg = cfg; }
  
  toString():string{
    const val    = this.value.toString(16);
    const strVal = `0x${val}`.padStart(6);
    return `(${this.abiName}): [${strVal}]`;
  }
  readByte(index:number):string{
    return ((this.value >> (index * BYTE)) & 0xFF).toString(16).padStart(2, "0").toUpperCase();
  }

}

export class ZeroRegister extends Register {
  constructor(){super({number:0,abiNames:["x0","zero"],saver:undefined,desc:"Zero"})};
  get value():number {return 0;}
  set value(_:number){void   0;}
}

export class TimeRegister extends Register {
  constructor(){super({number:0,abiNames:["time"],saver:undefined,desc:"Time"})};
  get value():number {return Date.now() & 0xFFFFFFFF; }
  set value(_:number){void 0;                         }
}
