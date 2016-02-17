@echo off

git.exe fetch -v --progress "origin"

TortoiseGitProc.exe /command:rebase /path:"lunch"

pause