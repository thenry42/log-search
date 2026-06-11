# log-search

## Installation

```bash
git clone https://github.com/thenry42/log-search.git
cd log-search
```

## Configuration

```bash
cp .env.example .env
```

Edit the `.env` file with your own values.

## Usage

The Makefile provides a set of commands to help you manage the project (because docker compose is way too verbose for my taste):

```bash
make help
```

To build the project, run:

```bash
make build
```

To start the project, run:

```bash
make start
```

The frontend will be available at `http://localhost:XXXX` and the backend at `http://localhost:XXXX`.