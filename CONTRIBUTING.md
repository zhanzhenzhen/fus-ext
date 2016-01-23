# How to publish

Before publishing, it must be compiled to JS using:

```bash
fus c lib target && node node_modules/babel/bin/babel -d target target && fus c test test-target && node node_modules/babel/bin/babel -d test-target test-target
```
