1. 利用NppExec启动node代码时需要用node.cmd启动

配置一-----------
taskkill /F /IM node.exe
cd "$(CURRENT_DIRECTORY)"
node-debug.cmd $(FILE_NAME)

配置二------------
taskkill /F /IM node.exe
cd "$(CURRENT_DIRECTORY)"
node.exe $(FILE_NAME)