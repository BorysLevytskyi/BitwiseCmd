pr@echo off

SET appUrl="http://localhost:13270/src/#clear"
SET confFile=e2e.chrome.js

FOR %%p IN (%*) DO (
    IF [%%p] == [all] SET confFile=e2e.all.js
    IF [%%p] == [build] SET appUrl="http://localhost:63342/BitwiseCmd/build/#clear"
    IF [%%p] == [deploy] SET appUrl="http://bitwisecmd.com/#clear"
)

@echo on

echo "appUrl: %appUrl%"
echo "confFile: %confFile%"

protractor tests\%confFile% --params.appUrl=%appUrl%