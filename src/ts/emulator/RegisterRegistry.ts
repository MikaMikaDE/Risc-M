
export type Saver = "callee" | "caller";

export type RegisterDefinition = {
  number  : number|undefined;
  saver   : Saver |undefined;
  abiNames: string[]; //list of alias
  desc    : string  ;
};

export const REGISTER_REGISTRY: RegisterDefinition[] = [
  { number:  1      , abiNames:["x1" , "ra" ]   , saver: "caller", desc: "Return address"                   },
  { number:  2      , abiNames:["x2" , "sp" ]   , saver: "callee", desc: "Stack pointer"                    },
  { number:  3      , abiNames:["x3" , "gp" ]   , saver:undefined, desc: "Global pointer"                   },
  { number:  4      , abiNames:["x4" , "tp" ]   , saver:undefined, desc: "Thread pointer"                   },
  { number:  5      , abiNames:["x5" , "t0" ]   , saver: "caller", desc: "Temporary"                        },
  { number:  6      , abiNames:["x6" , "t1" ]   , saver: "caller", desc: "Temporary"                        },
  { number:  7      , abiNames:["x7" , "t2" ]   , saver: "caller", desc: "Temporary"                        },
  { number:  8      , abiNames:["x8","s0","fp"] , saver: "callee", desc: "Saved register    / frame pointer"},
  { number:  9      , abiNames:["x9" , "s1" ]   , saver: "callee", desc: "Saved register"                   },
  { number: 10      , abiNames:["x10", "a0" ]   , saver: "caller", desc: "Function argument / return value" },
  { number: 11      , abiNames:["x11", "a1" ]   , saver: "caller", desc: "Function argument / return value" },
  { number: 12      , abiNames:["x12", "a2" ]   , saver: "caller", desc: "Function argument"                },
  { number: 13      , abiNames:["x13", "a3" ]   , saver: "caller", desc: "Function argument"                },
  { number: 14      , abiNames:["x14", "a4" ]   , saver: "caller", desc: "Function argument"                },
  { number: 15      , abiNames:["x15", "a5" ]   , saver: "caller", desc: "Function argument"                },
  { number: 16      , abiNames:["x16", "a6" ]   , saver: "caller", desc: "Function argument"                },
  { number: 17      , abiNames:["x17", "a7" ]   , saver: "caller", desc: "Function argument"                },
  { number: 18      , abiNames:["x18", "s2" ]   , saver: "callee", desc: "Saved register"                   },
  { number: 19      , abiNames:["x19", "s3" ]   , saver: "callee", desc: "Saved register"                   },
  { number: 20      , abiNames:["x20", "s4" ]   , saver: "callee", desc: "Saved register"                   },
  { number: 21      , abiNames:["x21", "s5" ]   , saver: "callee", desc: "Saved register"                   },
  { number: 22      , abiNames:["x22", "s6" ]   , saver: "callee", desc: "Saved register"                   },
  { number: 23      , abiNames:["x23", "s7" ]   , saver: "callee", desc: "Saved register"                   },
  { number: 24      , abiNames:["x24", "s8" ]   , saver: "callee", desc: "Saved register"                   },
  { number: 25      , abiNames:["x25", "s9" ]   , saver: "callee", desc: "Saved register"                   },
  { number: 26      , abiNames:["x26", "s10"]   , saver: "callee", desc: "Saved register"                   },
  { number: 27      , abiNames:["x27", "s11"]   , saver: "callee", desc: "Saved register"                   },
  { number: 28      , abiNames:["x28", "t3" ]   , saver: "caller", desc: "Temporary"                        },
  { number: 29      , abiNames:["x29", "t4" ]   , saver: "caller", desc: "Temporary"                        },
  { number: 30      , abiNames:["x30", "t5" ]   , saver: "caller", desc: "Temporary"                        },
  { number: 31      , abiNames:["x31", "t6" ]   , saver: "caller", desc: "Temporary"                        },
] as const;

export const REGISTER_DEFINITION_ZERO:RegisterDefinition = {number:0,abiNames:["x0"   ,"zero"],saver:undefined,desc:"Zero (Constant)"       };
export const REGISTER_DEFINITION_TIME:RegisterDefinition = {number:0,abiNames:["0xC01","time"],saver:undefined,desc:"Control & Status: Time"};

/*
  * todo: look into these control and status registers?
cycle                     0xC00       CPU cycle counter
time                      0xC01       Real-time clock (mirrors mtime)
instret                   0xC02       Instructions retired
hpmcounter3–hpmcounter31  0xC03–0xC1F Hardware perf counters
cycleh, timeh, instreth   0xC80–0xC82 RV32 only: upper 32 bits
*/

export const REGISTER_NAMES = [...REGISTER_REGISTRY, REGISTER_DEFINITION_TIME, REGISTER_DEFINITION_ZERO].map(reg=>reg.abiNames).flatMap(reg=>reg);
