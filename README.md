# FutureScript Extension

This library runs on both Node.js and browser.

While you can use this library in normal JavaScript, it's highly recommended to use it in [FutureScript](http://futurescript.org/).

```bash
npm install fus-ext
```

In `node_modules/fus-ext/examples` directory, there're 3 manifest files. Copy one of them to your code's directory. Rename the new file to `manifest.fus` if needed.

- `manifest.fus`: For general purposes.
- `manifest-lodash.fus`: Suitable if you want to bind `..` to Lodash (or Underscore after modification) instead of the fus-ext built-in.
- `manifest-no-op.fus`: Suitable if you don't want to bind `..` to anything, or you want to bind later in your own code.

Your code can be like this:

```fus
fus 1.3.1
import "./manifest" all

loop(10, i ->
    console.log "This is \(i) time"
)
```

Here we used the "batch import" feature. Note that the export of `manifest.fus` should match the import of yours. If you want to use `node` instead of `es`, then you'll need to make corresponding changes in the version line of the two files.

The following document lists the API. Note that all functions that take 2 or more parameters can also be called using an array argument.

global
======

Syntax: `global`

Equivalent to `sys.global`. Note, that Node.js `global` is a global variable, but this variable is local, though they are the same in practice.

sys
====

global
------

Syntax: `sys.global`

The global object. In browser, it's equivalent to `window`. In Node.js, it's equivalent to `global`.

feVersion
---------

Syntax: `sys.feVersion`

Returns the fus-ext version.

isNode
------

Syntax: `sys.isNode`

Returns true if it's in Node.js, or false otherwise.

loop, repeat, break
===================

`loop` and `repeat` are similar. The only difference is that `repeat` returns the results as an array while `loop` returns `void`. So, `repeat` make cause performance issue if you run a huge number of cycles. For example, if there're 1,000,000,000 cycles and you use `repeat`, then the results array will be too big.

If the iterator returns `break` then it means to jump out of the loop, similar to JS's `break`, but different in essence. Here `break` is an expression, and only capable of cancelling the remaining cycles, not capable of cancelling the remaining part of the function. If `break` then the `loop` or `repeat` function returns `break`. This example is a loop, from 0 to 9, but it will jump out on 5:

```fus
loop(10, i ->
    if i < 5
        console.log "This is \(i) time"
    else
        break
)
```

If no count is set, it means forever, equivalent to JS's `while (true)`:

```fus
loop --
    if abc()
        break
    else
        doSomething()
```

This corresponds to JS's `for` loop, from 1 to 10:

```fus
loop{1 to 10 for i ->
    console.log i
}
```

This corresponds to JS's `for` loop, from 10 to 1:

```fus
loop{10 to 1 by -1 for i ->
    console.log i
}
```

This will output `[1, 3, 5, 7, 9]`:

```fus
console.log repeat{1 to 10 by 2}
```

This will output `[0, 1, 2, 3, 4]`:

```fus
console.log repeat(5)
```

This will output `[2, 3, 4, 5, 6]`:

```fus
console.log repeat(5, i -> i + 2)
```

web
====

request
-------

Syntax: `web.request(options)`

This low-level method underlies all other methods, returning a promise of response. For options, it can contain the following properties:

- `method`: Required. Must be a string, such as `"GET"`, `"POST"`, etc.
- `uri`: Required. Must be a string.
- `headerFields`: Optional. It's an object with header fields as properties.
- `body`: Optional. It's a string or a `Uint8Array` instance.
- `timeout`: Optional. It's a number in milliseconds. Defaults to never.
- `responseBodyType`: Optional. `"text"`, `"json"` or `"binary"`. Defaults to `"text"`. The program will do some conversion when returning response, if needed.

get
----

Syntax: `web.get(uri, [options])`

Do HTTP GET for the `uri`, returning a promise of a response. Options valid in `web.request` are also valid in this method.

jsonGet
-------

Syntax: `web.jsonGet(uri, [options])`

Do HTTP GET for the `uri`, returning a promise of a response with its body represented as a JSON value. Options valid in `web.request` are also valid in this method.

binaryGet
---------

Syntax: `web.binaryGet(uri, [options])`

Do HTTP GET for the `uri`, returning a promise of a response with its body represented as a `Uint8Array` instance. Options valid in `web.request` are also valid in this method.

post
----

Syntax: `web.post(uri, body, [options])`

Do HTTP POST for the `uri` and `body`, returning a promise of a response. `body` can be string or `Uint8Array` instance. Options valid in `web.request` are also valid in this method.

jsonPost
--------

Syntax: `web.post(uri, body, [options])`

Do HTTP POST for the `uri` and `body`, returning a promise of a response with its body represented as a JSON value. The argument `body` must be also a JSON value, which will be stringified by the library before sending. Options valid in `web.request` are also valid in this method.
