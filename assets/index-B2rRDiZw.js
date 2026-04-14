(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),e.crossOrigin===`use-credentials`?t.credentials=`include`:e.crossOrigin===`anonymous`?t.credentials=`omit`:t.credentials=`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var e=e=>{let t=document.getElementById(e);if(t===null)throw Error(`cannot find elem "${e}"`);return t},t=(e,t={})=>{let n=document.createElement(e);return Object.entries(t).forEach(([e,t])=>n[e]=t),n},n=(e,n,r,i=!1)=>{let a=t(`div`,{id:e});n.appendChild(a);let o=t(`h2`,{innerText:e});a.appendChild(o);let s=t(r,{spellcheck:!1,classList:i?`hidden`:`visible`});a.appendChild(s);let c=t(`button`,{innerText:`▼`,classList:`closer`});return a.appendChild(c),c.addEventListener(`click`,()=>{s.classList.toggle(`hidden`),s.classList.toggle(`visible`)}),a.classList.add(`box`),s},r=(e,t)=>{switch(t.key){case`Tab`:{t.preventDefault();let n=e.selectionStart,r=e.selectionEnd;e.value=e.value.substring(0,n)+`	`+e.value.substring(r),e.selectionStart=e.selectionEnd=n+1;return}}},i=class{cfg;val=0;set value(e){this.val=e}get value(){return this.val}get abiNames(){return this.cfg.abiNames}get abiName(){return this.cfg.abiNames.map(e=>e.padStart(3)).join(`,`)}get desc(){return this.cfg.desc}get number(){return this.cfg.number}get saver(){return this.cfg.saver}constructor(e){this.cfg=e}toString(){let e=`0x${this.value.toString(16)}`.padStart(6);return`(${this.abiName}): [${e}]`}},a=class extends i{constructor(){super({number:0,abiNames:[`x0`,`zero`],saver:void 0,desc:`Zero`})}get value(){return 0}set value(e){}},o=class extends i{constructor(){super({number:0,abiNames:[`time`],saver:void 0,desc:`Time`})}get value(){return Date.now()&4294967295}set value(e){}},s=1024,c=4294967295,l=4294967296,u=e=>e&c,d=e=>Math.floor(e/l)&c,f=e=>e>>>0,p=(e,t=32)=>{let n=2**(t-1),r=2**t;return e>=n?e-r:e},m=e=>{let t=Number(e);if(isNaN(t))throw Error(`${e} is Not a Number, and cannot be used as an intermediate value.`);return t},h=e=>{let t=Number(String(e).replaceAll(`,`,``));if(isNaN(t))throw Error(`Invalid number: ${e}`);return t},g=(...e)=>{let t=e.reduce((e,t)=>e+t.length,0),n=new Uint8Array(t),r=0;for(let t of e)n.set(t,r),r+=t.length;return n},_=(e,t)=>{let n=new Uint8Array(t),r=BigInt(h(e));for(let e=0;e<t;e++)n[e]=Number(r&255n),r>>=8n;return n},v=(e,t)=>g(...e.map(e=>_(e,t))),ee=(e,t,n)=>{let r=0n;for(let i=0;i<n;i++){let n=BigInt(e[t+i])<<BigInt(i*8);r|=n}return Number(r)},y=e=>{let t=new Uint8Array(e.length);for(let n=0;n<e.length;n++)t[n]=e.charCodeAt(n)&255;return t},te=e=>{let n=document.createElement(`table`),r=t(`thead`),i=t(`tbody`),a=t(`tr`);for(let e of[`Register`,`Base-10 (Signed)`,`Base-10 (Unsigned)`])a.appendChild(t(`th`,{textContent:e}));for(let e=0;e<4;e++)a.appendChild(t(`th`,{textContent:`+${e.toString(16).toUpperCase()}`}));r.appendChild(a),n.appendChild(r);for(let n of e){let e=t(`tr`);e.appendChild(t(`td`,{textContent:String(n.abiName)})),e.appendChild(t(`td`,{textContent:String(p(n.value))})),e.appendChild(t(`td`,{textContent:String(f(n.value))}));for(let r=0;r<4&&r<4;r++){let i=n.value>>r*8&255,a=i.toString(16).padStart(2,`0`).toUpperCase();e.appendChild(t(`td`,{textContent:a})),i!==0&&e.classList.add(`nonZero`)}i.appendChild(e)}return n.appendChild(i),n},b=class e{canRead=!1;canWrite=!1;bytes=new Uint8Array;name=`Unknown Segment`;baseAddress=0;size=0;lastFreeByte=0;static Text(t){return new e(`text`,t,!1,!1)}static Rodata(t){return new e(`rodata`,t,!0,!1)}static Data(t){return new e(`data`,t,!0,!0)}static Bss(t){return new e(`bss`,t,!0,!0)}static Heap(t){return new e(`heap`,t,!0,!0)}static Stack(t){return new e(`stack`,t,!0,!0)}constructor(e,t,n,r){this.name=e,this.bytes=new Uint8Array(t).fill(0),this.canRead=n,this.canWrite=r,this.size=t}saturate(e){for(let t of e){if(t>255)throw Error(`Cannot saturate ${this.name} with ${e}: ${t} is larger than 0xFF`);this.bytes[this.lastFreeByte]=t,this.lastFreeByte++}}},x=class e{text=b.Text(0);data=b.Data(0);rodata=b.Rodata(0);bss=b.Bss(0);heap=b.Heap(0);stack=b.Stack(0);size=0;static segNames=[`text`,`rodata`,`heap`,`stack`,`data`,`bss`];get segments(){return e.segNames.map(e=>this[e])}get bytes(){return this.segments.flatMap(e=>e.bytes)}constructor(t){this.size=t?e.segNames.reduce((e,n)=>(this[n]=t[n],this[n].baseAddress=e,e+t[n].size),0):0}readWord(e){return this.readLittleEndian(e,4)}readHalf(e){return this.readLittleEndian(e,2)}readByte(e){return this.readLittleEndian(e,1)}writeWord(e,t){this.writeLittleEndian(e,t,4)}writeHalf(e,t){this.writeLittleEndian(e,t,2)}writeByte(e,t){this.writeLittleEndian(e,t,1)}getSegment(e){if(e<0||e>this.size)throw new S(e,this.size);for(let t of this.segments)if(e>=t.baseAddress&&e<t.baseAddress+t.size)return t;throw new S(e,this.size)}getSegmentByName(t){if(!e.segNames.includes(t))throw new ne(t);return this[t]}getSegmentOffset(e){let t=this.getSegment(e);return{bytes:t.bytes,offset:e-t.baseAddress}}readLittleEndian(e,t){let{bytes:n,offset:r}=this.getSegmentOffset(e);return ee(n,r,t)>>>0}writeLittleEndian(e,t,n){let{bytes:r,offset:i}=this.getSegmentOffset(e);r.set(_(t,n),i)}},S=class extends Error{constructor(e,t){super(`Address 0x${e.toString(16)} is out of bounds (Legal range is [0:${t.toString(16)}])`),this.name=`MemoryAccessError`}},ne=class extends Error{constructor(e){super(`Segment ${e} does not exist in memory.`),this.name=`SegmentNotFoundError`}},C=16,w=(e,n,r)=>{let i=t(`th`),a=t(`tbody`),o=t(`tr`);o.appendChild(i);let s=t(`thead`);s.appendChild(o);let c=t(`table`);c.appendChild(s),i.textContent=`Address`;for(let e=0;e<C;e++)o.appendChild(t(`th`,{textContent:`+${e.toString(16).toUpperCase()}`}));for(let i=n;i<r;i+=C){let n=t(`tr`);n.appendChild(t(`td`,{textContent:`0x${i.toString(16).padStart(3,`0`).toUpperCase()}`}));for(let a=0;a<C&&i+a<r;a++){let r=e.readByte(i+a);n.appendChild(t(`td`,{textContent:r.toString(16).padStart(2,`0`).toUpperCase()})),r!==0&&n.classList.add(`nonZero`)}a.appendChild(n)}return c.appendChild(a),c},T=[{number:1,abiNames:[`x1`,`ra`],saver:`caller`,desc:`Return address`},{number:2,abiNames:[`x2`,`sp`],saver:`callee`,desc:`Stack pointer`},{number:3,abiNames:[`x3`,`gp`],saver:void 0,desc:`Global pointer`},{number:4,abiNames:[`x4`,`tp`],saver:void 0,desc:`Thread pointer`},{number:5,abiNames:[`x5`,`t0`],saver:`caller`,desc:`Temporary`},{number:6,abiNames:[`x6`,`t1`],saver:`caller`,desc:`Temporary`},{number:7,abiNames:[`x7`,`t2`],saver:`caller`,desc:`Temporary`},{number:8,abiNames:[`x8`,`s0`,`fp`],saver:`callee`,desc:`Saved register    / frame pointer`},{number:9,abiNames:[`x9`,`s1`],saver:`callee`,desc:`Saved register`},{number:10,abiNames:[`x10`,`a0`],saver:`caller`,desc:`Function argument / return value`},{number:11,abiNames:[`x11`,`a1`],saver:`caller`,desc:`Function argument / return value`},{number:12,abiNames:[`x12`,`a2`],saver:`caller`,desc:`Function argument`},{number:13,abiNames:[`x13`,`a3`],saver:`caller`,desc:`Function argument`},{number:14,abiNames:[`x14`,`a4`],saver:`caller`,desc:`Function argument`},{number:15,abiNames:[`x15`,`a5`],saver:`caller`,desc:`Function argument`},{number:16,abiNames:[`x16`,`a6`],saver:`caller`,desc:`Function argument`},{number:17,abiNames:[`x17`,`a7`],saver:`caller`,desc:`Function argument`},{number:18,abiNames:[`x18`,`s2`],saver:`callee`,desc:`Saved register`},{number:19,abiNames:[`x19`,`s3`],saver:`callee`,desc:`Saved register`},{number:20,abiNames:[`x20`,`s4`],saver:`callee`,desc:`Saved register`},{number:21,abiNames:[`x21`,`s5`],saver:`callee`,desc:`Saved register`},{number:22,abiNames:[`x22`,`s6`],saver:`callee`,desc:`Saved register`},{number:23,abiNames:[`x23`,`s7`],saver:`callee`,desc:`Saved register`},{number:24,abiNames:[`x24`,`s8`],saver:`callee`,desc:`Saved register`},{number:25,abiNames:[`x25`,`s9`],saver:`callee`,desc:`Saved register`},{number:26,abiNames:[`x26`,`s10`],saver:`callee`,desc:`Saved register`},{number:27,abiNames:[`x27`,`s11`],saver:`callee`,desc:`Saved register`},{number:28,abiNames:[`x28`,`t3`],saver:`caller`,desc:`Temporary`},{number:29,abiNames:[`x29`,`t4`],saver:`caller`,desc:`Temporary`},{number:30,abiNames:[`x30`,`t5`],saver:`caller`,desc:`Temporary`},{number:31,abiNames:[`x31`,`t6`],saver:`caller`,desc:`Temporary`}],E=Object.freeze({$exit:e=>{e.shouldExit=!0,e.exitCode=1},$assert:(e,t,n)=>{let r=e.getVal_U(t)>>>0,i=m(n)>>>0;if(r!==i)throw Error(`Assertion failed: Stored(${r}), expected(${i})`)},li:(e,t,n)=>e.setReg(t,m(n)),lui:(e,t,n)=>{throw new O(`lui`)},auipc:(e,t,n)=>{throw new O(`auipc`)},la:(e,t,n)=>e.setReg(t,m(n)),lw:(e,t,n)=>e.setReg(t,e.getWord_S(e.calcOffset(n))),lh:(e,t,n)=>e.setReg(t,e.getHalf_S(e.calcOffset(n))),lhu:(e,t,n)=>e.setReg(t,e.getHalf_U(e.calcOffset(n))),lb:(e,t,n)=>e.setReg(t,e.getByte_S(e.calcOffset(n))),lbu:(e,t,n)=>e.setReg(t,e.getByte_U(e.calcOffset(n))),sw:(e,t,n)=>e.setWord(e.calcOffset(n),e.getVal_S(t)),sh:(e,t,n)=>e.setHalf(e.calcOffset(n),e.getVal_S(t)),sb:(e,t,n)=>e.setByte(e.calcOffset(n),e.getVal_S(t)),neg:(e,t,n)=>e.setReg(t,e.getVal_S(n)*-1),rem:(e,t,n,r)=>e.setReg(t,e.getVal_S(n)%e.getVal_S(r)),add:(e,t,n,r)=>e.setReg(t,u(e.getVal_S(n)+e.getVal_S(r))),sub:(e,t,n,r)=>e.setReg(t,u(e.getVal_S(n)-e.getVal_S(r))),mul:(e,t,n,r)=>e.setReg(t,u(e.getVal_S(n)*e.getVal_S(r))),mulhu:(e,t,n,r)=>e.setReg(t,d(e.getVal_U(n)*e.getVal_U(r))),addi:(e,t,n,r)=>e.setReg(t,u(e.getVal_S(n)+m(r))),mulh:(e,t,n,r)=>e.setReg(t,d(e.getVal_S(n)*e.getVal_S(r))),mulhsu:(e,t,n,r)=>e.setReg(t,d(e.getVal_U(n)*e.getVal_U(r))),div:(e,t,n,r)=>e.setReg(t,e.getVal_S(r)===0?c:u(e.getVal_S(n)/e.getVal_S(r))),j:(e,t)=>e.incPc(m(t)),jal:(e,t,n)=>{e.setReg(t,e.pc+1),e.incPc(m(n))},jalr:(e,t,n)=>{e.setReg(t,e.pc+1),e.setPc(e.calcOffset(n))},call:(e,t)=>{e.setReg(`ra`,e.pc+1),e.incPc(m(t))},jr:(e,t)=>e.setPc(e.getVal_S(t)),ret:e=>e.setPc(e.getVal_S(`ra`)),bltz:(e,t,n)=>e.incPcIf(m(n),e.getVal_S(t)<0),bgtz:(e,t,n)=>e.incPcIf(m(n),e.getVal_S(t)>0),blez:(e,t,n)=>e.incPcIf(m(n),e.getVal_S(t)<=0),bgez:(e,t,n)=>e.incPcIf(m(n),e.getVal_S(t)>=0),beqz:(e,t,n)=>e.incPcIf(m(n),e.getVal_S(t)===0),bnez:(e,t,n)=>e.incPcIf(m(n),e.getVal_S(t)!==0),beq:(e,t,n,r)=>e.incPcIf(m(r),e.getVal_S(t)===e.getVal_S(n)),bne:(e,t,n,r)=>e.incPcIf(m(r),e.getVal_S(t)!==e.getVal_S(n)),bltu:(e,t,n,r)=>e.incPcIf(m(r),e.getVal_U(t)<e.getVal_U(n)),bgtu:(e,t,n,r)=>e.incPcIf(m(r),e.getVal_U(t)>e.getVal_U(n)),bleu:(e,t,n,r)=>e.incPcIf(m(r),e.getVal_U(t)<=e.getVal_U(n)),bgeu:(e,t,n,r)=>e.incPcIf(m(r),e.getVal_U(t)>=e.getVal_U(n)),blt:(e,t,n,r)=>e.incPcIf(m(r),e.getVal_S(t)<e.getVal_S(n)),bgt:(e,t,n,r)=>e.incPcIf(m(r),e.getVal_S(t)>e.getVal_S(n)),ble:(e,t,n,r)=>e.incPcIf(m(r),e.getVal_S(t)<=e.getVal_S(n)),bge:(e,t,n,r)=>e.incPcIf(m(r),e.getVal_S(t)>=e.getVal_S(n)),and:(e,t,n,r)=>e.setReg(t,e.getVal_S(n)&e.getVal_S(r)),andi:(e,t,n,r)=>e.setReg(t,e.getVal_S(n)&m(r)),or:(e,t,n,r)=>e.setReg(t,e.getVal_S(n)|e.getVal_S(r)),ori:(e,t,n,r)=>e.setReg(t,e.getVal_S(n)|m(r)),xor:(e,t,n,r)=>e.setReg(t,e.getVal_S(n)^e.getVal_S(r)),xori:(e,t,n,r)=>e.setReg(t,e.getVal_S(n)^m(r)),slt:(e,t,n,r)=>e.setReg(t,e.getVal_S(n)<e.getVal_S(r)?1:0),slti:(e,t,n,r)=>e.setReg(t,e.getVal_S(n)<m(r)?1:0),sltu:(e,t,n,r)=>e.setReg(t,e.getVal_U(n)<e.getVal_U(r)?1:0),sltiu:(e,t,n,r)=>e.setReg(t,e.getVal_U(n)<m(r)?1:0),seqz:(e,t,n)=>e.setReg(t,e.getVal_S(n)===0?1:0),snez:(e,t,n)=>e.setReg(t,e.getVal_S(n)===0?0:1),sltz:(e,t,n)=>e.setReg(t,e.getVal_S(n)<0?1:0),sgtz:(e,t,n)=>e.setReg(t,e.getVal_S(n)>0?1:0),sll:(e,t,n,r)=>e.setReg(t,u(e.getVal_S(n)<<(e.getVal_S(r)&31))),slli:(e,t,n,r)=>e.setReg(t,u(e.getVal_S(n)<<m(r))),srl:(e,t,n,r)=>e.setReg(t,u(e.getVal_S(n)>>>(e.getVal_S(r)&31))),srli:(e,t,n,r)=>e.setReg(t,u(e.getVal_S(n)>>>m(r))),sra:(e,t,n,r)=>e.setReg(t,u(e.getVal_S(n)>>(e.getVal_S(r)&31))),srai:(e,t,n,r)=>e.setReg(t,u(e.getVal_S(n)>>m(r))),nop:e=>void 0,mv:(e,t,n)=>e.setReg(t,e.getVal_S(n)),ecall:e=>e.syscall(),ebreak:e=>{throw e.pc++,Error(`Breakpoint hit - execution paused`)},fence:e=>{throw new O(`fence`)},rdtime:(e,t)=>e.setReg(t,e.getReg(`time`).value),rdtimeh:(e,t)=>e.setReg(t,d(e.getReg(`time`).value)),rdcycle:()=>{throw new O(`rdcylce`)},rdcycleh:()=>{throw new O(`rdcycleh`)},rdinstet:()=>{throw new O(`rdinstet`)},rdinsteth:()=>{throw new O(`rdinsteth`)}}),re=Object.keys(E),D=e=>re.includes(e),ie=class extends Error{constructor(e){super(`Unknown Instruction: ${e}`),this.name=`UnknownInstructionError`}},O=class extends Error{constructor(e){super(`Instruction ${e} is not implemented.`),this.name=`UnimplementedInstructionError`}},ae=e=>e.instructions.map((t,n)=>t.map(t=>{let r=e.labels.get(t);return r===void 0?t:String(r-n)})),oe=(e,t)=>e.map(e=>e.map(e=>{let n=t.labels.get(e);return n===void 0?e:String(n+t.memory.baseAddress)})),se=[`data`,`rodata`,`bss`],ce=e=>se.reduce((t,n)=>oe(t,e[n]),ae(e.text)),le=/\n/,ue=/\s+/,de=/(#.*)$/,k=/.*\:$/,fe=[`.byte`,`.short`,`.word`,`.dword`,`.ascii`,`.asciz`,`.align`,`.space`],A=[`.globl`,`.global`,`.weak`,`.local`,`.type`,`.size`,`.hidden`],j=[`.text`,`.data`,`.bss`,`.rodata`,`.section`],M=[`.equ`,`.set`],N=[`=`],P=e=>j.includes(e),F=e=>A.includes(e),I=e=>fe.includes(e),L=e=>M.includes(e[0])||N.includes(e[1]),R=class extends Error{constructor(e){super(`Unknown Directive name: ${e}`),this.name=`UnknownDirectiveError`}},z=class extends Error{constructor(e,t,n){super(`cannot apply constant: ${e}, ${t}.\n${e} is already defined as ${n}`),this.name=`UnknownDirectiveError`}},B=(e,t)=>{if(!t)return e;let n=t.split(ue),r=n[0],i=e.currentSegment;if(r.match(k))return ge(e,n);if(L(n))return me(e,n);if(I(r))return H(e,n);if(P(r))return V(e,n);if(F(r))return pe(e,n);if(i===`data`)return H(e,n);if(i===`text`)return he(e,n);throw new R(n[0])},V=(e,t)=>{let n=t[0];switch(n){case`.section`:return V(e,t.slice(1));case`.text`:return e.currentSegment=`text`,e;case`.data`:return e.currentSegment=`data`,e;case`.bss`:return e.currentSegment=`bss`,e;case`.rodata`:return e.currentSegment=`rodata`,e;default:throw new R(n)}},pe=(e,t)=>{let n=t[0];switch(n){case`.globl`:return e;case`.global`:return e;case`.weak`:return e;case`.local`:return e;case`.type`:return e;case`.size`:return e;case`.hidden`:return e;default:throw new R(n)}},me=(e,t)=>{let n=M.includes(t[0])?t[1]:t[0],r=M.includes(t[0])?t[0]:t[1],i=h(t[2]),a=e.acc[e.currentSegment],o=a.constants.get(n);if(o!==void 0)throw new z(n,r,o);switch(r){case`=`:return a.labels.set(n,i),e;case`.equ`:return a.labels.set(n,i),e;case`.set`:return a.labels.set(n,i),a.constants.set(n,i),e}throw console.log(n,r,i),Error(`An assembler constant was expected but not found (mika error).`)},H=(e,t)=>{let n=e.acc[e.currentSegment],r=t[0],i=r.match(k),a=t.slice(i?1:0),o=a.slice(1),s=e=>{let t=r.replace(`:`,``);i&&n.labels.set(t,n.memory.lastFreeByte),n.memory.saturate(e)};switch(a[0]){case`.byte`:return s(v(o,1)),e;case`.short`:return s(v(o,2)),e;case`.word`:return s(v(o,4)),e;case`.dword`:return s(v(o,8)),e;case`.space`:return s(new Uint8Array(h(o[0]))),e;case`.ascii`:return s(y(o.join(` `))),e;case`.asciz`:return s(g(y(o.join(` `)),new Uint8Array([0]))),e;case`.align`:{let t=1<<h(o[0]),r=(t-n.memory.size%t)%t;return s(new Uint8Array(r)),e}default:throw new R(t.join(` `))}},he=(e,t)=>{let n=t[0].replaceAll(`,`,``);if(e.pc++,!D(n))throw new ie(n);return e.acc.text.instructions.push(t.map(e=>e.replaceAll(`,`,``))),e},ge=(e,t)=>{let n=t[0];switch(e.currentSegment){case`data`:return H(e,t);case`bss`:return H(e,t);case`rodata`:return H(e,t);case`text`:{let t=n.replaceAll(`:`,``),r=e.pc;return e.acc.text.labels.set(t,r),e}default:throw new R(t.join(`, `))}},_e=()=>({currentSegment:`text`,pc:0,acc:{text:{labels:new Map,instructions:[],memory:b.Text(s)},rodata:{labels:new Map,constants:new Map,memory:b.Rodata(s)},data:{labels:new Map,constants:new Map,memory:b.Data(s)},bss:{labels:new Map,constants:new Map,memory:b.Bss(s)}}}),ve=e=>e.split(le).map(e=>e.replace(de,``)).map(e=>e.trim()).filter(e=>e!==``).reduce((e,t)=>B(e,t),_e()).acc,ye=100,U=class{_exitCode=0;pc=0;shouldExit=!1;hasSetPc=!1;registers=[];instrs=[];history=[];registerMap=new Map;memory=new x;get exitCode(){return this._exitCode}set exitCode(e){this._exitCode=Math.min(0,Math.max(e,255))}get history_pretty(){return this.history.length>0?this.history.map((e,t)=>{let n=e[0].padEnd(4),r=e.slice(1,e.length-1).map(e=>e.padStart(2,` `)).join(`, `);return`[pc${e.at(-1)?.padStart(6,` `)}]  |  ${n} ${r}`}):[]}constructor(){this.registers.push(new a),T.forEach(e=>this.registers.push(new i(e))),this.registers.push(new o),this.registers.forEach(e=>{e.abiNames.forEach(t=>this.registerMap.set(t,e))})}syscall(){let e=this.getVal_S(`a0`),t=this.getVal_S(`a7`);switch(t){case 1:console.log(e);break;case 10:this.shouldExit=!0,this.exitCode=e;break;case 93:this.shouldExit=!0,this.exitCode=e;break;default:throw Error(`Unknown syscall: ${t}`)}}getRegisterByName(e){let t=this.registerMap.get(e);if(!e)throw Error(`No register was provided.
Check the last instruction entered for further details.`);if(t===void 0)throw Error(`Register "${e}" does not exist on this CPU.`);return t}calcOffset(e){let t=e.match(/^(-?\d+)\((\w+)\)$/);if(!t)throw Error(`Invalid offset(reg) format: "${e}".\nExpected format like "0(t6)" or "-4(sp)"`);let n=parseInt(t[1]),r=t[2];return this.getVal_S(r)+n}setReg(e,t){this.getRegisterByName(e).value=t}setPc(e){this.pc=e,this.hasSetPc=!0}setPcIf(e,t){t&&this.setPc(e)}incPc(e){this.setPc(this.pc+e)}incPcIf(e,t){t&&this.setPc(this.pc+e)}getReg(e){return this.getRegisterByName(e)}getVal_S(e){return this.getRegisterByName(e).value}getVal_U(e){return this.getRegisterByName(e).value}getWord_U(e){return f(this.memory.readWord(e))}getHalf_U(e){return f(this.memory.readHalf(e))}getByte_U(e){return f(this.memory.readByte(e))}getWord_S(e){return p(this.memory.readWord(e),32)}getHalf_S(e){return p(this.memory.readHalf(e),16)}getByte_S(e){return p(this.memory.readByte(e),8)}setWord(e,t){this.memory.writeWord(e,t)}setHalf(e,t){this.memory.writeHalf(e,t)}setByte(e,t){this.memory.writeByte(e,t)}feed(e){let t=ve(e);return this.memory=new x({text:t.text.memory,rodata:t.rodata.memory,data:t.data.memory,bss:t.bss.memory,heap:b.Heap(s),stack:b.Stack(s)}),this.instrs=ce(t),this}step(e=!1){if(this.shouldExit)return;let t=this.instructionAt(this.pc);e||this.addToHistory(t),this.execute(t),this.hasSetPc||this.pc++,this.hasSetPc=!1}addToHistory(e){let t=new Array(...e);t.push(String(this.pc)),this.history.push(t),this.history.length>ye&&this.history.shift()}instructionAt(e){if(e>=this.instrs.length)throw Error(`End of instructions has been reached without program termination.\n(PC=${this.pc}, Length of Instructions=${this.instrs.length-1}).\nLast Instruction: [${this.history.at(-1)}]`);return this.instrs[this.pc]}execute(e){let t=e[0],n=e.slice(1);if(!D(t))throw Error(`instruction "${t}" does not exist.`);E[t](this,...n)}},be=class{regElem;memElem;logElem;histElem;segmentNameElem;segmentIndex=2;lastCPU=null;constructor({registers:e,memory:n,history:r,log:i,memControl:a}){this.regElem=e,this.histElem=r,this.memElem=n,this.logElem=i,a.innerHTML=``,this.segmentNameElem=t(`p`),a.appendChild(t(`button`,{innerText:`Prev`,onclick:()=>this.displayMemory(-1)})),a.appendChild(this.segmentNameElem),a.appendChild(t(`button`,{innerText:`Next`,onclick:()=>this.displayMemory(1)}))}update(e,t){if(!e)throw new W(`Cannot update Log`);this.lastCPU=e,this.regElem.replaceChildren(te(e.registers)),this.displayMemory(0),this.logElem.innerText=this.styleMessage(e,t),this.histElem.innerText=e.history_pretty.join(`
`)}styleMessage(e,t){return t??(e.shouldExit?`Exited with exit code ${e.exitCode}`:`CPU Executing [pc=${e.pc}, lastInstruction: ${e.history.at(-1)}]`)}displayMemory(e){if(!this.lastCPU)throw new W(`Cannot increment Segment`);let t=this.lastCPU,n=t.memory,r=this.segmentIndex+e;if(r<0||r>t.memory.segments.length-1)return console.warn(`out of bounds - seg is ${this.segmentIndex} / ${t.memory.segments.length-1}`);this.segmentIndex=r;let i=n.segments[this.segmentIndex];if(!i)return console.warn(`no seg!`);let a=i.baseAddress,o=i.baseAddress+i.size,s=`[${this.segmentIndex+1}/${n.segments.length}]`,c=`[${a.toString(16).toUpperCase()}:${(o-1).toString(16).toUpperCase()}]`;this.segmentNameElem.innerText=`${i.name} ${s} ${c}`,this.memElem.replaceChildren(w(n,i.baseAddress,i.baseAddress+i.size))}},W=class extends Error{constructor(e){super(`${e}: No CPU in logger`),this.name=`NoCPUError`}},xe={default:`# ==================================
# tests
# ==================================
.data
    mem_start = 0x800

.text

# ==================================
# TEST 1: Basic 32-bit Store and Load (SW/LW)
# ==================================
test_sw_lw:
    # Store 0xDEADBEEF at 0x800
    li x1, 0xDEADBEEF
    li x2, 0x800
    sw x1, 0(x2)
    
    # Load it back
    lw x3, 0(x2)
    
    # Assert loaded value equals stored value
    $assert x3, 0xDEADBEEF
    
    j test_store_byte

# ==================================
# TEST 2: 8-bit Store and Load (SB/LB) - Signed
# ==================================
test_store_byte:
    # Store -5 (0xFF) at 0x804
    li x1, -5
    li x2, 0x804
    sb x1, 0(x2)
    
    # Load it back as signed byte
    lb x3, 0(x2)
    
    # Assert loaded value is -5 (0xFFFFFFFF in 32-bit)
    $assert x3, -5
    
    j test_load_unsigned_byte

# ==================================
# TEST 3: 8-bit Load Unsigned (LBU)
# ==================================
test_load_unsigned_byte:
    # Store 0xFF at 0x808
    li x1, 0xFF
    li x2, 0x808
    sb x1, 0(x2)
    
    # Load as unsigned byte
    lbu x3, 0(x2)
    
    # Assert loaded value is 255 (0x000000FF)
    $assert x3, 255
    
    j test_store_halfword

# ==================================
# TEST 4: 16-bit Store and Load (SH/LH) - Signed
# ==================================
test_store_halfword:
    # Store 0x1234 at 0x80C
    li x1, 0x1234
    li x2, 0x80C
    sh x1, 0(x2)
    
    # Load it back as signed halfword
    lh x3, 0(x2)
    
    # Assert loaded value
    $assert x3, 0x1234
    
    j test_load_unsigned_halfword

# ==================================
# TEST 5: 16-bit Load Unsigned (LHU)
# ==================================
test_load_unsigned_halfword:
    # Store -1 (0xFFFF) at 0x810
    li x1, -1
    li x2, 0x810
    sh x1, 0(x2)
    
    # Load as unsigned halfword
    lhu x3, 0(x2)
    
    # Assert loaded value is 65535 (0x0000FFFF)
    $assert x3, 65535
    
    j test_negative_byte_load

# ==================================
# TEST 6: Negative Byte Load (Sign Extension)
# ==================================
test_negative_byte_load:
    # Store 0x80 (which is -128 when signed) at 0x814
    li x1, 0x80
    li x2, 0x814
    sb x1, 0(x2)
    
    # Load as signed byte (should sign-extend to -128)
    lb x3, 0(x2)
    
    # Assert loaded value is -128
    $assert x3, -128
    
    j test_multiple_stores

# ==================================
# TEST 7: Multiple Consecutive Stores and Loads
# ==================================
test_multiple_stores:
    # Store 4 bytes sequentially
    li x2, 0x818
    li x1, 0x11223344
    sw x1, 0(x2)
    
    li x1, 0x55667788
    sw x1, 4(x2)
    
    # Load them back
    lw x3, 0(x2)
    lw x4, 4(x2)
    
    # Assert both values
    $assert x3, 0x11223344
    $assert x4, 0x55667788
    
    j test_byte_within_word

# ==================================
# TEST 8: Loading Individual Bytes
# ==================================
test_byte_within_word:
    # Store 0x12345678 at 0x820
    li x1, 0x12345678
    li x2, 0x820
    sw x1, 0(x2)
    
    # Load each byte individually
    lbu x3, 0(x2)      # 0x78
    lbu x4, 1(x2)      # 0x56
    lbu x5, 2(x2)      # 0x34
    lbu x6, 3(x2)      # 0x12
    
    # Assert each byte
    $assert x3, 0x78
    $assert x4, 0x56
    $assert x5, 0x34
    $assert x6, 0x12
    
    j test_offset_operations

# ==================================
# TEST 9: Offset Operations
# ==================================
test_offset_operations:
    # Base address in x1
    li x1, 0x828
    
    # Store at base + offset
    li x2, 0xAABBCCDD
    sw x2, 0(x1)
    
    li x2, 0x11223344
    sw x2, 4(x1)
    
    li x2, 0x55667788
    sw x2, 8(x1)
    
    # Load with different offsets
    lw x3, 0(x1)
    lw x4, 4(x1)
    lw x5, 8(x1)
    
    $assert x3, 0xAABBCCDD
    $assert x4, 0x11223344
    $assert x5, 0x55667788
    
    j test_zero_value

# ==================================
# TEST 10: Zero Value StorageandLoad
# ==================================
test_zero_value:
    # Store 0 at 0x834
    li x1, 0
    li x2, 0x834
    sw x1, 0(x2)
    
    # Load it back
    lw x3, 0(x2)
    
    # Assert value is 0
    $assert x3, 0
    
    j test_all_ones

# ==================================
# TEST 11: All-Ones Pattern
# ==================================
test_all_ones:
    # Store 0xFFFFFFFF at 0x838
    li x1, -1
    li x2, 0x838
    sw x1, 0(x2)
    
    # Load it back
    lw x3, 0(x2)
    
    # Assert value is 0xFFFFFFFF
    $assert x3, -1
    
    j test_alternating_pattern

# ==================================
# TEST 12: Alternating Bit Pattern
# ==================================
test_alternating_pattern:
    # Store 0xAAAAAAAA at 0x83C
    li x1, 0xAAAAAAAA
    li x2, 0x83C
    sw x1, 0(x2)
    
    # Load and verify
    lw x3, 0(x2)
    $assert x3, 0xAAAAAAAA
    
    # Store 0x55555555 at 0x840
    li x1, 0x55555555
    li x2, 0x840
    sw x1, 0(x2)
    
    # Load and verify
    lw x3, 0(x2)
    $assert x3, 0x55555555
    
    j test_halfword_byte_mixing

# ==================================
# TEST 13: Mixing Halfword 
# and Byte Writes
# ==================================
test_halfword_byte_mixing:
    li x2, 0x844
    
    # Write halfword
    li x1, 0x1234
    sh x1, 0(x2)
    
    # Write byte at offset 2
    li x1, 0x56
    sb x1, 2(x2)
    
    # Read back full word
    lw x3, 0(x2)
    
    # Verify structure
    lbu x4, 0(x2)
    lbu x5, 1(x2)
    lbu x6, 2(x2)
    
    $assert x4, 0x34
    $assert x5, 0x12
    $assert x6, 0x56
    
    j test_boundary_memory

# ==================================
# TEST 14: Memory Boundary Test
# ==================================
test_boundary_memory:
    # Store at address 0x9FC (near end of allocation)
    li x1, 0xBEEFCAFE
    li x2, 0x9FC
    sw x1, 0(x2)
    
    # Load it back
    lw x3, 0(x2)
    $assert x3, 0xBEEFCAFE
    
    j test_small_values

# ==================================
# TEST 15: Small Integer Values
# ==================================
test_small_values:
    li x2, 0x950
    
    # Store small positive value
    li x1, 42
    sw x1, 0(x2)
    lw x3, 0(x2)
    $assert x3, 42
    
    # Store small negative value
    li x1, -42
    sw x1, 4(x2)
    lw x3, 4(x2)
    $assert x3, -42
    
    j test_power_of_two

# ==================================
# TEST 16: Power-of-Two Values
# ==================================
test_power_of_two:
    li x2, 0x960
    
    # Store 0x00000001
    li x1, 1
    sw x1, 0(x2)
    lw x3, 0(x2)
    $assert x3, 1
    
    # Store 0x80000000
    li x1, 0x80000000
    sw x1, 4(x2)
    lw x3, 4(x2)
    $assert x3, 0x80000000
    
    j test_max_positive_negative

# ==================================
# TEST 17: Maximum Pos and NegValues
# ==================================
test_max_positive_negative:
    li x2, 0x970
    
    # Store max positive (0x7FFFFFFF)
    li x1, 0x7FFFFFFF
    sw x1, 0(x2)
    lw x3, 0(x2)
    $assert x3, 0x7FFFFFFF
    
    # Store max negative (0x80000000 as -2147483648)
    li x1, 0x80000000
    sw x1, 4(x2)
    lw x3, 4(x2)
    $assert x3, 0x80000000
    
    j test_consecutive_byte_writes

# ==================================
# TEST 18: Overwriting Memory
# ==================================
test_consecutive_byte_writes:
    li x2, 0x980
    
    # Write four bytes separately
    li x1, 0xAA
    sb x1, 0(x2)
    
    li x1, 0xBB
    sb x1, 1(x2)
    
    li x1, 0xCC
    sb x1, 2(x2)
    
    li x1, 0xDD
    sb x1, 3(x2)
    
    # Read back as word
    lw x3, 0(x2)
    $assert x3, 0xDDCCBBAA
    
    j test_halfword_alignment

# ==================================
# TEST 19: Halfword Alignment
# ==================================
test_halfword_alignment:
    li x2, 0x990
    
    # Write two halfwords
    li x1, 0x1111
    sh x1, 0(x2)
    
    li x1, 0x2222
    sh x1, 2(x2)
    
    # Read back as word
    lw x3, 0(x2)
    $assert x3, 0x22221111
    
    j test_data_persistence

# ==================================
# TEST 20: Data Persistence 
# (Multiple Access Patterns)
# ==================================
test_data_persistence:
    li x2, 0x9A0
    
    # Store original value
    li x1, 0x12345678
    sw x1, 0(x2)
    
    # Load and use it
    lw x3, 0(x2)
    $assert x3, 0x12345678
    
    # Do other operations
    li x4, 0xAAAAAAAA
    li x5, 0x9B0
    sw x4, 0(x5)
    
    # Load original value again 
    # verify unchanged
    lw x6, 0(x2)
    $assert x6, 0x12345678
    
    j test_complete

# ==================================
# All Tests Complete
# ==================================
test_complete:
$exit
`},G=e(`left`),K=e(`middle`),q=e(`right`),Se=e(`btn_start`),Ce=e(`btn_step`),we=e(`btn_slow`),Te=e(`btn_reset`),Ee=e(`btn_halt`),J=n(`Instructions`,G,`textarea`),Y=n(`Screen`,G,`canvas`,!0),De=n(`Examples`,G,`pre`,!0),Oe=n(`Status`,K,`pre`),ke=n(`Registers`,K,`span`),Ae=n(`History`,K,`pre`),X=n(`Segment`,q,`span`),je=n(`Memory`,q,`span`);J.addEventListener(`keydown`,e=>r(J,e));var Z=new be({registers:ke,memory:je,history:Ae,log:Oe,memControl:X});De.innerText=xe.default,J.value=`# ---------------------------------------------------------#
# This programme draws a while pixel across each px of the #
# simulator's display.  The pixel will return to the first #
# position once it has visited all available 16x16 pixels. #
# ---------------------------------------------------------#

.section .text
_reset:
    	addi a0, x0, 0xA00
_loop:
    	addi a1, x0, 0x00      # draw black
    	call _draw_pixel
    	addi a0, a0, 0x01      # move cursor by 1 position
    	addi t0, x0, 0xB00     # if at end of screen:
    	bgt  a0, t0, _reset    # reset cursor position
    	addi a1, x0, 0xFF      # draw white pixel
    	call _draw_pixel
    	call _wait_for_next_frame
	j _loop
        
_draw_pixel: #a0=framePos,a1=color; clobbers:t0; returns:void
    	sw   a1, 0(a0)
    	ret

_wait_for_next_frame: #clobbers:t0,t1,t2,t3,t4,  returns:void
    	rdtime t0                # t0 = start time
    	la   t1, fps             # t1 = fps
    	lw   t2, 0(t1)           # t2 = delay
_spin_lock:
    	rdtime t3                # t3 = current time
    	sub  t4, t3, t0          # t4 = elapsed = now - start
    	blt  t4, t2, _spin_lock	 # if : elapsed < now, remain
    	ret                      # else:return

.section .data
  fps: .word 30`;var Q,Me=class{memory;canvas;FPS=33;width=16;height=16;dispStart=2560;dispEnd=this.dispStart+this.width*this.height;constructor(e,t){this.memory=e,this.canvas=t,this.canvas.width=this.width,this.canvas.height=this.height,console.log(this.canvas)}startRendering(){Q&&clearInterval(Q),Q=setInterval(()=>this.refresh(),this.FPS)}stopRendering(){Q&&clearInterval(Q)}refresh(){throw Error(`Abstract class Display cannot refresh!`)}delete(){clearInterval(Q)}},Ne=class extends Me{refresh(){if(!this.canvas)throw Error(`No canvas`);let e=this.canvas.getContext(`2d`);if(!e)throw Error(`Unable to get ctx`);let t=e.createImageData(this.width,this.height),n=t.data,r=0;for(let e=this.dispStart;e<this.dispEnd;e+=1){let t=this.memory.readByte(e)&255;n[r++]=t?255:0,n[r++]=t?255:0,n[r++]=t?255:0,n[r++]=255}console.log(t),e.putImageData(t,0,0)}},$=new class{running=!1;cpu=new U;display;constructor(){this.init()}reset(){this.init()}init(){this.display&&this.display.delete(),Y.getContext(`2d`)?.reset(),this.running=!1,this.cpu=new U,this.assemble()}assemble(){try{this.cpu.feed(J.value)}catch(e){throw Z.update(this.cpu,e),Error()}Z.update(this.cpu,`CPU Ready to execute.`)}initExecution(){this.assemble(),this.running=!0,this.display=new Ne(this.cpu.memory,Y),this.display?.startRendering()}nextStep(e=!0){try{this.cpu.step(),e&&Z.update(this.cpu)}catch(e){this.halt(),Z.update(this.cpu,`Error: ${e.message}`)}}runSlowly(){this.initExecution();let e=()=>{this.cpu.shouldExit||!this.running||(this.nextStep(!0),setTimeout(e,100))};e(),this.nextStep(!0)}runQuickly(){this.initExecution();let e=()=>{let t=Date.now();for(;this.running&&!this.cpu.shouldExit&&Date.now()-t<32;)this.nextStep(!1);this.running&&!this.cpu.shouldExit&&(this.nextStep(!0),requestAnimationFrame(e))};e(),this.nextStep(!0)}halt(){this.running=!1,this.display?.stopRendering()}};Ce.addEventListener(`click`,()=>$.nextStep()),Te.addEventListener(`click`,()=>$.reset()),Ee.addEventListener(`click`,()=>$.halt()),we.addEventListener(`click`,()=>$.runSlowly()),Se.addEventListener(`click`,()=>$.runQuickly());