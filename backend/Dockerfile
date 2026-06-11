FROM python:3.12-slim

WORKDIR /app

ARG BACKEND_PORT
ENV BACKEND_PORT=${BACKEND_PORT}

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE ${BACKEND_PORT}

CMD ["sh", "-c", "uvicorn app.main:app --host 0.0.0.0 --port ${BACKEND_PORT} --reload"]
