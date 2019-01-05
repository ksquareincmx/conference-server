FROM        node:8
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
RUN         ["/tmp/scripts/node-8-image-prerequisites.sh"]

#
# Install gulp
#
RUN         ["/tmp/scripts/gulp-install.sh"]

#
# Install project
#
COPY        . /var/www/
WORKDIR     /var/www/
RUN         ["npm", "install"]
RUN         ["gulp", "production"]

#
# Cleanup
#
RUN         ["mv", "/tmp/scripts/backend-entrypoint.sh", "/var/www"]
RUN         ["rm", "-r", "/tmp/scripts"]

#
# Run project
#
EXPOSE      8888
ENTRYPOINT  ["./backend-entrypoint.sh"]
