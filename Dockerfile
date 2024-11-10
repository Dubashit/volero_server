# Используем Node.js как базовый образ
FROM node:16-alpine

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем файлы проекта
COPY package*.json ./
RUN npm install
COPY . .

# Указываем порт для сервера
EXPOSE 3000

# Запускаем сервер
CMD ["npm", "start"]
