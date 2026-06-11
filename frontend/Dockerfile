FROM node:22-alpine

WORKDIR /app

ARG FRONTEND_PORT
ENV FRONTEND_PORT=${FRONTEND_PORT}

COPY package*.json ./
RUN npm install
RUN npm audit fix

COPY . .

EXPOSE ${FRONTEND_PORT}

CMD ["sh", "-c", "npm run dev -- --host 0.0.0.0 --port ${FRONTEND_PORT}"]
