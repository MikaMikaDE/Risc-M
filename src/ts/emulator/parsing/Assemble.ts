import type { DataSegmentState, PreprocessorAcc, TextSegmentState } from "./ParsingTypes";


//todo: DRY this

const assembleInstructionLabels = (textSegmentData:TextSegmentState):string[][] =>
  textSegmentData.instructions.map((line:string[], index:number)=>line.map(term=>{
      const  value = textSegmentData.labels.get(term);
      return value !== undefined ? String(value - index) : term;
  }));

const assembleDataLabels = (instructions:string[][], segmentData:DataSegmentState):string[][]=>
  instructions.map((line:string[])=>line.map(term=>{
      const  value = segmentData.labels.get(term);
      return value !== undefined ? String(value + segmentData.memory.baseAddress) : term;
  }));

/*Using text.instructions, we need to:
  * - replace all text labels with instruction offsets.
  * - replace all data labels with addresses in memory*/
const dataSegments = ["data", "rodata", "bss"] as const;
export const assembleInstructions = (segments: PreprocessorAcc) => dataSegments.reduce(
  (instructions, segment) => assembleDataLabels(instructions, segments[segment]),
  assembleInstructionLabels(segments.text)
);
