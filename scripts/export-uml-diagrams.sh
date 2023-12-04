#!/bin/bash

#set -e
#set -x

TEMP_FILE=/tmp/export.mmd
THEME=neutral # default, forest, dark, neutral

mkdir -p .export
pushd architecture/uml || exit

for filename in *.md; do
  EXPORTED_MMD=../../.export/"${filename%.*}".mmd
  EXPORTED_PNG=../../.export/"${filename%.*}".png

  echo "$filename -> $EXPORTED_PNG"

  grep -v '^`' $filename > $TEMP_FILE
  grep -v '^#' $TEMP_FILE > $EXPORTED_MMD
  mmdc -i $EXPORTED_MMD -o $EXPORTED_PNG -t $THEME -b transparent
  rm $EXPORTED_MMD
done

rm "$TEMP_FILE"

popd || exit

echo "All done! Files are in .export"
