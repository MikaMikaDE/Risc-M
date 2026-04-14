document.getElementById("listings")!.innerText = 
`========================================================================
These are not real riscv instructions, but can help when debugging:
========================================================================
$exit: 
> Exits the program. 
> You could also use a linux syscall to exit (set a7 to 10, then ecall).

$assert rs1, imm: 
> Asserts that the value stored in rs1 is equal to the val of imm.

========================================================================
These are the syscalls that the simulator knows about:
========================================================================
> 10 (exit) Terminates execution with exit code a0
> 93 (exit) Terminates execution (this is a single-threaded simulator)
`;
