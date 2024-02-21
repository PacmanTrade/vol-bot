#!/bin/bash

. ./api.config

base=
stock=
volume=

count=0
for i in "$@"; do
	case $1 in
		--base=* | -b=*)	shift
							base="${i#*=}"
							;;
		--stock=* | -s=*) 	shift
							stock="${i#*=}"
							;;
		--volume=*)		shift
    							volume="${i#*=}"
    							;;
		*) echo "invalid option passed in: $1"
			exit 1
	esac
	let count=count+1
done

if [ $count -lt 3 ]; then
	echo -e "\n Error: Not enough arguments provided; Please make sure you have read the documentation \n"
	exit 1
fi

node ./src/main.js --sessionKey=$sessionKey --base=$base --stock=$stock --volume=$volume &> logs/$stock.$base.log &


