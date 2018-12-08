# Initialization

Do not use `npm install` or `npm update` because we don't have `package.json` in Git repo. You should always use the following command:

```bash
./make
```

This command will generate `package.json`, do `npm update` and compile.

# Compile

Before testing or publishing, also use `./make` command.

# Test

```bash
mocha test-target-cjs/main.mjs
```

# Publish

Before publishing write the changelog.

# FAQ

Q: Why in `target-cjs` the filename is in `.mjs.js` format?

A: This way we make the form `import "./module-name.mjs"` compatible for both browser and Node.js. Note that browsers can't guess file extensions, so to make it browser-compatible we must include the `.mjs` extension. If we're on browser, then `target` directory is used, and the import string exactly refers to the full filenames in this directory. If we're on Node.js, then `target-cjs` is used, and the import string refers to the basename of the filenames in this directory. Node.js can guess file extensions, so omitting file extensions is OK. Therefore, the same import string is correct in both scenarios.
