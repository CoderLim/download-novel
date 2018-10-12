#!/bin/bash

for i in $(ls -tr cache)
do
  cat ./cache/$i >> final.txt
done
