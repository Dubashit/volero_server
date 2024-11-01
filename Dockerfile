# Используем Node.js образ для запуска сервера
FROM node:18

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем package.json и package-lock.json для установки зависимостей
COPY package*.json ./

# Устанавливаем зависимости
RUN npm install

# Копируем весь проект в контейнер
COPY . .

# Порт, на котором работает сервер
EXPOSE 5000

# Запуск сервера
CMD ["node", "index.js"]
