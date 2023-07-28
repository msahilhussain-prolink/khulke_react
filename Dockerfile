FROM node:16.16.0-slim as builder

# set the working dir for container
WORKDIR /usr/src

COPY ./build /usr/src/build
COPY ./express-server /usr/src/express-server
COPY ./server.conf /usr/src/

RUN apt-get update && apt-get -y install nginx dos2unix && dos2unix /usr/src/express-server/runserver.sh && apt-get clean autoclean && apt-get autoremove --yes && rm -rf /var/lib/{apt,dpkg,cache,log}/ && rm -rf /var/lib/{apt,dpkg,cache,log}/

EXPOSE 80:80
# #copying express server folder and previously genrated build folder and putting them into one commong folder
RUN cd /usr/src/express-server && npm install

RUN apt-get update && apt-get -y install bash

CMD ["bash", "/usr/src/express-server/runserver.sh"]