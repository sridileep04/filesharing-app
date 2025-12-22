Filesharing App

Sample .env file
```
PORT=3000
MONGODB_URL=""
BASE_URL=http://localhost:3000
DOWNLOAD_TOKEN_EXPIRY_MIN=30
MAX_FILE_SIZE_BYTES=104857600   # 100 * 1024 * 1024
```

Command to build docker image
```
docker build -t filesharing-app:1 .
```

Command to run the containers
```
docker compose up
```

The nginx container need certificates. To generate you need to run following command. After creating certificates the container automatically gets removed.
```
docker run --rm   -v $(pwd)/nginx/certs:/etc/letsencrypt   -v $(pwd)/nginx/html:/var/www/certbot   certbot/certbot certonly   --webroot   --webroot-path=/var/www/certbot   --agree-tos   --no-eff-email   -m hhexnode@gmail.com   -d yourdomain.com
```

The following docker commands are also usefull for making changes and debuging
```
docker images
docker ps
docker ps -a
docker rmi imagegnametodelete
docker exec -it filesharing sh
docker compose up
docker compose down
docker stop nginx filesharing
docker logs nginx
docker cp ./receiveController.js filesharing:/app/controllers/receiveController.js
docker cp ./server.js filesharing:/app/server.js
cp filesharing:/app/server.js ./server.js
docker commit filesharing filesharing-app:2
```
