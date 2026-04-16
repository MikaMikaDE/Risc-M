import { initVimMode , VimMode} from 'monaco-vim';
import { genElem     } from '../../util/genElem';
import type { editor } from "monaco-editor";
import { save } from './saveLoad';

let vimMode:any = null;


export const applyVimModeElements = (element:HTMLElement, editor:editor.IStandaloneCodeEditor)=>{
  const status    = genElem("div"   ,{id:"vim-status"});
  const button    = genElem("button",{id:"vim-button",classList:"icon"}); button.setAttribute("data-tooltip", "vim");
  element.after(button);
  element.after(status);

  (VimMode as any).Vim.defineEx('write', 'w', ()=>save(editor));

  button.addEventListener("click", ()=>{
    button.classList.toggle("on");
    if  (vimMode) { vimMode.dispose(); vimMode = null; } 
    else vimMode = initVimMode(editor, status);
  });

  button.style.backgroundImage = `url(./src/img/Vimlogo.png)`;
}
