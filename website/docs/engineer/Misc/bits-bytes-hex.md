---
title: "Computer Science Fundamentals - Bits, Bytes, Hex, and Memory Management"
description: "Essential computer science fundamentals covering bits, bytes, hexadecimal, memory management, and assembly debugging. Learn low-level programming concepts and system internals."
keywords: ["computer science fundamentals", "bits bytes hex", "memory management", "assembly debugging", "low level programming", "system internals", "binary representation"]
tags: ["computer-science", "fundamentals", "memory", "assembly", "debugging"]
sidebar_position: 2
---

## Overview

Notes, study and understanding computer science fundamentals around bits, bytes and hex; how memory works, how to read and debug assembly.

## Bits, Bytes, Hex

* `1 bit` = 0 or 1 so "1 bit can represent 2 x numbers"
* `1 byte` = 8 bits i.e. 00000000, 00000001 and every combo of 8-bit 0's and 1's

|Numbers in 2 bits = 4|
|---|
|00|
|01|
|10|
|11|

If we're calculating for `3 bits`

|Number in `3 bits`| 2 * (No's in 2 bits) = 8|
|---|---|
|0XX| where `XX` is equal to the `2 bit` calculation|
|1XX| where `XX` is equal to the `2 bit` calculation|

If we're calculating for `4 bits`

|Number in `4 bits`| 2 * (No's in 3 bits) = 16|
|---|---|
|0XXX| where `XXX` is equal to the `3 bit` calculation|
|1XXX| where `XXX` is equal to the `3 bit` calculation|

To summarize the sequence/pattern here:

:::tip Rule of 2

* 1 bit = 2^1 = 2 numbers
* 2 bit = 2^2 = 4 numbers
* 3 bit = 2^3 = 8 numbers
* 4 bit = 2^4 = 16 numbers

N bits = 2^N numbers

:::

> _How many numbers can `1 byte` represent?_

`N bits = 2^N numbers i.e. 2^8 = 256`

### binary to decimal

Take this binary number `10011101` and convert to decimal.

Read this as, "left most" position --> `10011101` ← count positions starting from the "right most" position where the `1` is the "zero position", and moving to the left from there the `0` is the "first" position.

:::info Calculate position

Position is counted starting from the right-most bit, and counting from 'zero'

:::

Put the number veritcally into this table from the "left most" bit at top.

We ONLY do calculations on the `1` bits and skip the `0` bits.

|bit|calculation|result|
|---|---|---|
|1| 2^7 (7th position)|128|
|0|6th position but `0`|0|
|0|5th position but `0`|0|
|1|2^4th position|16|
|1|2^3 (3rd position)|8|
|1|2^2 (3rd position)|4|
|0|1st position but `0`||
|1|2^0 (zero position)|1|

The sum = `157` is the decimal representation of `10011101`.

### Hexadecimal

* `0...9`
* `A (10), B (11), C (12), D (13), E (14), F (15)`

Take hex value `0x3EA`

|bit|calculation|result|
|---|---|---|
|3| 3*16^2 (2nd position)| 3 x (256) = 768|
|E| 14*16^1 (1st position)|14 x (16) = 224|
|A| 10*16^0 (zero position)|10 x (1) = 10|

The sum = `1002` is the decimal representation of `0x3EA`

## Resources

* [bits, bytes, hex](https://www.youtube.com/watch?v=PmG2qgQbvc8)
