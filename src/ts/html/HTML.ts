import { genElem } from "./util/genElem.ts";
import { makeBox } from "./util/makeBox.ts";
//-----------------------------------------------------------------------------------------//
// Getting Sections from raw HTML page
//-----------------------------------------------------------------------------------------//
const SECTION = {
  left  : genElem("section",{id:"left"  }),
  mid   : genElem("section",{id:"middle"}),
  right : genElem("section",{id:"right" }),
}
for (const section of Object.values(SECTION)) document.body.appendChild(section);

//-----------------------------------------------------------------------------------------//
// The info box with section title 
//-----------------------------------------------------------------------------------------//
const TITLE            = "Mika's Risc-V Emulator";
const titleBox         = genElem("div",{classList:"box"}) as HTMLDivElement;
const titleText        = genElem("h1" ,{innerText:TITLE}) as HTMLDivElement;
const button_container = genElem("div",{id:"buttons"   }) as HTMLDivElement;
titleBox.append(titleText, button_container); SECTION.left.appendChild(titleBox);

//-----------------------------------------------------------------------------------------//
// Setting up Buttons
//-----------------------------------------------------------------------------------------//
export const BUTTON = {
  start:genElem("button", {id:"btn_start",innerText:"Start"}) as HTMLButtonElement, 
  slow :genElem("button", {id:"btn_slow" ,innerText:"Slow" }) as HTMLButtonElement, 
  step :genElem("button", {id:"btn_step" ,innerText:"Step" }) as HTMLButtonElement,
  reset:genElem("button", {id:"btn_reset",innerText:"Reset"}) as HTMLButtonElement,
  halt :genElem("button", {id:"btn_halt" ,innerText:"Halt" }) as HTMLButtonElement, 
  help :genElem("button", {id:"btn_help" ,innerText:"Info" }) as HTMLButtonElement,
}
Object.values(BUTTON).forEach(btn=>button_container.appendChild(btn));
BUTTON.help.addEventListener("click", ()=>window.open("https://projectf.io/posts/riscv-cheat-sheet/", '_blank')?.focus());

//-----------------------------------------------------------------------------------------//
// Setting up Windows 
//-----------------------------------------------------------------------------------------//
export const WINDOW = {//TitleText    //Side         //type   //hide
  input     : makeBox("Instructions", SECTION.left , "div"          ) as any, /*monaco elem*/
  screen    : makeBox("Screen"      , SECTION.left , "canvas"  ,true) as HTMLCanvasElement  ,
  testCases : makeBox("Examples"    , SECTION.left , "pre"     ,true) as HTMLPreElement     ,
  log       : makeBox("Status"      , SECTION.mid  , "pre"          ) as HTMLPreElement     ,
  registers : makeBox("Registers"   , SECTION.mid  , "span"         ) as HTMLSpanElement    ,
  history   : makeBox("History"     , SECTION.mid  , "pre"          ) as HTMLPreElement     ,
  memControl: makeBox("Segment"     , SECTION.right, "span"         ) as HTMLSpanElement    ,
  memory    : makeBox("Memory"      , SECTION.right, "span"         ) as HTMLPreElement     ,
}

import {   EXAMPLES   } from "./components/examples/examples";      WINDOW.testCases.innerText = EXAMPLES.testCases;
import { addMonacoTextEditor } from "./components/input/monaco.ts"; WINDOW.input = addMonacoTextEditor(WINDOW.input);
                                                                    WINDOW.input.setValue(EXAMPLES.default);
