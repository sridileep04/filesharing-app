Filesharing App

Sample .env file
```
PORT=3000
MONGODB_URL=""
BASE_URL=https://localhost:3000
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

```

docker --debug build -t filesharing-app:3 .

docker build --progress=plain -t filesharing-app:3 .
docker build --progress=plain -t filesharing-app . 2>&1 | tee build.log

# Replace 'abc123id' with the ID of the step before the error
docker run -it --rm abc123id /bin/sh

COPY . .
RUN ls -R  # This will print every file Docker has copied during the build logs

docker history filesharing-app:3

docker inspect filesharing-app:3


# Replace 'my-filesharing-app' with your actual container name or ID
docker exec my-filesharing-app printenv

docker run -d   --name filesharing-app-v3   -p 80:80   -p 443:443   --env-file .env   -v $(pwd)/nginx/certs:/etc/nginx/certs:ro   -v $(pwd)/nginx/html:/var/www/certbot:ro   --restart always   filesharing-app:3
```
 
