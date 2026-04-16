/*Opcodes from: https://www.cs.sfu.ca/~ashriram/Courses/CS295/assets/notebooks/RISCV/RISCV_CARD.pdf*/
/*Usafe    from: https://projectf.io/posts/riscv-cheat-sheet/*/
const FMT_R = 0x33;
const FMT_I = 0x13;
const FMT_S = 0x23;
const FMT_B = 0x63;
const FMT_U = 0x37;
const FMT_J = 0x6F;

export type OpcodeDefinition = {opcode:number, funct3:number|null, funct7:number|null, use?:string, result?:string, desc?:string}

export const OPCODES:Record<string, OpcodeDefinition> = {
  "add" :{opcode:FMT_R, funct3:0x0, funct7:0x00, desc:"Add"                              , use:"add rd, rs1, rs2"  , result:"rd = rs1 + rs2"          },
  "sub" :{opcode:FMT_R, funct3:0x0, funct7:0x20, desc:"Subtract"                         , use:"sub rd, rs1, rs2"  , result:"rd = rs1 - rs2"          },
  "xor" :{opcode:FMT_R, funct3:0x4, funct7:0x00, desc:"XOR"                              , use:"xor rd, rs1, rs2"  , result:"rd = rs1 ^ rs2"          },
   "or" :{opcode:FMT_R, funct3:0x6, funct7:0x00, desc:"OR"                               , use:"or rd, rs1, rs2"   , result:"rd = rs1 | rs2"          },
  "and" :{opcode:FMT_R, funct3:0x7, funct7:0x00, desc:"AND"                              , use:"and rd, rs1, rs2"  , result:"rd = rs1 & rs2"          },
  "sll" :{opcode:FMT_R, funct3:0x1, funct7:0x00, desc:"Shift Left Logical"               , use:"sll rd, rs1, rs2"  , result:"rd = rs1 << rs2"         },
  "srl" :{opcode:FMT_R, funct3:0x5, funct7:0x00, desc:"Shift Right Logical"              , use:"srl rd, rs1, rs2"  , result:"rd = rs1 >> rs2"         },
  "sra" :{opcode:FMT_R, funct3:0x5, funct7:0x20, desc:"Shift Right Arithmetic"           , use:"sra rd, rs1, rs2"  , result:"rd = rs1 >>> rs2"        },
  "slt" :{opcode:FMT_R, funct3:0x2, funct7:0x00, desc:"Set Less Than"                    , use:"slt rd, rs1, rs2"  , result:"rd = (rs1 < rs2)"        },
  "sltu":{opcode:FMT_R, funct3:0x3, funct7:0x00, desc:"Set Less Than Unsigned"           , use:"sltu rd, rs1, rs2" , result:"rd = (rs1 < rs2)"        },
  
  "addi" :{opcode:FMT_I, funct3:0x0, funct7:null, desc:"Add Immediate"                   , use:"addi rd, rs1, imm" , result:"rd = rs1 + imm"          },
  "xori" :{opcode:FMT_I, funct3:0x4, funct7:null, desc:"XOR Immediate"                   , use:"xori rd, rs1, imm" , result:"rd = rs1 ^ imm"          },
   "ori" :{opcode:FMT_I, funct3:0x6, funct7:null, desc:"OR Immediate"                    , use:"ori rd, rs1, imm"  , result:"rd = rs1 | imm"          },
  "andi" :{opcode:FMT_I, funct3:0x7, funct7:null, desc:"AND Immediate"                   , use:"andi rd, rs1, imm" , result:"rd = rs1 & imm"          },
  "slti" :{opcode:FMT_I, funct3:0x2, funct7:null, desc:"Set Less Than Immediate"         , use:"slti rd, rs1, imm" , result:"rd = (rs1 < imm)"        },
 "sltiu" :{opcode:FMT_I, funct3:0x3, funct7:null, desc:"Set Less Than Immediate Unsigned", use:"sltiu rd, rs1, imm", result:"rd = (rs1 < imm)"        },
 
    "lb" :{opcode:FMT_I, funct3:0x0, funct7:null, desc:"Load Byte"                       , use:"lb rd, imm(rs1)"   ,result:"rd = mem[rs1+imm][0:7]"   },
    "lh" :{opcode:FMT_I, funct3:0x1, funct7:null, desc:"Load Half"                       , use:"lh rd, imm(rs1)"   , result:"rd = mem[rs1+imm][0:15]" },
    "lw" :{opcode:FMT_I, funct3:0x2, funct7:null, desc:"Load Word"                       , use:"lw rd, imm(rs1)"   , result:"rd = mem[rs1+imm]"       },
   "lbu" :{opcode:FMT_I, funct3:0x4, funct7:null, desc:"Load Byte Unsigned"              , use:"lbu rd, imm(rs1)"  , result:"rd = mem[rs1+imm][0:7]"  },
   "lhu" :{opcode:FMT_I, funct3:0x5, funct7:null, desc:"Load Half Unsigned"              , use:"lhu rd, imm(rs1)"  , result:"rd = mem[rs1+imm][0:15]" },
   
    "sb" :{opcode:FMT_S, funct3:0x0, funct7:null, desc:"Store Byte"                      , use:"sb rs2, imm(rs1)"  , result:"mem[rs1+imm][0:7] = rs2" },
    "sh" :{opcode:FMT_S, funct3:0x1, funct7:null, desc:"Store Half"                      , use:"sh rs2, imm(rs1)"  , result:"mem[rs1+imm][0:15] = rs2"},
    "sw" :{opcode:FMT_S, funct3:0x2, funct7:null, desc:"Store Word"                      , use:"sw rs2, imm(rs1)"  , result:"mem[rs1+imm] = rs2"      },
    
   "beq" :{opcode:FMT_B, funct3:0x0, funct7:null, desc:"Branch Equal"                    , use:"beq rs1, rs2, imm" , result:"if(rs1 == rs2) pc += imm"},
   "bne" :{opcode:FMT_B, funct3:0x1, funct7:null, desc:"Branch Not Equal"                , use:"bne rs1, rs2, imm" , result:"if(rs1 != rs2) pc += imm"},
   "blt" :{opcode:FMT_B, funct3:0x2, funct7:null, desc:"Branch Less Than"                , use:"blt rs1, rs2, imm" , result:"if(rs1 < rs2) pc += imm" },
   "bgt" :{opcode:FMT_B, funct3:0x4, funct7:null, desc:"Branch Greater Than"             , use:"bgt rs1, rs2, imm" , result:"if(rs1 > rs2) pc += imm" },
   "bge" :{opcode:FMT_B, funct3:0x5, funct7:null, desc:"Branch Greater or Equal"         , use:"bge rs1, rs2, imm" , result:"if(rs1 >= rs2) pc += imm"},
  "bltu" :{opcode:FMT_B, funct3:0x6, funct7:null, desc:"Branch Less Than Unsigned"       , use:"bltu rs1, rs2, imm", result:"if(rs1 < rs2) pc += imm" },
  "bgeu" :{opcode:FMT_B, funct3:0x7, funct7:null, desc:"Branch Greater or Equal Unsigned", use:"bgeu rs1, rs2, imm", result:"if(rs1 >= rs2) pc += imm"},
  
   "jal" :{opcode:FMT_J, funct3:null, funct7:null, desc:"Jump and Link"                  , use:"jal rd, imm"       , result:"rd = pc+4; pc += imm"    },
  "jalr" :{opcode:FMT_I, funct3:0x0,  funct7:null, desc:"Jump and Link Register"         , use:"jalr rd, rs1, imm" , result:"rd = pc+4; pc = rs1+imm" },
  
   "lui" :{opcode:FMT_U, funct3:null, funct7:null, desc:"Load Upper Immediate"           , use:"lui rd, imm"       , result:"rd = imm << 12"          },
 "auipc" :{opcode:FMT_U, funct3:null, funct7:null, desc:"Add Upper Immediate to PC"      , use:"auipc rd, imm"     , result:"rd = pc + (imm << 12)"   },
}
