FROM alpine:latest
RUN apk update 
RUN apk add bash \
	git \
	openssh \
	python3 \
	python3-dev \
	gcc \
	build-base \
	linux-headers \
	pcre-dev \
	postgresql-dev \
	musl-dev \
	libxml2-dev \
	libxslt-dev \
	nginx \
	curl \
	supervisor && \
	python3 -m ensurepip && \
    rm -r /usr/lib/python*/ensurepip && \
    pip3 install --upgrade pip setuptools && \
    rm -r /root/.cache && \
    pip3 install --upgrade pip setuptools && \
    rm -r /root/.cache && \
pip3 install uwsgi && \
mkdir -p /run/nginx
COPY requirements.txt  /home/app/
RUN pip3 install -r /home/app/requirements.txt
# COPY nginx.conf /etc/nginx/nginx.conf
COPY nginx.default /etc/nginx/conf.d/default.conf
COPY supervisor.conf /etc/supervisor/conf.d/
COPY spotme_app  /home/app/spotme_app/
COPY spotify-visualized-project  /home/app/spotify-visualized-project/
COPY supervisor.conf uwsgi_params uwsgi.ini  /home/app/

WORKDIR /home/app/
EXPOSE 8080
CMD ["supervisord", "-n", "-c", "/home/app/supervisor.conf"]
