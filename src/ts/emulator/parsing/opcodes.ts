/*Info from: https://www.cs.sfu.ca/~ashriram/Courses/CS295/assets/notebooks/RISCV/RISCV_CARD.pdf*/

const FMT_R = 0x33;
const FMT_I = 0x13;
const FMT_S = 0x23;
const FMT_B = 0x63;
const FMT_U = 0x37;
const FMT_J = 0x6F;

export const OPCODES = {
  "add" :{opcode:FMT_R, funct3:0x0, funct7:0x00},
  "sub" :{opcode:FMT_R, funct3:0x0, funct7:0x20},
  "xor" :{opcode:FMT_R, funct3:0x4, funct7:0x00},
   "or" :{opcode:FMT_R, funct3:0x6, funct7:0x00},
  "and" :{opcode:FMT_R, funct3:0x7, funct7:0x00},
  "sll" :{opcode:FMT_R, funct3:0x1, funct7:0x00},
  "srl" :{opcode:FMT_R, funct3:0x5, funct7:0x00},
  "sra" :{opcode:FMT_R, funct3:0x5, funct7:0x20},
  "slt" :{opcode:FMT_R, funct3:0x2, funct7:0x00},
  "sltu":{opcode:FMT_R, funct3:0x3, funct7:0x00},
  
  "addi":{opcode:FMT_I, funct3:0x0, funct7:null},
  "xori":{opcode:FMT_I, funct3:0x4, funct7:null},
   "ori":{opcode:FMT_I, funct3:0x6, funct7:null},
  "andi":{opcode:FMT_I, funct3:0x7, funct7:null},
//  "slli":{opcode:FMT_I, funct3:0x1, funct7:imm[5:11]=0x00},
//  "srli":{opcode:FMT_I, funct3:0x5, funct7:imm[5:11]=0x00},
//  "srai":{opcode:FMT_I, funct3:0x5, funct7:imm[5:11]},
  "slti":{opcode:FMT_I, funct3:0x2, funct7:null},
 "sltiu":{opcode:FMT_I, funct3:0x3, funct7:null},
 
    "lb":{opcode:FMT_I, funct3:0x0, funct7:null},
    "lh":{opcode:FMT_I, funct3:0x1, funct7:null},
    "lw":{opcode:FMT_I, funct3:0x2, funct7:null},
   "lbu":{opcode:FMT_I, funct3:0x4, funct7:null},
   "lhu":{opcode:FMT_I, funct3:0x5, funct7:null},
   
    "sb":{opcode:FMT_S, funct3:0x0, funct7:null},
    "sh":{opcode:FMT_S, funct3:0x1, funct7:null},
    "sw":{opcode:FMT_S, funct3:0x2, funct7:null},
    
   "beq":{opcode:FMT_B, funct3:0x0, funct7:null},
   "bne":{opcode:FMT_B, funct3:0x1, funct7:null},
   "blt":{opcode:FMT_B, funct3:0x2, funct7:null},
   "bgt":{opcode:FMT_B, funct3:0x4, funct7:null},
   "bge":{opcode:FMT_B, funct3:0x5, funct7:null},
  "bltu":{opcode:FMT_B, funct3:0x6, funct7:null},
  "bgeu":{opcode:FMT_B, funct3:0x7, funct7:null},
  
   "jal":{opcode:FMT_J, funct3:null,funct7:null},
  "jalr":{opcode:FMT_I, funct3:0x0 ,funct7:null},
  
   "lui":{opcode:FMT_U, funct3:null,funct7:null},
 "auipc":{opcode:FMT_U, funct3:null,funct7:null},
 
// "ecall":{opcode:FMT_I, funct3:0x0,funct7:imm=0x0},
//"ebreak":{opcode:FMT_I, funct3:0x0,funct7:imm=0x1},
}
