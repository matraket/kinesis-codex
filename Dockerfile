FROM node:20-alpine AS base

WORKDIR /app

# Instala dependencias (incluyendo dev para ejecutar TypeScript con tsx)
COPY package.json ./
RUN npm install --include=dev

# Copia el código fuente
COPY . .

ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000

CMD ["npm", "run", "start"]
