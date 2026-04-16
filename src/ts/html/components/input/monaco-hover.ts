import { REGISTER_DEFINITION_TIME, REGISTER_DEFINITION_ZERO, REGISTER_REGISTRY, type RegisterDefinition } from "../../../emulator/RegisterRegistry";
import { OPCODES          , type OpcodeDefinition   } from "../../../emulator/parsing/opcodes";


const registerMap = new Map<string, RegisterDefinition>();
for (const reg of REGISTER_REGISTRY) for (const name of reg.abiNames) registerMap.set(name, reg);//todo: also need to get x1, x2 etc, and zero?
for (const name of REGISTER_DEFINITION_TIME.abiNames) registerMap.set(name, REGISTER_DEFINITION_TIME);
for (const name of REGISTER_DEFINITION_ZERO.abiNames) registerMap.set(name, REGISTER_DEFINITION_ZERO);

const opcodeMap = new Map<string, OpcodeDefinition>();
for (const [name, data] of Object.entries(OPCODES)) opcodeMap.set(name, data);


export function provideHover(model:any, position:any) {
  const word = model.getWordAtPosition(position); if (!word) return null;
  
  const reg  = registerMap.get(word.word);
  if (reg) return { contents: [
    { value: `**Register ${reg.abiNames.join(', ')}**` },
    { value: `---`                                     },
    { value: `Desc : ${reg.desc} Register`             },
    { value: `Saver: ${reg.saver ?? 'N/A'}`            },
  ]};
  const op = opcodeMap.get(word.word);
  if (op) return { contents: [
    { value: `**${word.word}** - ${op.desc}` },
    { value: `---`                           },
    { value: `Usage : ${op.use}`             },
    { value: `Result: ${op.result}`          }
  ]};

  return null;
}
