# Build Stage
FROM golang:1.22-alpine AS builder

WORKDIR /app

# Copy dependency files
COPY go.mod go.sum ./
RUN go mod download

# Copy source code
COPY . .

# Build the application
# CGO_ENABLED=1 is needed for SQLite if we use it, but for Postgres it's optional usually.
# However, if we support SQLite fallback, we need build-base for CGO.
RUN apk add --no-cache build-base
RUN CGO_ENABLED=1 GOOS=linux go build -o main .

# Run Stage
FROM alpine:latest

WORKDIR /root/

# Install CA certificates for HTTPS connections
RUN apk --no-cache add ca-certificates

# Copy binary from builder
COPY --from=builder /app/main .

EXPOSE 8080

CMD ["./main"]
