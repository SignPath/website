# CONFIGURATION
$SubscriptionId = $Env:SubscriptionId
$StorageAccountName = "websitefqastorage"
$ResourceGroupName = "signpath-website-fqa"
$BlobName = '$web'

# compile it to a static page (will be located at _site)
Write-Host "### Compiling website"
$env:JEKYLL_ENV='fqa'; bundle exec jekyll build --drafts

# set up for azure connection
Write-Host "### Preparing Azure connection"
az account set --subscription $SubscriptionId
$storageKey = (az storage account keys list --resource-group $ResourceGroupName --account-name $StorageAccountName --query "[0].value" --output tsv)

Write-Host "### Removing current version"
az storage blob delete-batch --account-key $storageKey --account-name $StorageAccountName --source $BlobName

Write-Host "### Uploading new version"
az storage blob upload-batch --source ".\_site" --account-key $storageKey --account-name $StorageAccountName --destination $BlobName

$env:JEKYLL_ENV='development'
Write-Host "### Done"