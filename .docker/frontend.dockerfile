FROM        nginx:latest
MAINTAINER  Aldo Fregoso

#
# Install scripts
#
COPY        .docker/scripts /tmp/scripts
RUN         chmod +rx /tmp/scripts/*.sh

#
# Install prerequisites
#
ENV         DEBIAN_FRONTEND=noninteractive
RUN         ["/tmp/scripts/nginx-latest-image-prerequisites.sh"]

#
# Install yarn
#
RUN         ["/tmp/scripts/yarn-install.sh"]

#
# Install LTS node using `n`
#
RUN         ["/tmp/scripts/node-lts-install.sh"]

#
# Build project
#
COPY        frontend /tmp/frontend/
WORKDIR     /tmp/frontend/
RUN         ["yarn"]
RUN         ["yarn", "build"]

#
# Copy build folder to `www`
#
RUN         ["rm", "-r", "/usr/share/nginx/html"]
RUN         ["mv", "-v", "/tmp/frontend/build", "/usr/share/nginx/html"]

#
# Cleanup
#
RUN         ["rm", "-r", "/tmp/scripts", "/tmp/frontend/"]

#
# Run nginx
#
WORKDIR     /var/www
VOLUME      /var/cache/nginx
EXPOSE      80 443
ENTRYPOINT  ["nginx"]
CMD         ["-g", "daemon off;"]
