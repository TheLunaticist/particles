#clean public folder
rm -r ./public/*

#individual files
cp ./index.html ./public/
cp ./style.css ./public/

#folders
cp -r ./assets ./public/

tsc
