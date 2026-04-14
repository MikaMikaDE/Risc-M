import { genElem            } from "../../../util/genElem";
import { type Register      } from "../../../../emulator/Register";
import { toSigned, unsigned } from "../../../../emulator/util/bitwise";
    
const BYTES_PER_LINE = 4;

export class RegisterTable {
  element  :HTMLTableElement;
  tbody    :HTMLTableElement;
  rows     :Array<HTMLTableCellElement[]> = [];
//----------------------------------------------------------------------------------------------------------------------------
// Constructor 
//----------------------------------------------------------------------------------------------------------------------------
  constructor(){
    this.element    = genElem("table") as HTMLTableElement;
    this.tbody      = genElem("tbody") as HTMLTableElement;
    const thead     = genElem("thead"); this.element.appendChild(thead);
    const headerRow = genElem("tr"   ); thead.appendChild(headerRow);

    const headers   = ["Register", "Base-10 (Signed)", "Base-10 (Unsigned)"];
    for (const headerText  of  headers ) headerRow.appendChild(genElem("th", { textContent: headerText                         }));
    for (let i=0; i<BYTES_PER_LINE; i++) headerRow.appendChild(genElem("th", { textContent: `+${i.toString(16).toUpperCase()}` }));
    
    this.element.appendChild(this.tbody);
  }
//----------------------------------------------------------------------------------------------------------------------------
// 
//----------------------------------------------------------------------------------------------------------------------------
  buildRegisters(registers:Register[]){
    this.tbody.innerHTML = "";
    this.rows = [];
    for (const reg of registers) {
      const row = genElem("tr") as HTMLTableRowElement;
      row.appendChild(genElem("td",{ textContent: String(        (reg.abiName)) }) as HTMLTableCellElement);
      row.appendChild(genElem("td",{ textContent: String(toSigned(reg.value  )) }) as HTMLTableCellElement);
      row.appendChild(genElem("td",{ textContent: String(unsigned(reg.value  )) }) as HTMLTableCellElement);
      for (let i=0; i<BYTES_PER_LINE && i<4; i++) {
        row.appendChild(genElem("td", { textContent:"00"}) as HTMLTableCellElement);
      }
      this.tbody.appendChild(row);
      this.rows.push(Array.from(row.children) as HTMLTableCellElement[]);
    }
    this.update(registers);
  }
//----------------------------------------------------------------------------------------------------------------------------
// 
//----------------------------------------------------------------------------------------------------------------------------
  /*Performance Critical*/
  update(registers:Register[]){
    for (let i=0; i<registers.length; i++) {
      const [_name, signed, unsign, a,b,c,d] = this.rows[i];
      const reg = registers[i];
      signed.innerText = String(toSigned(reg.value));
      unsign.innerText = String(unsigned(reg.value));
      a.innerText = reg.readByte(0);
      b.innerText = reg.readByte(1);
      c.innerText = reg.readByte(2);
      d.innerText = reg.readByte(3);
    }
  }

}
