import { Segment   } from "../Segment";
import { KB        } from "../util/util";
import { parseLine } from "./parseDirectives";
import { REGEX_COMMENT, REGEX_NEWLINE, type PreprocessorAcc, type PreprocessorSegmentName } from "./ParsingTypes";

const preprocessorState = () => { return {
  currentSegment: "text" as PreprocessorSegmentName,
  pc : 0,
  acc: {
    text  : { labels:new Map(), instructions:new Array(), memory:Segment.Text  (KB)  },
    rodata: { labels:new Map(), constants   :new Map()  , memory:Segment.Rodata(KB)  },
    data  : { labels:new Map(), constants   :new Map()  , memory:Segment.Data  (KB)  },
    bss   : { labels:new Map(), constants   :new Map()  , memory:Segment.Bss   (KB)  },
  },
};};

export const preprocess = (code: string): PreprocessorAcc => code
  .split(REGEX_NEWLINE)
  .map   ((line) => line.replace(REGEX_COMMENT, ""))
  .map   ((line) => line.trim())
  .filter((line) => line !== "")
  .reduce((state, line) => parseLine(state, line), preprocessorState())
  .acc;

