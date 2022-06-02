FROM nginx:1.21.6-alpine
COPY ./dist /usr/share/nginx/html
RUN sed -i 's/dl-cdn.alpinelinux.org/mirrors.aliyun.com/g' /etc/apk/repositories && \
    echo 'http://dl-cdn.alpinelinux.org/alpine/v3.6/community' >>/etc/apk/repositories && \
    apk add --no-cache ca-certificates && update-ca-certificates