1. ����NppExec����node����ʱ��Ҫ��node.cmd����

����һ-----------
taskkill /F /IM node.exe
cd "$(CURRENT_DIRECTORY)"
node-debug.cmd $(FILE_NAME)

���ö�------------
taskkill /F /IM node.exe
cd "$(CURRENT_DIRECTORY)"
node.exe $(FILE_NAME)