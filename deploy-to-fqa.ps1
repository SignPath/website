# CONFIGURATION
$SubscriptionId = $Env:SubscriptionId
$StorageAccountName = "websitefqastorage"
$ResourceGroupName = "signpath-website-fqa"
$FileShareName = "web"

$startTime = $(get-date)

# compile it to a static page (will be located at _site)
Write-Host "### Compiling website"
if (Get-Command "bundle.exe" -ErrorAction SilentlyContinue) 
{ 
    $env:JEKYLL_ENV='fqa'; bundle exec jekyll build --drafts
}
else 
{
    docker run --rm -e JEKYLL_ENV=fqa --label="jekyll-build-fqa" --volume=${PWD}:/srv/jekyll -it jekyll/jekyll jekyll build --drafts
}


# set up for azure connection
Write-Host "### Preparing Azure connection"
az account set --subscription $SubscriptionId
$storageKey = (az storage account keys list --resource-group $ResourceGroupName --account-name $StorageAccountName --query "[0].value" --output tsv)

Write-Host "### Removing current version"
Write-Host "    > Deleting all files"
az storage file delete-batch --account-key $storageKey --account-name $StorageAccountName --source $FileShareName

# Due to Azure CLI's shortcomings we need to remove each (empty) directory separately
# see https://github.com/Azure/azure-cli/issues/9141
function DeleteDirectories($path) {
    $dirs = (az storage directory list --account-key $storageKey --account-name $StorageAccountName --share-name $FileShareName --name $path | ConvertFrom-Json)
    if (!$dirs.Count -eq 0) {
        ForEach ($dir in $dirs) {
            $name = $dir.name
            DeleteDirectories("${path}/${name}")       
        }
    }
    if (!$path.equals(".")) {
        Write-Host "     > Deleting directory ${path}"
        az storage directory delete --account-key $storageKey --account-name $StorageAccountName --share-name $FileShareName --name $path
    }
}
DeleteDirectories(".")


Write-Host "### Uploading new version"
az storage file upload-batch --account-key $storageKey --source ".\_site" --account-name $StorageAccountName --destination $FileShareName

$currentTime = $(get-date)
$totalTime = $currentTime - $startTime
$seconds = $totalTime.TotalSeconds

$env:JEKYLL_ENV='development'
Write-Host "### Done in ${seconds} seconds"