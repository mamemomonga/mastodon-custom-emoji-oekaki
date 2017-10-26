FROM node:8.8-alpine

# timezone=Asia/Tokyo(Alpine)
RUN set -xe && apk --update add tzdata && \
    cp /usr/share/zoneinfo/Asia/Tokyo /etc/localtime && \
    apk del tzdata && rm -rf /var/cache/apk/*

ENV NODE_PATH=/usr/local/lib/node_modules
RUN set -xe && \
	npm install -g ejs clean-css

ADD app.js /

CMD ["node","/app.js"]

