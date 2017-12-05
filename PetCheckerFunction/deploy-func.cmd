
if "%1"=="" GOTO ERROR
if "%2"=="" GOTO ERROR

set SFILE=%2

if NOT EXIST "%SFILE%" (
    @echo Error: Settings file %SFILE% not found
    GOTO ERROR
)

copy local.settings.json local.settings.json.bak /Y
@echo Old local.settings.json file was saved as local.settings.json.bak
@echo Updating local settings file
copy %SFILE% local.settings.json
@echo using following settings:
type local.settings.json
@echo publishing
call func azure functionapp publish %1 --publish-local-settings
GOTO END
:ERROR
@echo USAGE: deploy-func function-name settings-file
:END