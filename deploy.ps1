$remoteUser = "rb"
$remoteHost = "192.168.0.6"
$remoteDir = "kassapwa"
$remote = "$remoteUser@$remoteHost"
$tempDeploy = "tempDeploy"

Write-Host "Building Angular app..."
npm install
npm run build
Pop-Location

Write-Host "Preparing deployment package..."
Remove-Item -Recurse -Force $tempDeploy -ErrorAction SilentlyContinue
New-Item -ItemType Directory -Force -Path "$tempDeploy/KassaPWA"

Copy-Item -Path "docker-compose.yml" -Destination "$tempDeploy\docker-compose.yml"

Copy-Item -Path "Dockerfile" -Destination "$tempDeploy\Dockerfile"
Copy-Item -Recurse -Path "dist" -Destination "$tempDeploy\dist"
Copy-Item -Path "nginx.conf" -Destination "$tempDeploy\"
Copy-Item -Recurse -Path "certs" -Destination "$tempDeploy/certs"

Write-Host "Cleaning remote Raspberry Pi..."
ssh $remote @"
cd $remoteDir &&
docker compose down &&
rm -rf ./*
"@

Write-Host "Uploading files to Raspberry Pi..."
scp -r "$tempDeploy\*" "${remote}:$remoteDir"

Write-Host "Starting containers on Raspberry Pi..."
ssh $remote @"
cd $remoteDir &&
docker compose up -d --build &&
docker exec kassapwa-angular chmod -R 755 /usr/share/nginx/html &&
docker exec kassapwa-angular chown -R nginx:nginx /usr/share/nginx/html
"@

Write-Host "Cleaning local temp files..."
Remove-Item -Recurse -Force $tempDeploy

Write-Host "Done! The app should be running on http://$remoteHost"
