#!/bin/bash

for proc in $(ps aux|grep "node ./src/main.js"|awk '{print $2}'); do kill -9 $proc; done


