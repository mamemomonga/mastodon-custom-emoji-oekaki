FROM node:8.8-alpine

# timezone=Asia/Tokyo(Alpine)
RUN set -xe && apk --update add tzdata && \
    cp /usr/share/zoneinfo/Asia/Tokyo /etc/localtime && \
    apk del tzdata && rm -rf /var/cache/apk/*

RUN set -xe && \
	node -e "console.log(global.module.paths)" && \
	npm install -g ejs clean-css

ADD assets /

CMD ["/app.sh"]

