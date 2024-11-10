# Используем Node.js как базовый образ
FROM node:18

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем файлы проекта
COPY package*.json ./
RUN npm install
COPY . .

# Указываем порт для сервера
EXPOSE 4444

# Запускаем сервер
CMD ["npm", "start"]
