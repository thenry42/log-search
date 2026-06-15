FROM node:22-slim

WORKDIR /app

ARG FRONTEND_PORT
ENV FRONTEND_PORT=${FRONTEND_PORT}

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE ${FRONTEND_PORT}

CMD ["sh", "-c", "npm install && npm run dev -- --host 0.0.0.0 --port ${FRONTEND_PORT}"]
