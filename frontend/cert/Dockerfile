# i want to make some certificates for localhost
# so i can use https://localhost:3000

FROM node:12.16.1-alpine

RUN apk add --no-cache openssl

RUN mkdir -p /cert
RUN mkdir -p /test

WORKDIR /

# save to columne
VOLUME /

RUN openssl req -x509 -newkey rsa:4096 -keyout key.pem -out cert.pem -days 365 -nodes -subj '/CN=localhost'

# where to save the cert
RUN cp cert.pem /cert/cert.pem