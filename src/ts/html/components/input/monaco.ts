import * as monaco                        from "monaco-editor";
import { EDITOR, THEME, TOKENS_PROVIDER } from "./monaco-data";
import { provideHover                   } from "./monaco-hover";
import { applyVimModeElements           } from "./monaco-vim";
import { applySaveLoadAbility           } from "./saveLoad";

/*Sets up the monaco webworker, as required by the library*/
import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker';
(window as any).MonacoEnvironment = {
  getWorker(_: any, _label: string) { return new editorWorker(); },
};


export const addMonacoTextEditor = (element: HTMLElement) => {
  monaco.languages.register({ id: "riscv" });
  monaco.languages.setMonarchTokensProvider("riscv", TOKENS_PROVIDER as any);
  monaco.languages.registerHoverProvider   ('riscv', { provideHover }      );
  monaco.editor   .defineTheme             ("riscv-dark", THEME      as any);

  const editor = monaco.editor.create(element, EDITOR);       
  new ResizeObserver(() => editor.layout()).observe(element); /*had resize issue without this*/
  element.id = "monaco"; /*applies css changes - notably, height*/
  applyVimModeElements(element, editor);
  applySaveLoadAbility(element, editor);

  return editor;
};

