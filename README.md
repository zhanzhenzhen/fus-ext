# FutureScript Extension

```bash
npm install fus-ext
```

Copy `node_modules/fus-ext/examples/manifest.fus` file to your code's directory.

You code can be like this:

```fus
fus 0.1.0
import "./manifest" all

repeat[10, i ->
    console.log "This is \(i) time"
]
```

Here we used the "batch import" feature. Note that the export of `manifest.fus` should match the import of yours. If you want to use `node` instead of `es`, then you'll need to make corresponding changes in the version line of the two files.

If the iterator returns `break` then it means to jump out of the loop, similar to JS's `break`, but different in essence. Here `break` is an expression, and only capable of cancelling the remaining cycles, not capable of cancelling the remaining part of the function. If `break` then the `repeat` function returns `break`。This example is a loop, from 0 to 9, but it will jump out on 5:

```fus
repeat[10, i ->
    if i < 5
        console.log "This is \(i) time"
    else
        break
]
```

If no count is set, it means forever, equivalent to JS's `while (true)`:

```fus
repeat --
    if abc()
        break
    else
        doSomething()
```

This corresponds to JS's `for` loop, from 1 to 10:

```fus
repeat{from: 1, to: 10, for: i ->
    console.log i
}
```

This corresponds to JS's `for` loop, from 10 to 1:

```fus
repeat{from: 10, to: 1, by: -1, for: i ->
    console.log i
}
```
