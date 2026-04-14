import { type SegmentName } from "../Memory";
import { type Segment     } from "../Segment";

export const REGEX_NEWLINE          = /\n/;
export const REGEX_WHITESPACE       = /\s+/;
export const REGEX_COMMENT          = /(#.*)$/;
export const REGEX_IS_DIRECTIVE     = /^\./;
export const REGEX_IS_LABEL         = /.*\:$/;
export const REGEX_LABEL_WITH_VALUE = /^(\w+):\s*(.+)$/;
export const REGEX_REPEAT_SYNTAX    = /^(.+):(\d+)$/;     // Matches "0:10"
export const REGEX_STRING_LITERAL   = /^"(.*)"|'(.*)'$/;  // Matches "..." or '...'
/*monaco/helpers*/
export const REGEX_WORD             = /\.[a-zA-Z]+/
export const REGEX_NUMBER           = /\b\d+\b/
export const REGEX_HEX              = /\b(0x[0-9a-fA-F]+)\b/

export const DATA_DIRECTIVES        = [".byte" , ".short" , ".word", ".dword", ".ascii", ".asciz", ".align", ".space"];
export const SYMBOL_DIRECTIVES      = [".globl", ".global", ".weak", ".local", ".type" , ".size" , ".hidden"         ];
export const SECTION_DIRECTIVES     = [".text" , ".data"  , ".bss" , ".rodata", ".section"                           ];
export const CONST_TOKEN_INITIAL    = [".equ"  , ".set"];
export const CONST_TOKEN_SECONDARY  = ["="             ];

export const isSectionDirective     = (directiveName:string  ):boolean=> SECTION_DIRECTIVES .includes(directiveName);
export const isSymbolDirective      = (directiveName:string  ):boolean=> SYMBOL_DIRECTIVES  .includes(directiveName);
export const isDataDirective        = (directiveName:string  ):boolean=> DATA_DIRECTIVES    .includes(directiveName);
export const isAssemblerConstant    = (       tokens:string[]):boolean=> CONST_TOKEN_INITIAL.includes(tokens[0]) || CONST_TOKEN_SECONDARY.includes(tokens[1]);

export type PreprocessorSegmentName = Extract<SegmentName,    "text" | "rodata" | "data" | "bss"> ;
export type DataSegmentKey          = Extract<PreprocessorSegmentName, "rodata" | "data" | "bss"> ;
export type DataSegmentState        = { labels:Map<string,number>; constants:Map<string, number>  ; memory:Segment; };
export type TextSegmentState        = { labels:Map<string,number>; instructions:string[][]        ; memory:Segment; };
export type PreprocessorAcc         = { text  :TextSegmentState  ; rodata        :DataSegmentState; data:DataSegmentState; bss:DataSegmentState; };
export type PreprocessorState       = { acc   :PreprocessorAcc   ; currentSegment:PreprocessorSegmentName;                  pc:number;           };

export class UnknownDirectiveError extends Error {
  constructor(directiveName:string) {
    super(`Unknown Directive name: ${directiveName}`);
    this.name = "UnknownDirectiveError";
  }
}

export class ConstantRedefinedError extends Error {
  constructor(name:string, term:string, savedValue:number) {
    super(`cannot apply constant: ${name}, ${term}.\n${name} is already defined as ${savedValue}`);
    this.name = "UnknownDirectiveError";
  }
}

