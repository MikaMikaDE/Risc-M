export const EXAMPLES = {

default:
`# ---------------------------------------------------- #
# This programme draws a while pixel across each px of #
# the simulator's display. It will return to the first #
# position once it has visited all (16x16 =256) pixels # 
# ---------------------------------------------------- //
.section .text
  addi t0, x0, 2         # Set the graphics mode
  li   t1, G_MODE_ADDR   # to monochrome, by writing 
  sb   t0, 0(t1)         # a '2' to address 0x9FF

_reset:
  li   a0, SCREEN_START  # reset cursor to 0xA0a
  addi a1, x0, COL_MAX   # is the bg  color < #F0?
  bge  a2, a1, _reset_bg # then reset color : #00
  addi a2, a2, COL_STEP  # else brighten its color
  j _loop                # and do not  reset color
_reset_bg:              
  addi a2, x0, BLACK     # a2 = background color
  j _loop
  
_loop:
  add  a1, x0, a2        # set   color:grey
  call _draw_pixel       # draw  pixel
  addi a0, a0, 1         # move  cursor 
  li   t0, SCREEN_END    # if at end of screen
  bge  a0, t0, _reset    # -> reset cursor
  addi a1, x0, WHITE     # set   color:white
  call _draw_pixel       # draw  pixel
  call _wait_for_next_frame
  j    _loop
        
_draw_pixel:
#a0=framePos,  a1=color;  clobbers:t0;  returns:void
  sb a1, 0(a0)           # store 1 byte = 1 pixel
  ret

_wait_for_next_frame:
#clobbers:t0-t4,  returns:void
  rdtime t0                  # t0 = start time
  la     t1, speed           # t1 = speed
  lw     t2, 0(t1)           # t2 = delay
_spin_wait:
  rdtime t3                  # t3 = current time
  sub    t4, t3, t0          # t4 = elapsed = now - start
  blt    t4, t2, _spin_wait  # if  :elapsed < now, remain
  ret                        # else:return


.set COL_MAX,      0xF0  # brightest allowed bg color
.set WHITE,        0xFF  # the color white
.set BLACK,        0x00  # the color black
.set COL_STEP,     0x10  # gradient bg col increase 
.set G_MODE_ADDR,  0x9FF # address of graphics mode
.set SCREEN_END,   0xAFF # address of  end  of screen 
.set SCREEN_START, 0xA00 # address of start of screen
.section .data
  speed: .word 30
`
,

testCases:
`# ==================================
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
` 
}

