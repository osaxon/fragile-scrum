# Build frontend
FROM oven/bun AS builder-bun
WORKDIR /app

COPY . .
RUN bun install --frozen-lockfile

ARG DOMAIN_NAME
ARG PLAUSIBLE_API_HOST
RUN echo "VITE_DOMAIN=${DOMAIN_NAME}\nVITE_PLAUSIBLE_API_HOST=${PLAUSIBLE_API_HOST}" > .env

RUN bun run build:client

# Build backend
FROM golang:1.23-alpine AS builder-go
WORKDIR /app

COPY --from=builder-bun /app/backend .
RUN go mod download
RUN go build -tags production -o fragile-scrum

# Deploy binary
FROM alpine:latest AS runner
WORKDIR /app

COPY --from=builder-go /app/fragile-scrum .
RUN chmod +x /app/fragile-scrum

EXPOSE 8090

CMD ["/app/fragile-scrum", "serve", "--http=0.0.0.0:8090"]