FROM openresty/openresty:latest-jessie
ADD ./compose/prod/redirect/nginx.conf /usr/local/openresty/nginx/conf/nginx.conf

ENTRYPOINT ["/usr/local/openresty/bin/openresty", "-g", "daemon off;"]
