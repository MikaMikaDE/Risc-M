import { toSigned } from "../util/bitwise";
import type { DataSegmentState, PreprocessorState, TextSegmentState } from "./ParsingTypes";


//todo: DRY this?

const assembleInstructionLabels = (textSegmentData:TextSegmentState):string[][] =>
  textSegmentData.instructions.map((line:string[], index:number)=>line.map(term=>{
      const  value = textSegmentData.labels.get(term);
      return value !== undefined ? String(value - index) : term;
  }));

const assembleDataLabels = (instructions:string[][], segmentData:DataSegmentState, variables:Map<string,number>):string[][]=>
//todo: might be possible to "overwrite" instruction names?
  instructions.map((line:string[])=>line.map(term=>{
      const  labelVal    = segmentData.labels.get(term); if (labelVal   !== undefined) return String(labelVal + segmentData.memory.baseAddress);
      const  constantVal =          variables.get(term); if (constantVal!== undefined) return String(toSigned(constantVal));
      return term;
  }));

/*Using text.instructions, we need to:
  * - replace all text labels with instruction offsets.
  * - replace all data labels with addresses in memory*/
const dataSegments = ["data", "rodata", "bss"] as const;
export const assembleInstructions = (state: PreprocessorState) => dataSegments.reduce(
  (instructions, segment) => assembleDataLabels(instructions, state.acc[segment], state.variables),
  assembleInstructionLabels(state.acc.text)
);
