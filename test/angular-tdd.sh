#!/bin/bash
DIR=$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )
karma start ${DIR}/webapp/karma.conf.js
