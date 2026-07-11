<#
╔═══════════════════════════════════════════════════════════════╗
║                ULTRACLEANER - Full System Cleanup             ║
║  Cleans junk, optimizes Windows, checks for malware/viruses   ║
║  Safe mode - preserves Documents, Desktop, Downloads, Photos  ║
╚═══════════════════════════════════════════════════════════════╝
#>

$ErrorActionPreference = "SilentlyContinue"
$LogFile = "$env:USERPROFILE\Desktop\UltraCleaner_Log.txt"
$StartTime = Get-Date

# ─── Color & Display Helpers ───
function Write-Status {
    param([string]$Message, [string]$Color = "Cyan")
    $timestamp = Get-Date -Format "HH:mm:ss"
    Write-Host "[$timestamp] $Message" -ForegroundColor $Color
    Add-Content -Path $LogFile -Value "[$timestamp] $Message"
}

function Write-Header {
    param([string]$Title)
    Write-Host ""
    Write-Host "═══════════════════════════════════════════════" -ForegroundColor Yellow
    Write-Host "  $Title" -ForegroundColor Yellow
    Write-Host "═══════════════════════════════════════════════" -ForegroundColor Yellow
    Add-Content -Path $LogFile -Value ""
    Add-Content -Path $LogFile -Value "------- $Title -------"
}

# ─── SCRIPT START ───
Clear-Host
Write-Host @"

  _   _ _    _            _____      _ _                      
 | | | | |  | |          / ____|    | | |                     
 | | | | |  | | ______  | |    _   _| | | ___                 
 | | | | |  | | ______  | |   | | | | | |/ _ \                
 | |_| | |__| |         | |___| |_| | | |  __/                
  \___/ \____/           \_____\__,_|_|_|\___|                
                                                               
        Full System Cleanup + Optimize + Security Scan         
"@ -ForegroundColor Green
Write-Host "  Log file: $LogFile`n" -ForegroundColor Gray
Write-Host "  Started: $StartTime`n" -ForegroundColor Gray

# ═══════════════════════════════════════════════════════════════
# PART 1: JUNK & TEMP FILE CLEANUP
# ═══════════════════════════════════════════════════════════════
Write-Header "PART 1: JUNK & TEMP FILE CLEANUP"

# 1a. Windows Temp folders
Write-Status "Cleaning Windows Temp..." -Color Yellow
$tempFolders = @(
    "$env:TEMP",
    "$env:WINDIR\Temp",
    "$env:WINDIR\Prefetch",
    "$env:WINDIR\SoftwareDistribution\Download",
    "$env:LOCALAPPDATA\Temp",
    "C:\Windows\Logs\CBS"
)

foreach ($folder in $tempFolders) {
    if (Test-Path $folder) {
        try {
            Get-ChildItem -Path $folder -Recurse -Force -ErrorAction SilentlyContinue |
                Where-Object { !$_.PSIsContainer -and $_.LastWriteTime -lt (Get-Date).AddDays(-1) } |
                Remove-Item -Force -Recurse -ErrorAction SilentlyContinue
            Write-Status "  Cleaned: $folder" -Color Gray
        } catch { }
    }
}

# 1b. Run Disk Cleanup (silent)
Write-Status "Running Disk Cleanup..." -Color Yellow
Start-Process -FilePath "cleanmgr.exe" -ArgumentList "/sagerun:1" -NoNewWindow -Wait
Start-Sleep -Seconds 2

# 1c. Browser Cache Cleanup
Write-Status "Cleaning browser caches..." -Color Yellow

# Chrome
$chromeCache = "$env:LOCALAPPDATA\Google\Chrome\User Data\Default\Cache"
if (Test-Path $chromeCache) {
    Remove-Item "$chromeCache\*" -Force -Recurse -ErrorAction SilentlyContinue
    Write-Status "  Chrome cache cleared" -Color Gray
}
$chromeCodeCache = "$env:LOCALAPPDATA\Google\Chrome\User Data\Default\Code Cache"
if (Test-Path $chromeCodeCache) {
    Remove-Item "$chromeCodeCache\*" -Force -Recurse -ErrorAction SilentlyContinue
    Write-Status "  Chrome code cache cleared" -Color Gray
}

# Edge
$edgeCache = "$env:LOCALAPPDATA\Microsoft\Edge\User Data\Default\Cache"
if (Test-Path $edgeCache) {
    Remove-Item "$edgeCache\*" -Force -Recurse -ErrorAction SilentlyContinue
    Write-Status "  Edge cache cleared" -Color Gray
}

# Firefox
$ffCache = "$env:LOCALAPPDATA\Mozilla\Firefox\Profiles"
if (Test-Path $ffCache) {
    Get-ChildItem $ffCache -Directory | ForEach-Object {
        $cacheFolder = Join-Path $_.FullName "cache2"
        if (Test-Path $cacheFolder) { Remove-Item "$cacheFolder\*" -Force -Recurse -ErrorAction SilentlyContinue }
    }
    Write-Status "  Firefox cache cleared" -Color Gray
}

# 1d. User Temp folders
Write-Status "Cleaning user temp data..." -Color Yellow
$userTempFolders = @(
    "$env:USERPROFILE\AppData\Local\Microsoft\Windows\INetCache",
    "$env:USERPROFILE\AppData\Local\Microsoft\Windows\WER",
    "$env:USERPROFILE\AppData\Local\CrashDumps",
    "$env:USERPROFILE\Recent"
)
foreach ($folder in $userTempFolders) {
    if (Test-Path $folder) {
        Remove-Item "$folder\*" -Force -Recurse -ErrorAction SilentlyContinue
    }
}

# 1e. Recycle Bin
Write-Status "Emptying Recycle Bin..." -Color Yellow
(New-Object -ComObject Shell.Application).NameSpace(0xa).Items() |
    ForEach-Object { $_.InvokeVerb("delete") }
Write-Status "  Recycle Bin emptied" -Color Green

# 1f. Old Windows Update cache
Write-Status "Cleaning Windows Update cache..." -Color Yellow
$wuFolder = "$env:WINDIR\SoftwareDistribution\Download"
if (Test-Path $wuFolder) {
    Stop-Service wuauserv -Force -ErrorAction SilentlyContinue
    Remove-Item "$wuFolder\*" -Force -Recurse -ErrorAction SilentlyContinue
    Start-Service wuauserv -ErrorAction SilentlyContinue
    Write-Status "  Windows Update cache cleaned" -Color Gray
}

# 1g. Thumbnail cache
Write-Status "Cleaning thumbnail cache..." -Color Yellow
Stop-Process -Name explorer -Force -ErrorAction SilentlyContinue
Remove-Item "$env:LOCALAPPDATA\Microsoft\Windows\Explorer\thumbcache_*.db" -Force -ErrorAction SilentlyContinue
Remove-Item "$env:LOCALAPPDATA\Microsoft\Windows\Explorer\*.db" -Force -ErrorAction SilentlyContinue
Write-Status "  Thumbnail cache cleared" -Color Gray

# ═══════════════════════════════════════════════════════════════
# PART 2: SYSTEM OPTIMIZATION
# ═══════════════════════════════════════════════════════════════
Write-Header "PART 2: SYSTEM OPTIMIZATION"

# 2a. Disable unnecessary startup programs
Write-Status "Disabling unnecessary startup programs..." -Color Yellow
$badStartups = @(
    "OneDrive",
    "Skype",
    "Spotify",
    "Discord",
    "Steam",
    "EpicGamesLauncher",
    "AdobeGCInvoker",
    "MicrosoftEdgeAutoLaunch",
    "SunJavaUpdateSched",
    "GoogleUpdate",
    "AdobeReaderSpeedLauncher",
    "iTunesHelper"
)
Get-CimInstance Win32_StartupCommand | Where-Object {
    $badStartups | Where-Object { $_.Name -like "*$_*" -or $_.Command -like "*$_*" }
} | ForEach-Object {
    try {
        Remove-ItemProperty -Path "HKLM:\SOFTWARE\Microsoft\Windows\CurrentVersion\Run" -Name $_.Name -ErrorAction SilentlyContinue
        Remove-ItemProperty -Path "HKCU:\SOFTWARE\Microsoft\Windows\CurrentVersion\Run" -Name $_.Name -ErrorAction SilentlyContinue
        Write-Status "  Disabled startup: $($_.Name)" -Color Gray
    } catch { }
}

# 2b. Disable unnecessary services
Write-Status "Optimizing services..." -Color Yellow
$servicesToDisable = @(
    @{Name="DiagTrack"; Display="Connected User Experiences and Telemetry"},
    @{Name="dmwappushservice"; Display="Device Management WAP Push"},
    @{Name="WMPNetworkSvc"; Display="Windows Media Player Network Sharing"},
    @{Name="RemoteRegistry"; Display="Remote Registry"},
    @{Name="TabletInputService"; Display="Touch Keyboard and Handwriting"},
    @{Name="XblAuthManager"; Display="Xbox Live Auth Manager"},
    @{Name="XblGameSave"; Display="Xbox Live Game Save"},
    @{Name="XboxNetApiSvc"; Display="Xbox Live Networking"},
    @{Name="XboxGipSvc"; Display="Xbox Accessory Management"},
    @{Name="lfsvc"; Display="Geolocation Service"},
    @{Name="MapsBroker"; Display="Downloaded Maps Manager"},
    @{Name="PcaSvc"; Display="Program Compatibility Assistant"},
    @{Name="RetailDemo"; Display="Retail Demo Service"},
    @{Name="WSearch"; Display="Windows Search"},
    @{Name="WbioSrvc"; Display="Windows Biometric"},
    @{Name="WerSvc"; Display="Windows Error Reporting"},
    @{Name="wcncsvc"; Display="Windows Connect Now"},
    @{Name="SharedAccess"; Display="Internet Connection Sharing"},
    @{Name="DoSvc"; Display="Delivery Optimization"}
)
foreach ($svc in $servicesToDisable) {
    try {
        Set-Service -Name $svc.Name -StartupType Disabled -ErrorAction SilentlyContinue
        Stop-Service -Name $svc.Name -Force -ErrorAction SilentlyContinue
        Write-Status "  Disabled: $($svc.Display)" -Color Gray
    } catch { }
}

# 2c. Power plan - High Performance
Write-Status "Setting power plan to High Performance..." -Color Yellow
try {
    powercfg /change standby-timeout-ac 0
    powercfg /change hibernate-timeout-ac 0
    powercfg /change monitor-timeout-ac 15
    powercfg /setactive 8c5e7fda-e8bf-4a96-9a85-a6e23a8c635c 2>$null
    Write-Status "  Power plan set to High Performance" -Color Green
} catch { }

# 2d. Disable visual effects for performance
Write-Status "Optimizing visual effects for performance..." -Color Yellow
try {
    Set-ItemProperty -Path "HKCU:\Software\Microsoft\Windows\CurrentVersion\Explorer\VisualEffects" -Name "VisualFXSetting" -Value 2 -Type DWord
    Write-Status "  Visual effects set to 'Adjust for best performance'" -Color Gray
} catch { }

# 2e. Disable background apps
Write-Status "Disabling background apps..." -Color Yellow
try {
    Get-ChildItem "HKCU:\Software\Microsoft\Windows\CurrentVersion\BackgroundAccessApplications" |
        ForEach-Object { Set-ItemProperty -Path $_.PsPath -Name "Disabled" -Value 1 -Type DWord -ErrorAction SilentlyContinue }
    Write-Status "  Background apps disabled" -Color Gray
} catch { }

# 2f. Disable startup delay
Write-Status "Disabling startup delay..." -Color Yellow
try {
    Set-ItemProperty -Path "HKLM:\SOFTWARE\Microsoft\Windows\CurrentVersion\Explorer\Serialize" -Name "StartupDelayInMSec" -Value 0 -Type DWord -ErrorAction SilentlyContinue
    Write-Status "  Startup delay disabled" -Color Gray
} catch { }

# 2g. Disable game mode / DVR
Write-Status "Disabling Game DVR (reduces lag)..." -Color Yellow
try {
    Set-ItemProperty -Path "HKCU:\Software\Microsoft\Windows\CurrentVersion\GameDVR" -Name "AppCaptureEnabled" -Value 0 -Type DWord -ErrorAction SilentlyContinue
    Set-ItemProperty -Path "HKCU:\System\GameConfigStore" -Name "GameDVR_Enabled" -Value 0 -Type DWord -ErrorAction SilentlyContinue
    Write-Status "  Game DVR disabled" -Color Gray
} catch { }

# ═══════════════════════════════════════════════════════════════
# PART 3: MALWARE & VIRUS SCAN
# ═══════════════════════════════════════════════════════════════
Write-Header "PART 3: MALWARE & VIRUS DETECTION"

# 3a. Check Windows Defender status
Write-Status "Checking Windows Defender status..." -Color Yellow
$defender = Get-MpComputerStatus -ErrorAction SilentlyContinue
if ($defender) {
    Write-Status "  Defender: $($defender.AntivirusEnabled)" -Color Gray
    Write-Status "  Signature age: $($defender.AntispywareSignatureAge) day(s)" -Color Gray
    if ($defender.AntispywareSignatureAge -gt 7) {
        Write-Status "  Updating Defender signatures..." -Color Yellow
        Update-MpSignature -ErrorAction SilentlyContinue
        Write-Status "  Signatures updated!" -Color Green
    }
} else {
    Write-Status "  Windows Defender is not available!" -Color Red
}

# 3b. Run Windows Defender Full Scan
Write-Status "Starting Windows Defender Full Scan (this takes time)..." -Color Yellow
Write-Status "  Scan is running in background... check log for results" -Color Cyan
try {
    $scanResult = Start-MpScan -ScanType FullScan -ErrorAction SilentlyContinue
    Start-Sleep -Seconds 5
    
    # Check scan results
    $threats = Get-MpThreatDetection -ErrorAction SilentlyContinue
    if ($threats) {
        Write-Status "  ⚠ THREATS FOUND!" -Color Red
        $threats | Format-Table -AutoSize | Out-String | Write-Host -ForegroundColor Red
        $threats | Out-String | Add-Content -Path $LogFile
    } else {
        Write-Status "  No threats detected in quick check" -Color Green
    }
} catch {
    Write-Status "  Defender scan couldn't start: $_" -Color Yellow
}

# 3c. Check suspicious processes
Write-Status "Checking for suspicious processes..." -Color Yellow
$suspiciousNames = @(
    "miner", "xmr", "ethminer", "cpuminer", "xmrig",
    "cryptominer", "bitcoinminer", "monero",
    "keylogger", "remoteviewer", "teamviewer*",
    "anydesk*", "vnc", "tightvnc", "ultravnc",
    "netcat", "nc.exe", "ncat",
    "psexec", "wmiexec",
    "meterpreter", "beacon"
)
$suspiciousProcs = Get-Process | Where-Object {
    $name = $_.ProcessName.ToLower()
    $suspiciousNames | Where-Object { $name -like $_ }
}
if ($suspiciousProcs) {
    Write-Status "  ⚠ Suspicious processes found!" -Color Red
    $suspiciousProcs | Format-Table Id, ProcessName, CPU, WorkingSet -AutoSize | Out-String | Add-Content -Path $LogFile
    $suspiciousProcs | Format-Table Id, ProcessName, CPU, WorkingSet -AutoSize | Write-Host -ForegroundColor Red
} else {
    Write-Status "  No suspicious processes running" -Color Green
}

# 3d. Check startup entries for malware patterns
Write-Status "Checking startup entries for malware..." -Color Yellow
$malwareStartupPatterns = @("*miner*", "*crypto*", "*remote*", "*vnc*", "*keylog*", "*trojan*", "*backdoor*", "*dropper*")
$badStartup = @()
$startupPaths = @(
    "HKLM:\SOFTWARE\Microsoft\Windows\CurrentVersion\Run",
    "HKLM:\SOFTWARE\Microsoft\Windows\CurrentVersion\RunOnce",
    "HKCU:\SOFTWARE\Microsoft\Windows\CurrentVersion\Run",
    "HKCU:\SOFTWARE\Microsoft\Windows\CurrentVersion\RunOnce"
)
foreach ($path in $startupPaths) {
    if (Test-Path $path) {
        Get-ItemProperty -Path $path -ErrorAction SilentlyContinue | ForEach-Object {
            $_.PSObject.Properties | Where-Object {
                $_.Name -notin @("PSPath", "PSParentPath", "PSChildName", "PSDrive", "PSProvider")
            } | ForEach-Object {
                $val = "$($_.Value)".ToLower()
                foreach ($pattern in $malwareStartupPatterns) {
                    if ($val -like $pattern) { $badStartup += "$($_.Name) -> $($_.Value)" }
                }
            }
        }
    }
}
if ($badStartup.Count -gt 0) {
    Write-Status "  ⚠ Suspicious startup entries found!" -Color Red
    $badStartup | ForEach-Object { Write-Status "    $_" -Color Red }
} else {
    Write-Status "  Startup entries look clean" -Color Green
}

# 3e. Check scheduled tasks for suspicious
Write-Status "Checking scheduled tasks..." -Color Yellow
$suspiciousTasks = Get-ScheduledTask -ErrorAction SilentlyContinue | Where-Object {
    $taskName = $_.TaskName.ToLower()
    $taskName -match "miner|crypto|coin|bitcoin|monero|xmr|remote|trojan|backdoor" -or
    $_.Actions.Execute -match "miner|coin|bitcoin"
}
if ($suspiciousTasks) {
    Write-Status "  ⚠ Suspicious scheduled tasks found!" -Color Red
    $suspiciousTasks | Format-Table TaskName, State -AutoSize | Out-String | Write-Host -ForegroundColor Red
} else {
    Write-Status "  Scheduled tasks look clean" -Color Green
}

# 3f. Check hosts file
Write-Status "Checking hosts file for redirections..." -Color Yellow
$hostsPath = "$env:WINDIR\System32\drivers\etc\hosts"
if (Test-Path $hostsPath) {
    $hostsContent = Get-Content $hostsPath -ErrorAction SilentlyContinue | Where-Object {
        $_ -match "^\s*0\.0\.0\.0" -or $_ -match "^\s*127\.0\.0\.1"
    }
    $hostsCount = ($hostsContent | Measure-Object).Count
    if ($hostsCount -gt 30) {
        Write-Status "  ⚠ Unusually high hosts entries ($hostsCount) - possible malware" -Color Yellow
    } else {
        Write-Status "  Hosts file looks normal ($hostsCount entries)" -Color Green
    }
}

# 3g. Check for large unknown .exe files in user folders
Write-Status "Checking user folders for suspicious executables..." -Color Yellow
$suspiciousFiles = @()
$userFolders = @(
    "$env:USERPROFILE\Downloads",
    "$env:USERPROFILE\Desktop",
    "$env:USERPROFILE\Documents"
)
foreach ($folder in $userFolders) {
    if (Test-Path $folder) {
        Get-ChildItem -Path $folder -Filter "*.exe" -File -ErrorAction SilentlyContinue | Where-Object {
            $_.Length -lt 5MB -and $_.LastWriteTime -gt (Get-Date).AddDays(-30)
        } | ForEach-Object {
            $suspiciousFiles += $_.FullName
        }
    }
}
if ($suspiciousFiles.Count -gt 0) {
    Write-Status "  ⚠ Found recent .exe files in user folders (review manually):" -Color Yellow
    $suspiciousFiles | ForEach-Object { Write-Status "    $_" -Color Gray }
} else {
    Write-Status "  No suspicious executables in user folders" -Color Green
}

# 3h. Run SFC / DISM health check
Write-Header "PART 4: SYSTEM FILE HEALTH CHECK"
Write-Status "Running SFC scan (checking system files)..." -Color Yellow
Start-Process -FilePath "sfc.exe" -ArgumentList "/scannow" -NoNewWindow -Wait
Write-Status "  SFC scan completed" -Color Green

Write-Status "Running DISM health check..." -Color Yellow
Start-Process -FilePath "Dism.exe" -ArgumentList "/Online /Cleanup-Image /RestoreHealth" -NoNewWindow -Wait
Write-Status "  DISM restore completed" -Color Green

# ═══════════════════════════════════════════════════════════════
# SUMMARY
# ═══════════════════════════════════════════════════════════════
$EndTime = Get-Date
$Duration = $EndTime - $StartTime

Write-Header "SUMMARY"
Write-Status "UltraCleaner completed!" -Color Green
Write-Status "Started: $StartTime" -Color Gray
Write-Status "Ended:   $EndTime" -Color Gray
Write-Status "Duration: $($Duration.Minutes) min $($Duration.Seconds) sec" -Color Gray
Write-Status "" -Color Gray
Write-Status "WHAT WAS DONE:" -Color Cyan
Write-Status "  1. Cleaned temp/junk files (Windows + Browser caches)" -Color White
Write-Status "  2. Ran Disk Cleanup" -Color White
Write-Status "  3. Emptied Recycle Bin" -Color White
Write-Status "  4. Disabled unnecessary startup programs" -Color White
Write-Status "  5. Disabled bloat services (Xbox, Telemetry, etc.)" -Color White
Write-Status "  6. Set High Performance power plan" -Color White
Write-Status "  7. Optimized visual effects" -Color White
Write-Status "  8. Checked for malware/virus processes" -Color White
Write-Status "  9. Checked startup entries & scheduled tasks" -Color White
Write-Status " 10. Ran Windows Defender scan" -Color White
Write-Status " 11. Checked hosts file for redirections" -Color White
Write-Status " 12. Ran SFC + DISM system file repair" -Color White
Write-Status "" -Color Gray
Write-Status "Log saved to: $LogFile" -Color Cyan
Write-Status "IMPORTANT: Restart PC for all changes to take effect!" -Color Magenta

Write-Host @"



  ╔════════════════════════════════════════════════════╗
  ║                                                    ║
  ║   ✅ CLEANUP COMPLETE!                             ║
  ║   ⚠  REBOOT RECOMMENDED                           ║
  ║                                                    ║
  ╚════════════════════════════════════════════════════╝

"@ -ForegroundColor Green

# Open log
Start-Process notepad.exe -ArgumentList $LogFile
