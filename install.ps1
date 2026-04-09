<#
.SYNOPSIS
    Install script for Tedeset Cafe and Marketplace.

.DESCRIPTION
    Bootstraps the Tedeset Cafe monorepo on Windows PowerShell 5.1+ or
    PowerShell 7+. Verifies Node.js, enables Corepack, activates the pinned
    pnpm version, installs workspace dependencies, and seeds local .env files
    from the example templates.

    Usage:
        irm https://raw.githubusercontent.com/mersh2222-droid/tedeset-cafe/main/install.ps1 | iex

    Or from a local clone:
        pwsh -File .\install.ps1
#>

[CmdletBinding()]
param(
    [string]$Repo = "https://github.com/mersh2222-droid/tedeset-cafe.git",
    [string]$Branch = "main",
    [string]$InstallPath = (Join-Path (Get-Location) "tedeset-cafe"),
    [switch]$SkipInstall,
    [switch]$SkipEnv
)

$ErrorActionPreference = "Stop"
$PnpmVersion = "9.15.0"

function Write-Step {
    param([string]$Message)
    Write-Host ""
    Write-Host "==> $Message" -ForegroundColor Cyan
}

function Write-Info {
    param([string]$Message)
    Write-Host "    $Message" -ForegroundColor Gray
}

function Write-Ok {
    param([string]$Message)
    Write-Host "    $Message" -ForegroundColor Green
}

function Write-Warn {
    param([string]$Message)
    Write-Host "    $Message" -ForegroundColor Yellow
}

function Test-Command {
    param([string]$Name)
    return [bool](Get-Command $Name -ErrorAction SilentlyContinue)
}

function Assert-Node {
    Write-Step "Checking Node.js"
    if (-not (Test-Command "node")) {
        throw "Node.js is not installed. Install Node.js 18.17+ from https://nodejs.org/ and re-run this script."
    }

    $nodeVersion = (& node --version).TrimStart("v")
    $major = [int]($nodeVersion.Split(".")[0])
    if ($major -lt 18) {
        throw "Node.js $nodeVersion detected. Tedeset Cafe requires Node.js 18.17 or newer."
    }
    Write-Ok "Node.js v$nodeVersion"
}

function Enable-Pnpm {
    Write-Step "Enabling pnpm@$PnpmVersion via Corepack"
    if (-not (Test-Command "corepack")) {
        Write-Warn "corepack not found. Falling back to npm global install."
        if (-not (Test-Command "npm")) {
            throw "npm is not available. Install a recent Node.js build that ships with npm and corepack."
        }
        & npm install -g "pnpm@$PnpmVersion" | Out-Null
    }
    else {
        & corepack enable | Out-Null
        & corepack prepare "pnpm@$PnpmVersion" --activate | Out-Null
    }

    if (-not (Test-Command "pnpm")) {
        throw "pnpm installation failed. See https://pnpm.io/installation for manual steps."
    }
    $pnpmVersion = (& pnpm --version).Trim()
    Write-Ok "pnpm v$pnpmVersion"
}

function Get-Source {
    Write-Step "Fetching Tedeset Cafe source"
    $gitDir = Join-Path $InstallPath ".git"

    if (Test-Path $gitDir) {
        Write-Info "Existing checkout detected at $InstallPath"
        Push-Location $InstallPath
        try {
            & git fetch origin $Branch
            & git checkout $Branch
            & git pull --ff-only origin $Branch
        }
        finally {
            Pop-Location
        }
        Write-Ok "Updated $InstallPath"
        return
    }

    if (-not (Test-Command "git")) {
        throw "git is not installed. Install Git for Windows from https://git-scm.com/download/win and re-run."
    }

    $parent = Split-Path -Parent $InstallPath
    if ($parent -and -not (Test-Path $parent)) {
        New-Item -ItemType Directory -Path $parent -Force | Out-Null
    }

    & git clone --branch $Branch $Repo $InstallPath
    Write-Ok "Cloned into $InstallPath"
}

function Install-Dependencies {
    if ($SkipInstall) {
        Write-Warn "Skipping pnpm install (--SkipInstall)"
        return
    }
    Write-Step "Installing workspace dependencies"
    Push-Location $InstallPath
    try {
        & pnpm install
    }
    finally {
        Pop-Location
    }
    Write-Ok "Dependencies installed"
}

function Initialize-Env {
    if ($SkipEnv) {
        Write-Warn "Skipping .env bootstrap (--SkipEnv)"
        return
    }
    Write-Step "Seeding local environment files"
    $targets = @(
        @{ Example = "apps/web/.env.example";    Local = "apps/web/.env.local" }
        @{ Example = "apps/studio/.env.example"; Local = "apps/studio/.env.local" }
    )

    foreach ($target in $targets) {
        $example = Join-Path $InstallPath $target.Example
        $local   = Join-Path $InstallPath $target.Local
        if (-not (Test-Path $example)) {
            Write-Warn "$($target.Example) not found; skipping"
            continue
        }
        if (Test-Path $local) {
            Write-Info "$($target.Local) already exists; leaving untouched"
            continue
        }
        Copy-Item $example $local
        Write-Ok "Created $($target.Local)"
    }
}

function Show-NextSteps {
    Write-Host ""
    Write-Host "Tedeset Cafe is ready." -ForegroundColor Green
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor White
    Write-Host "  1. cd `"$InstallPath`""
    Write-Host "  2. Edit apps/web/.env.local and apps/studio/.env.local with your Sanity credentials"
    Write-Host "  3. pnpm dev            # run web + studio together"
    Write-Host "     pnpm dev:web        # web only (http://localhost:3000)"
    Write-Host "     pnpm dev:studio     # Sanity Studio only"
    Write-Host ""
}

try {
    Write-Host "Tedeset Cafe and Marketplace installer" -ForegroundColor Magenta
    Assert-Node
    Enable-Pnpm
    Get-Source
    Install-Dependencies
    Initialize-Env
    Show-NextSteps
}
catch {
    Write-Host ""
    Write-Host "Install failed: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}
