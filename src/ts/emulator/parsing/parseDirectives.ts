import { asciiToBytes, concatBytes, encodeManyLittleEndian, parseNumber } from "../util/bitwise";
import { isLegalInstruction, UnknownInstructionError } from "../Instructions";
import { CONST_TOKEN_INITIAL, ConstantRedefinedError, isAssemblerConstant, isDataDirective, isSectionDirective, isSymbolDirective, REGEX_IS_LABEL, REGEX_WHITESPACE, UnknownDirectiveError, type DataSegmentState, type PreprocessorState } from "./ParsingTypes";



export const parseLine = (state:PreprocessorState, line:string):PreprocessorState =>{
  if (!line) return state;
  const tokens:string[] = line.split(REGEX_WHITESPACE);
  const name  :string   = tokens[0];
  const currentSegment  = state.currentSegment;
  //console.log(currentSegment, line)
  if (name.match((REGEX_IS_LABEL))) return parseLabel            (state, tokens);
  if (isAssemblerConstant(tokens) ) return parseAssemblerConstant(state, tokens);
  if (isDataDirective   (name)    ) return parseDataDirective    (state, tokens);
  if (isSectionDirective(name)    ) return parseSectionDirective (state, tokens);
  if (isSymbolDirective (name)    ) return parseSymbolDirective  (state, tokens);
  if (currentSegment === "data"   ) return parseDataDirective    (state, tokens);
  if (currentSegment === "text"   ) return parseInstruction      (state, tokens);
  throw new UnknownDirectiveError(tokens[0]);
}


const parseSectionDirective = (state:PreprocessorState, tokens:string[]):PreprocessorState=> {
  const name = tokens[0];
  switch(name) {
    case ".section": return parseSectionDirective(state, tokens.slice(1));
    case ".text"   : state.currentSegment = "text"  ; return state;
    case ".data"   : state.currentSegment = "data"  ; return state;
    case ".bss"    : state.currentSegment = "bss"   ; return state;
    case ".rodata" : state.currentSegment = "rodata"; return state;
    default: throw new UnknownDirectiveError(name);
  }
}

const parseSymbolDirective = (state:PreprocessorState, tokens:string[]):PreprocessorState => {
  const name = tokens[0];
  switch(name) {
    case ".globl" : return state;
    case ".global": return state;
    case ".weak"  : return state;
    case ".local" : return state;
    case ".type"  : return state;
    case ".size"  : return state;
    case ".hidden": return state;
    default: throw new UnknownDirectiveError(name);
  }
};


const parseAssemblerConstant = (state:PreprocessorState, tokens:string[]):PreprocessorState=>{
  const name       = CONST_TOKEN_INITIAL.includes(tokens[0]) ? tokens[1] : tokens[0];
  const term       = CONST_TOKEN_INITIAL.includes(tokens[0]) ? tokens[0] : tokens[1];
  const value      = parseNumber(tokens[2]);
  const segment    = state.acc[state.currentSegment] as DataSegmentState;
  const savedValue = segment.constants.get(name);
  if (savedValue !== undefined) throw new ConstantRedefinedError(name, term, savedValue);
  switch(term) {
    case    "=": segment.labels.set(name, value); return state;
    case ".equ": segment.labels.set(name, value); return state;
    case ".set": segment.labels.set(name, value); segment.constants.set(name, value); return state;
  }
  console.log(name, term, value);
  throw new Error("An assembler constant was expected but not found (mika error).");
}

const parseDataDirective = ( state: PreprocessorState, tokens: string[]): PreprocessorState => {
  const segment = state.acc[state.currentSegment];
  const name    = tokens[0];
  const isLabel = name.match(REGEX_IS_LABEL);
  const rest    = tokens.slice(isLabel ?1:0);
  const values  = rest.slice(1);

  const pushMemory = (bytes: Uint8Array) => {
    const nameWithoutColon = name.replace(":", "");
    if (isLabel) segment.labels.set(nameWithoutColon, segment.memory.lastFreeByte);
    segment.memory.saturate(bytes);
  };

  //memory allocation
  switch (rest[0]) { 
    case ".byte" : pushMemory(encodeManyLittleEndian(values, 1));      return state;
    case ".short": pushMemory(encodeManyLittleEndian(values, 2));      return state;
    case ".word" : pushMemory(encodeManyLittleEndian(values, 4));      return state;
    case ".dword": pushMemory(encodeManyLittleEndian(values, 8));      return state;
    case ".space": pushMemory(new Uint8Array(parseNumber(values[0]))); return state;
    case ".ascii": pushMemory(asciiToBytes(values.join(" ")));         return state;
    case ".asciz": pushMemory(concatBytes(asciiToBytes(values.join(" ")), new Uint8Array([0]))); return state;
    case ".align": {
      const n     = parseNumber(values[0]);
      const align = 1 << n;
      const pad   = (align - (segment.memory.size % align)) % align;
      pushMemory(new Uint8Array(pad));
      return state;
    }
    default: throw new UnknownDirectiveError(tokens.join(" "));
  }
};

const parseInstruction = (state:PreprocessorState, tokens:string[]) : PreprocessorState => {
  const instructionName = tokens[0].replaceAll(",", "");
  state.pc++; //we ONLY increment pc if we hit an instruction!
  if (!isLegalInstruction(instructionName)) throw new UnknownInstructionError(instructionName);
  state.acc.text.instructions.push(tokens.map(token=>token.replaceAll(",", "")));
  return state;
}

const parseLabel = (state:PreprocessorState, tokens:string[]): PreprocessorState=>{
  const name = tokens[0];
  switch(state.currentSegment) {
      case "data"  : return parseDataDirective(state, tokens);
      case "bss"   : return parseDataDirective(state, tokens);
      case "rodata": return parseDataDirective(state, tokens);
      case "text"  : {
        //we set each label in the map to its position in the program counter.
        //The assembler will then calculate the offsets.
        const labelName     = name.replaceAll(":", ""); //remove : from end of label
        const labelPosition = state.pc;
        state.acc.text.labels.set(labelName, labelPosition); 
        return state;
      }
      default: throw new UnknownDirectiveError(tokens.join(", "));
  }
}

