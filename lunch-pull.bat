@echo off

set PATH=%PATH%;"C:\Program Files (x86)\Git\cmd"

cd C:\GitHub\lunch
git.exe pull -v --progress         "origin" master

pause