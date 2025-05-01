$ErrorActionPreference = "Stop"
$baseBranch = (git symbolic-ref head).split("/")[-1] # current branch ref

function throwIfSaysError {
    param(
        [Parameter(Mandatory = $true)]
        [string]$command,
        [Parameter(Mandatory = $false, ValueFromRemainingArguments = $true)]
        [string[]]$args
    )
    $out = &$command $args 2>&1;
    if ($out -match "error") {
        throw "$command failed:`n $out"
    }
    if ($LASTEXITCODE -ne 0) {
        throw "Command failed with exit code $($LASTEXITCODE): $command`n$out"
    }
    Write-Host $out;
}

git switch dev

Write-Verbose "Temporarily renaming node_modules before packing"
copy-item -Path ./node_modules -Destination ./~node_modules -Recurse -Force -ErrorAction SilentlyContinue

npm pack

$packageName = (npm pkg get name).trim('"');
$packageVersion = (npm pkg get version).trim('"');
$tarballBasename = "$packageName-$packageVersion.tgz"

Write-Debug "RepoName: $packageName"
Write-Debug "tarballBasename: $tarballBasename"

git switch $baseBranch

tar -x -f $tarballBasename

Get-ChildItem ./package | ForEach-Object {if ((Test-Path "./$($_.Name)")){rmrf $_.Name} Move-Item -Force -Path $_.FullName -Destination "./$($_.Name)"}

remove-item -Force -Recurse ./package
remove-item ./$tarballBasename

$answer = Read-Host "Do you want to commit the changes? (y/n)"
if ($answer -eq "y") {
    git add .
    git commit -m "Update $packageName to version $packageVersion"
    
    $versionArray = $packageVersion.Split('.');
    git tag -f "v$($versionArray[0])"
    git tag -f "v$($versionArray[0]).$($versionArray[1])"
    git tag -f "v$($versionArray[0]).$($versionArray[1]).$($versionArray[2])"

    git push
    git push --tags -f
} else {
    Write-Host "Skipping commit"
}

Write-Verbose "Restoring node_modules after packing"
move-item -Force -Path ./~node_modules -Destination ./node_modules -ErrorAction SilentlyContinue