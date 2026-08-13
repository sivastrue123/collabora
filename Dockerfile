FROM node:20-bookworm-slim
RUN apt-get update && apt-get install -y \
    libreoffice-core libreoffice-draw libreoffice-writer \
    fonts-dejavu fonts-liberation \
    && rm -rf /var/lib/apt/lists/*
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci --omit=dev
COPY . .
CMD ["node", "server.js"]
