FROM node:10

COPY ./package*.json /server/

COPY ./docker/entrypoint.sh /entrypoint/

RUN ["chmod", "+x", "entrypoint/entrypoint.sh"]

WORKDIR /server/
# Copy or mount node app here
COPY . /server
EXPOSE 3000

RUN apt-get update && apt-get install -y lsof

ENTRYPOINT ["/entrypoint/entrypoint.sh"]

CMD ["npm", "start"]

