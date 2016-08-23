@echo
onecho
echo npm run build-dev>debug-build.bat
echo npm run watch>debug-watch.bat
echo npm run debug>debug-run.bat
echo npm run build-prod>product-build.bat

call build-debug.bat
start "debug-watch.bat" debug-watch.bat
start "debug-run.bat" debug-run.bat