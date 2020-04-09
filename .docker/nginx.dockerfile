FROM nginx:latest

LABEL maintainer="xlrj0716@gmail.com"

COPY ./.docker/nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
