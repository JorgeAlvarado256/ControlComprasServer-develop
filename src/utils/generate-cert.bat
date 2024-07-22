@echo off
setlocal enabledelayedexpansion

:: Leer las propiedades del archivo
for /f "tokens=* delims=" %%A in (cert.properties) do (
    set "line=%%A"
    set "line=!line: =!"
    if "!line!" neq "" (
        for /f "tokens=1* delims==" %%B in ("!line!") do (
            set "%%B=%%C"
        )
    )
)

:: Generar el certificado usando keytool
keytool -genkeypair -alias %alias% -keyalg %keyalg% -keysize %keysize% -validity %validity% -keystore %keystore% -storepass %storepass% -keypass %keypass% -dname %dname%
