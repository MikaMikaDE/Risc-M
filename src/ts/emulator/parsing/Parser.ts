import { Segment   } from "../Segment";
import { KB        } from "../util/util";
import { parseLine } from "./parseDirectives";
import { REGEX_COMMENT, REGEX_NEWLINE, type PreprocessorState, type PreprocessorSegmentName } from "./ParsingTypes";

const preprocessorState = () => { return {
  currentSegment: "text" as PreprocessorSegmentName,
  variables: new Map<string,number>(),
  constants: [] as string[],
  pc : 0,
  acc: {
    text     : { labels:new Map(), memory:Segment.Text  (KB), instructions:new Array()  },
    rodata   : { labels:new Map(), memory:Segment.Rodata(KB)  },
    data     : { labels:new Map(), memory:Segment.Data  (KB)  },
    bss      : { labels:new Map(), memory:Segment.Bss   (KB)  },
  },
};};

export const preprocess = (code:string): PreprocessorState => code
  .split(REGEX_NEWLINE)
  .map   ((line) => line.replace(REGEX_COMMENT, ""))
  .map   ((line) => line.trim())
  .filter((line) => line !== "")
  .reduce((state, line) => parseLine(state, line), preprocessorState())
