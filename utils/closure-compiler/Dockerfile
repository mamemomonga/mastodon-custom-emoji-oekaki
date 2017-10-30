FROM debian:jessie-backports

# timezone=Asia/Tokyo(Debian)
RUN set -xe && \
	rm /etc/localtime && \
	ln -s /usr/share/zoneinfo/Asia/Tokyo /etc/localtime && \
	echo 'Asia/Tokyo' > /etc/timezone

RUN set -xe && \
	apt-get update -y && \
	apt-get install -y -t jessie-backports \
		openjdk-8-jre-headless \
		ca-certificates-java \
		curl \
		unzip && \
	curl https://dl.google.com/closure-compiler/compiler-latest.zip >> /tmp/cc.zip && \
	unzip -d /tmp /tmp/cc.zip c*.jar && \
    cp /tmp/c*.jar /opt/closure-compiler.jar && rm /tmp/c*.jar /tmp/cc.zip && \
	apt-get purge -y --auto-remove curl unzip && \
	rm -rf /var/lib/apt/lists/*

ADD app.sh /
CMD ["/app.sh"]
