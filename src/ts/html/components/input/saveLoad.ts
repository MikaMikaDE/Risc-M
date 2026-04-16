import { genElem     } from "../../util/genElem";
import { editor } from "monaco-editor";



const LOCAL_STORAGE_NAME = "last-saved";
export const save = (editor:editor.IStandaloneCodeEditor)=>{
  localStorage.setItem(LOCAL_STORAGE_NAME, editor.getValue());
  alert("Saved to local storage.");
}
export const load = (editor:editor.IStandaloneCodeEditor)=>{
  const saved = localStorage.getItem(LOCAL_STORAGE_NAME);
  if (saved) editor.setValue(saved);
  else alert("No locally stored text was found.");
}


export function applySaveLoadAbility(element:HTMLElement,editor:editor.IStandaloneCodeEditor){
  const saveButton = genElem("button",{id:"save-button",classList:"icon",onclick:()=>save(editor)}); saveButton.setAttribute("data-tooltip", "save");
  const loadButton = genElem("button",{id:"load-button",classList:"icon",onclick:()=>load(editor)}); loadButton.setAttribute("data-tooltip", "load");

  saveButton.style.backgroundImage = `url(./src/img/save.png)`;
  loadButton.style.backgroundImage = `url(./src/img/load.png)`;
  element.after(saveButton, loadButton);
}
