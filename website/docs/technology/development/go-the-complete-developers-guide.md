# Go: The Complete Developers Guide (Golang)

## Overview

Doing the Udemy [course](https://www.udemy.com/course/go-the-complete-developers-guide) to learn Golang.

## Notes

From Simple Start Chapter, questions:

1. how do we run the code in our project?
2. what does 'package main' mean?
3. what does 'import "fmt"' mean?
4. what's that 'func' thing?
5. how is the `main.go` file organized

## Simple Start 

### run code 

`go run main.go`

- go run = compile & run
- go build = just compile
- go install, go get = installs pkg, download raw source code

### package main 

package == project == workspace

all files belonging to that "package" must declare so at the top with `package main`.

2 types of package = executable (runnable) and reusable (a 'helper', good for logic, libs)

`package main` is SACRED! only use it if you want to create a "runnable" file. a "non-main" package, compiles but does NOT run anything.

any executable package main **must** have a `func main` in it.

rename package to anything else and do `go build` does NOT build any executable file.

### import fmt

gives us access to `fmt` library/package. 

### func 

`fun main() {` - short for function.

### main.go organized

- package declaration
- imports packages 
- func main

## Deeper into Go 

### variable declaration

this `var Name string` and `name := "Ron"` are EQUIVALENT in variable initialization and (initial) assignment the `:=` will determine the type for you.

`:=` use only when declaring new vars, dont use for value "assignment".

### functions 

when writing up non-main functions, this is the format `func funcName() typeToReturn` e.g. `func newCard() string {` you'll get an error message if return type and return value type are mismatched.

### Slice and For Loops

Array = fixed list
Slice = array that can grow/shrink

the TYPES in a slice **must be of the same type.**

declare a slice: `cards := []string{"elements","inside","slice"}`. the `[]` and `string` declares its a "slice" of type "string", and then `{}` to hold the elements of the slice.

adding elements to a slice: `cards = append(cards, "newElement")` <-- important to note here that the original "cards" slice is not modified with this new element, instead a NEW slice with the appended element is returned.

iterate over a slice, print every element: `for i, card := range cards { fmt.Println(i, card)}`

i = index, range = iterate over every element in slice.

### OO vs Go

Go is NOT OO language.

Think - go types (string, int, float, array, map), then extend `type deck []string`, then functions 

- `main.go` - our main program that manipulates the deck
- `deck.go` - describe deck, how it works (spec?)
- `deck_test.go` - automatically test our deck 

### Our Card Deck Go Program 

For our card app, what functions do we want?

1. newDeck - create return list of playing cards (array of strings)
2. print
3. shuffle 
4. deal
5. saveToFile
6. newDeckFromFile

add the custom types and receivers as necessary.

### Custom types and receiver functions

we can do something like this to sort of simulate "extends" from OO approach

```go
// in a separate .go file

// declare new type 
type deck []string

// create custom method for new type
func (d deck) print() {
    for i, card := range d {
        fmt.Println(i, card)
      }
  }
```

we can now use `deck` "type" anywhere in our main package code.

printing the new type out now made easier with our `print()` function.

`(d deck)` is the bit that makes this func a "receiver" function. A receiver sets up methods on variables we create e.g. we create var `card` of type `deck`, and now the print func can be setup on ANY var of type `deck` e.g. `card.print()`

think of `d` arg as `this` or `self` - in go, never use "this" or "self", and also always refer to the THING that you're setting method up on, by convention if your type is `deck` your arg name will be `d`, but you can do whatever as long as the references match i.e. `(d deck)` and `range d` match.

if you have a var that you don't care to use, and want to avoid the "you declared but haven't used this var" error message, replace them with `_` underscore.

### Slice Range Syntax

Dealing out a "hand", a slice of the 52 available cards.

slices indexed from `0`, e.g. `fruits[0]`

for a subset, or range of the slice: `fruits[0:2]` will give you fruits of index 0,1 cos the first index `0` is "inclusive", but the 2nd index `2` is "up to, but NOT including" `2`.

shorthand for this can be `[:2]` is the same as `[0:2]`, another example is `[2:]` is the same as `[2:n]` i.e. "from index 2 until the end of the index"

when returning 2 x type deck values from the function, you assign them to two variables like this: `hand, remainingDeck := deal(cards, 5)` <-- because `deal(cards, 5)` gets `(deck, deck)` from the receiver function.

### Deck to String 

trying to save to file, `import io/ioutil` we need to transfer our strings to a `[]byte` "byte slice".

a way to do a "type conversion":

```go
greeting = "Hi there!"
fmt.Println([]byte(greeting)) // changes the greeting string into a byte slice.
```

our process = start with `deck` --> `[]string` --> `string` --> `[]byte`

the `string` is ALL card strings smashed together to then convert to a `[]byte`.

### Join slice of Strings 

lookup and use `strings` library `Join` function.

### Save data to HDD 

lookup and use `io/iotuil` library `WriteFile` function for writing a `[]byte` byte slice to disk under "filename".

### Read data from HDD

use `io/ioutil` functions `ReadFile` to do the reverse and open a file from HDD, then use `strings` function `Split` to reverse what you did with `Join`, now you have a `[]string` string slice AKA a `deck type`.

### Error handling 

the `err` convention

```go
...
if err != nil {
    fmt.Println("Error:", err)
    os.Exit(1)
  }
```

make sure to `import os`, and any non-zero number inside `Exit()` to signal a bad exit.

## Summary

type deck
tie methods to the new type deck
receivers = can tack onto the type deck e.g. `cards.print()`
no receiver for methods like `.deal()` because the "root" instance of the deck (??)

## Assignment 1

write a go program that iterates over a range of numbers and evaluates even and odd and prints a statement to each.

my solution:

```go
package main

import "fmt"

func main() {
    numbers := []int{1,2,3,4,5,6,7,8,9,10}

    for _, num := range numbers {
        if num % 2 == 0 {
            fmt.Println(num, " is even.")
        } else {
            fmt.Println(num, " is odd.")
          }
        }
      }
  }
```

## Data Structures

## structs 

aka data structures are a "collection of properties that are related together".

we first define a "structure" e.g. of a person, then we create instances of people.

e.g.

```go
type person struct {
    firstName string
    lastName string
}
```
few different ways to construct `struct`

1. `alex := person{firstName: "Alex", lastName: "Anderson"}`
2. `var alex person` then init with `alex.firstName = "Alex"` and `alex.lastName = "Anderson"`
3. `var alex person` then `fmt.Printf("%+v", alex)` with `%+v` printing out field names and values.

### updating struct values

if you don't init the vars with values, if string they get assigned `""` empty string value.
if bool or int, they get `0`.

so if you `fmt.Println(alex)` with no value assigned, you get `{ }` printed out i.e. "empty strings"

using `fmt.Printf()` and syntax `fmt.Printf("%+v", alex)` as the 3rd way to show structs.

final form :

```go
package main

import "fmt"

type person struct {
  firstName string
  lastName string
}

func main() {
  //alex := person{firstName: "Alex", lastName: "Anderson"} // version 1

  var alex person // version 2

  alex.firstName = "Alex"
  alex.lastName = "Anderson"

  fmt.Println(alex)
  fmt.Printf("%+v", alex)
}
```

### embedded structs 

embed on struct inside another struct. 

type person 
type contactInfo

you can use custom types inside our structs.

```go
package main

import "fmt"

type contactInfo struct {
  email string
  zipCode int
}
type person struct {
  firstName string
  lastName string
  contact contactInfo
}

func main() {
  jim := person{
    firstName: "Jim",
    lastName: "Party",
    contact: contactInfo{
      email: "jim@gmail.com",
      zipCode: 94000,
    },
  }
  fmt.Printf("%+v", jim)
}
```

another method of declaring our `contactInfo` is to remove the explicit variable name `contact` and just do the following:

```go
type person struct {
    firstName string
    lastName string
    contactInfo
  }
```

and then 

```go
function main() {
    jim := person{
        firstName: "Jim",
        lastName: "Party",
        contactInfo: contactInfo{
            email: "jim@gmail.com",
            zipCode: 94000,
        },
    }
}
```

### structs receiver functions

recap receiver functions 

```
func (letter type) funcName(varName varType) { }

e.g.
func (p person) updateName(newFirstName string)
```

### pointers

the reason the updateName function did not work.

Go is a "pass by values" means you work on a COPY of the value of the object/thing, not the original object/thing.

e.g. we contruct the `person{firstName: "Jim"...}` person, but when we pass the value to our function for a name update `func (p person) updateName(newFirstName string)`, it creates a copy `p` of the person Jim:

|RAM|
|---|---|
|Address|Value|
|0000||
|0001|`person{firstName: "Jim"...}`|
|0002||
|0003|`person{firstName: "Jim"...}`|

original Jim object at `0001`, "newFirstName" Jim object (i.e. `p`) at `0003`.

to summarize, when `updateName` is called, go makes a COPY of that struct, and then makes the COPY (`p`) available to the function for processing.

why does go do this?

### Pointer Operations

:::info operators

`&` creates a memory ADDRESS pointer 

`*` creates a memory VALUE pointer

:::

`&jim` = "give me the memory address of the value this variable is pointing to"

so `jimPointer := &jim` is now pointing to the MEMORY ADDRESS of whatever `&jim` evaluated to.

`*pointer` = "give me the value this memory address is pointing to"

so `func(pointerToPerson *person)` says give me the VALUE at the pointer where this `*pointer` memory address is pointing.

understand difference between pointer as a TYPE and as a POINTER:

1. pointer in front of a type e.g. `func (pointerToPerson *person)` means this receiver can only accept a type of a "pointer to a person" i.e. something like `jimPointer`
2. pointer in front of a pointer e.g. `(*pointerToPerson).firstName`

#### rules to remember

use `*address` to turn an address into value.

use `&value` to turn a value into address.

### shortcuts 

with this code:

```go 
  jimPointer := &jim
  jimPointer.updateName("jimmy")
  jim.print()
```

you can remove `jimPointer := &jim`, and the `func (pointerToPerson *person)` will automatically take your "type person" and turn it into a "pointer person (`*person`)" for you.

## Pointer Gotchas 

struct vs slice 

with struct, you need pointers to update the actual values.

with stlices - values seem to update directly as you act upon the values.

### Reference vs Value Types 

arrays vs slices - arrays are primitive, can't be resized. we use slices more. 

a slice gives us BOTH a slice data structure (ptr, capacity, length) and array data structure (ptr points to the elements in our slice "array").

in memory, our SLICE is registered as the slice data structure at one memory address, and the actual array with our elements in it at another memory address.

when the "pass by value" happens when we pass our slice to a function, the COPY go makes of the slice is just the SLICE data structure, which goes into another address- BUT, this COPY still points to the SAME ARRAY values the original slice data structure points to.

so when we modify the SLICE, we are not modifying a COPY of the array values for the slice, there is no COPY, we are modifying the original array values from the slice.

slice is a "reference" type - it a data structure that refers to ANOTHER data structure in RAM.

Other reference types: maps, channels, pointers, functions.
value types: int, float, string, bool, structs.



