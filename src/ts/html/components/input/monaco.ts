import { } from "./monaco-setup"
import { LEGAL_INSTRUCTIONS                                                                            } from "../../../emulator/Instructions";
import { REGISTER_NAMES, REGISTER_REGISTRY, type RegisterDefinition                                    } from "../../../emulator/RegisterRegistry";
import { DATA_DIRECTIVES,SYMBOL_DIRECTIVES,SECTION_DIRECTIVES,CONST_TOKEN_INITIAL, REGEX_REPEAT_SYNTAX } from "../../../emulator/parsing/ParsingTypes";
import { REGEX_COMMENT  ,REGEX_HEX, REGEX_NUMBER                                                       } from "../../../emulator/parsing/ParsingTypes";
import * as monaco from "monaco-editor";
import { applyVimModeElements } from "./monaco-vim";
import { COLORS } from "./colors";
const ALL_DIRECTIVES = [...DATA_DIRECTIVES, ...SYMBOL_DIRECTIVES, ...SECTION_DIRECTIVES, ...CONST_TOKEN_INITIAL];

monaco.languages.register({ id: "riscv" });
monaco.languages.setMonarchTokensProvider("riscv", {
  keywords  : LEGAL_INSTRUCTIONS,
  registers : ["x0","zero","time", ...REGISTER_NAMES],
  directives: ALL_DIRECTIVES,
  tokenizer: {
    root: [
      [REGEX_COMMENT      , "comment"     ],
      [REGEX_HEX          , "number.hex"  ],
      [REGEX_NUMBER       , "number"      ],
      [REGEX_REPEAT_SYNTAX, "string"      ],
      [/\.[a-zA-Z]+/, {cases: {
        "@directives": "keyword.directive",  // known directives highlighted
        "@default":    "invalid",            // unknown .xyz flagged
      }}],
      [/_[a-zA-Z_]+/, "type.identifier"],
      [/\b([a-zA-Z_]\w*)\b/, { /*instructions*/
        cases: {
          "@keywords":  "keyword",
          "@registers": "variable.predefined",
          "@default":   "identifier",
        }
      }],
    ],
  },
});
monaco.editor.defineTheme("riscv-dark", {
  base:    "vs-dark",
  inherit: true,
  rules: [
    { token: "keyword",            foreground: COLORS.blue   }, // instructions
    { token: "type.identifier",    foreground: COLORS.pink   }, // labels
    { token: "variable.predefined",foreground: COLORS.green  }, // registers
    { token: "comment",            foreground: "#608080"   }, // green
    { token: "number",             foreground: COLORS.yellow }, // number
    { token: "number.hex",         foreground: COLORS.orange }, // number
    { token: "keyword.directive",  foreground: "#BBFFDD"   }, // directive
    { token: "invalid",            foreground: COLORS.pink   }, // palered
  ],
  colors:  {
    "editor.background": getComputedStyle(document.documentElement).getPropertyValue('--black2').trim(),
  },
});


const registerMap = new Map<string, RegisterDefinition>();
for (const reg of REGISTER_REGISTRY) {
  for (const name of reg.abiNames) registerMap.set(name, reg);//todo: also need to get x1, x2 etc, and zero?
}
monaco.languages.registerHoverProvider('riscv', {
  provideHover(model, position) {
    const word = model.getWordAtPosition(position); if  (!word) return null;
    const reg = registerMap.get(word.word);         if  (!reg ) return null;
    return { contents: [
      { value: `**Register ${reg.abiNames.join(', ')}**` },
      { value: `${reg.desc}` },
      { value: `Saver: ${reg.saver ?? 'N/A'}` },
    ]};
  }
});



export const addMonacoTextEditor = (element: HTMLElement) => {

  const editor = monaco.editor.create(element, {
    language: "riscv",
    theme   : "riscv-dark",
    minimap : { enabled:false },
    fontSize: 14
  });

  element.id = "monaco";
  editor.layout();
  const observer = new ResizeObserver(() => editor.layout());
  observer.observe(element); 
  
  applyVimModeElements(element, editor);


  return editor;
};

