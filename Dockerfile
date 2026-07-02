# Сборка и запуск прототипа: фронт (Vite) + мини-сервер (Express) в одном образе.
# На Railway: Root Directory = prototype, том примонтирован в /data (DATA_DIR=/data),
# пароль и порт задаются переменными окружения (APP_PASSWORD, PORT — Railway сам).
FROM node:20-alpine
WORKDIR /app

# Зависимости отдельным слоем — кешируется, пока не менялся package-lock.
COPY package.json package-lock.json ./
RUN npm ci

# Исходники и сборка фронта. BASE_PATH=/ — ассеты грузятся от корня домена
# (в отличие от GitHub Pages, где base — подкаталог).
COPY . .
ENV BASE_PATH=/
RUN npm run build

ENV NODE_ENV=production
# Сервер слушает process.env.PORT (его задаёт Railway) и отдаёт dist + /api.
CMD ["node", "server/index.js"]
