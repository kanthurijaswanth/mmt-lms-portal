@echo off
REM Adjust this path if your install differs
set GRC_EXE="C:\GNURadio-3.9\bin\gnuradio-companion.exe"

REM Extract ?file= parameter from mmtgrc://open?file=...
set URL=%1
for /f "tokens=2 delims== " %%A in ('echo %URL%') do set RAW=%%A

REM URL decode %RAW% (basic)
set FILEPATH=%RAW%
set FILEPATH=%FILEPATH:%%20= %
set FILEPATH=%FILEPATH:/=\%

echo Launching: %GRC_EXE% "%FILEPATH%"
start "" %GRC_EXE% "%FILEPATH%"
