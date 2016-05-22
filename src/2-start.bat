@echo
onecho
echo npm run build>debug-build.bat
echo npm run watch>debug-watch.bat
echo npm run start>debug-run.bat
echo npm run build-product>product-build.bat
echo npm run build-product>build-product.bat

call build-debug.bat
start "debug-watch.bat" debug-watch.bat
start "debug-run.bat" debug-run.bat