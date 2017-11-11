FROM node:8.9.1-alpine

# timezone=Asia/Tokyo(Alpine)
RUN set -xe && apk --update add tzdata && \
    cp /usr/share/zoneinfo/Asia/Tokyo /etc/localtime && \
    apk del tzdata && rm -rf /var/cache/apk/*

ENV NODE_PATH=/usr/local/lib/node_modules

