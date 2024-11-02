# FROM nginx
# COPY ./dist /usr/share/nginx/html
# 使用Alpine Linux 作为基础镜像
FROM alpine:latest

# 复制文件到容器中的 /app 目录
COPY dist /app
# 保持容器运行的命令
CMD ["tail", "-f", "/dev/null"]