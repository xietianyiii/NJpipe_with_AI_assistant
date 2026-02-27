FROM node:20 AS frontend-builder

WORKDIR /app

COPY pipedemo_nanjing_fronted ./pipedemo_nanjing_fronted
COPY pipedemo_nanjing_backend ./pipedemo_nanjing_backend

WORKDIR /app/pipedemo_nanjing_fronted

RUN npm i --registry=http://10.100.10.63 && npm run build

FROM harbor.51vr.local/51ai/uv:python3.11-bookworm
LABEL maintainer="51WORLD-DevOps"

ENV UV_HTTP_TIMEOUT=120 \
    UV_PYTHON_INSTALL_MIRROR=https://registry.npmmirror.com/-/binary/python-build-standalone \
    PIP_INDEX_URL=https://mirrors.aliyun.com/pypi/simple/ \
    PIP_TRUSTED_HOST=mirrors.aliyun.com

COPY --from=frontend-builder /app/pipedemo_nanjing_backend /opt/application

WORKDIR /opt/application

RUN uv sync
