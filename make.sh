#!/usr/bin/env bash
set -e

# The chrome store expects .zip files. This file merely checks if
# the zuckerfy.min.js file has been updated more recently than the
# zuckerfy.js file then zips excluding the un-minified file. If the
# condition is not met print a warning and don't update zip.

minifile="chromePackage/zuckerfy.min.js"
normfile="chromePackage/zuckerfy.js"

if [ $minifile -nt $normfile ]; then
    echo "Creating Chrome Store Package..."
    zip -r package.zip chromePackage -x "*/.DS_Store" -x "*/zuckerfy.js"
else
    echo "Warning: 'zuckerfy.min.js' has not be updated to meet changes in zuckerfy.js"
fi