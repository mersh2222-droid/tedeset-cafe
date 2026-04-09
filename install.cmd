@echo off
rem ----------------------------------------------------------------------
rem Tedeset Cafe and Marketplace installer for Windows cmd.exe
rem
rem Usage:
rem   curl -fsSL https://raw.githubusercontent.com/mersh2222-droid/tedeset-cafe/main/install.cmd -o install.cmd && install.cmd && del install.cmd
rem
rem This shim bootstraps PowerShell and hands execution off to install.ps1
rem from the same repository. Any extra arguments are forwarded verbatim.
rem ----------------------------------------------------------------------

setlocal EnableExtensions EnableDelayedExpansion

set "PS_SCRIPT_URL=https://raw.githubusercontent.com/mersh2222-droid/tedeset-cafe/main/install.ps1"

where pwsh >nul 2>&1
if %ERRORLEVEL%==0 (
    set "PS_EXE=pwsh"
) else (
    where powershell >nul 2>&1
    if %ERRORLEVEL%==0 (
        set "PS_EXE=powershell"
    ) else (
        echo [install.cmd] PowerShell is required but was not found on PATH.
        echo [install.cmd] Install PowerShell 7+ from https://aka.ms/powershell and retry.
        exit /b 1
    )
)

echo [install.cmd] Using !PS_EXE! to run install.ps1
"!PS_EXE!" -NoProfile -ExecutionPolicy Bypass -Command ^
    "$ErrorActionPreference='Stop'; iex (irm '%PS_SCRIPT_URL%')" %*

set "EXITCODE=%ERRORLEVEL%"
endlocal & exit /b %EXITCODE%
