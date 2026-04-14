import { initVimMode } from 'monaco-vim';
import { genElem } from '../../util/genElem';

let vimMode:any = null;

export const applyVimModeElements = (element:HTMLElement, editor:IStandaloneCodeEditor)=>{
  const status    = genElem("div"   ,{id:"vim-status"});
  const button    = genElem("button",{id:"vim-button",classList:"closer"});
  element.after(button);
  element.after(status);

  button.addEventListener("click", ()=>{
    button.classList.toggle("on");
    if  (vimMode) { vimMode.dispose(); vimMode = null; } 
    else vimMode  = initVimMode(editor, status);
  });

  button.style.backgroundImage = `url(./src/img/Vimlogo.png)`;
}
