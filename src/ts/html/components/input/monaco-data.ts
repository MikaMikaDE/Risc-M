import { CONST_TOKEN_INITIAL, DATA_DIRECTIVES, REGEX_COMMENT, REGEX_HEX, REGEX_NUMBER, REGEX_REPEAT_SYNTAX, SECTION_DIRECTIVES, SYMBOL_DIRECTIVES } from "../../../emulator/parsing/ParsingTypes";
import { LEGAL_INSTRUCTIONS } from "../../../emulator/Instructions";
import { REGISTER_NAMES     } from "../../../emulator/RegisterRegistry";
import { COLORS             } from "./colors";
const ALL_DIRECTIVES = [...DATA_DIRECTIVES, ...SYMBOL_DIRECTIVES, ...SECTION_DIRECTIVES, ...CONST_TOKEN_INITIAL];

export const TOKENS_PROVIDER = {
  keywords  : LEGAL_INSTRUCTIONS,
  registers : REGISTER_NAMES,
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
}


export const THEME = {
    base   : "vs-dark", 
    inherit: true,
    colors : { "editor.background": "#222222", },
    rules  : [
      { token: "keyword",            foreground: COLORS.blue   }, // instructions
      { token: "type.identifier",    foreground: COLORS.pink   }, // labels
      { token: "variable.predefined",foreground: COLORS.green  }, // registers
      { token: "comment",            foreground: "#608080"   }, // green
      { token: "number",             foreground: COLORS.yellow }, // number
      { token: "number.hex",         foreground: COLORS.orange }, // number
      { token: "keyword.directive",  foreground: "#BBFFDD"   }, // directive
      { token: "invalid",            foreground: COLORS.pink   }, // palered
    ],
}


export const EDITOR = {
    language: "riscv",
    theme   : "riscv-dark",
    minimap : { enabled:false },
    fontSize: 14
}
