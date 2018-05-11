# Compile

Before testing or publishing, it must be compiled to JS using:

```bash
rm -Rf target && rm -Rf test-target && fus lc lib target && npx babel -d target target && fus lc test test-target && npx babel -d test-target test-target
```

Before publishing write the changelog.

# Test

```bash
mocha test-target/main
```
