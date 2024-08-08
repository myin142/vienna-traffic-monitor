CONTAINER="traffic-monitor"

# Remove old container to start a new one
# docker stop $CONTAINER && docker rm $CONTAINER

# Build and run backend docker container
# docker build . --tag $CONTAINER
# docker run -d --restart unless-stopped -p 5000:5000 --name $CONTAINER $CONTAINER


# Build and copy frontend to local apache server
npm run build
sudo mkdir -p /srv/http/traffic-monitor
sudo cp -r ./build/* /srv/http/traffic-monitor