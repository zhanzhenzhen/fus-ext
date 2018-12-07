#!/bin/bash

set -e

rm -Rf target
rm -Rf test-target
rm -Rf target-cjs
rm -Rf test-target-cjs

fus c lib target
npx babel --plugins=transform-es2015-modules-commonjs,syntax-dynamic-import -x .mjs -d target-cjs target

fus c test test-target
npx babel --plugins=transform-es2015-modules-commonjs,syntax-dynamic-import -x .mjs -d test-target-cjs test-target

cd target-cjs
for file in *.js; do
    mv "$file" "$(basename "$file" .js).mjs.js"
done

cd ../test-target-cjs
for file in *.js; do
    mv "$file" "$(basename "$file" .js).mjs.js"
done
