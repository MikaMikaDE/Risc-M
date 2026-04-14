import type { Segment } from "../../../../emulator/Segment";
import { genElem } from "../../../util/genElem";

const BYTES_PER_LINE = 16;

export class MemoryTable {
          element  :HTMLTableElement;
  private tbody    :HTMLTableCellElement;
  private cells    :HTMLTableCellElement[] = [];
  private lastBytes:Uint8Array = new Uint8Array();
  //private nonzeros :Uint8Array = new bitmap().fill(0);
//----------------------------------------------------------------------------------------------------------------------------
// constructor 
//----------------------------------------------------------------------------------------------------------------------------
  constructor(){
    const addressHeader = genElem("th"   ); addressHeader.innerText = "Address";
    const headerRow     = genElem("tr"   ); headerRow.append(addressHeader);
    const thead         = genElem("thead"); thead    .append(headerRow    );
    this.element        = genElem("table") as HTMLTableElement    ; this.element.append(thead     );
    this.tbody          = genElem("tbody") as HTMLTableCellElement; this.element.append(this.tbody);
    for (let i=0;  i<BYTES_PER_LINE;  i++) headerRow.append(genElem("th",{textContent:this.formatHead(i)}));
  }
//----------------------------------------------------------------------------------------------------------------------------
// Changing Segment - we create the table once, then store its cells for faster updating.
//----------------------------------------------------------------------------------------------------------------------------
  newSegment(segment:Segment) {
    this.cells = [];
    this.tbody.innerHTML = ""; 

    const newCell = (bytes:number):HTMLTableCellElement=>{
        const cell  = genElem("td", {innerText:this.formatByte(bytes)}) as HTMLTableCellElement;
        this.cells.push(cell);
        return cell as HTMLTableCellElement;
    }

    for (let i=0; i<segment.size; i+=BYTES_PER_LINE) {
      const row     = genElem("tr");
      row.appendChild(genElem("td", {textContent:this.formatHex(segment.baseAddress+i)}));//0x01, 0x02...
      for (let j=0; j<BYTES_PER_LINE && i+j<segment.size; j++) row.appendChild(newCell(segment.bytes[i+j]))
      this.tbody.appendChild(row);
    }
  }
//----------------------------------------------------------------------------------------------------------------------------
// Updating Segment 
//----------------------------------------------------------------------------------------------------------------------------
  /*performance-critical!*/
  update(segment:Segment){
    if (segment.bytes === this.lastBytes) return;


    for (let i=0; i<segment.size; i++) {
      const bytes = segment.bytes[i];
      if   (this.lastBytes[i] === bytes) continue; this.lastBytes[i] = bytes;

      const cell  = this.cells[i];
      cell.textContent = this.formatByte(bytes);
    }
    //TODO: highlight non-zero cells
  }
//----------------------------------------------------------------------------------------------------------------------------
// formatting helpers
//----------------------------------------------------------------------------------------------------------------------------
  private formatByte(byte:number):string{ return       byte.toString(16).padStart(2, "0").toUpperCase() }
  private formatHex ( hex:number):string{ return "0x"+  hex.toString(16).padStart(3, "0").toUpperCase() }
  private formatHead( row:number):string{ return "+" +  row.toString(16)                 .toUpperCase() }


}
