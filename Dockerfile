# Multi-stage build for production
FROM node:20-alpine AS frontend-builder

# Install pnpm
RUN npm install -g pnpm

# Set working directory
WORKDIR /app/frontend

# Copy frontend package files
COPY packages/frontend/package.json packages/frontend/pnpm-lock.yaml* ./

# Install dependencies
RUN pnpm install

# Copy frontend source
COPY packages/frontend/ ./

# Build frontend
RUN pnpm build

# Go backend stage
FROM golang:1.25-alpine AS backend-builder

# Set working directory
WORKDIR /app

# Copy go mod files
COPY packages/backend/go.mod packages/backend/go.sum ./

# Download dependencies
RUN go mod download

# Copy backend source
COPY packages/backend/ ./

# Build backend
RUN CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -o main .

# Final stage
FROM alpine:latest

# Install ca-certificates for HTTPS
RUN apk --no-cache add ca-certificates

# Create app directory
WORKDIR /root/

# Copy built backend
COPY --from=backend-builder /app/main .

# Copy built frontend
COPY --from=frontend-builder /app/frontend/dist ./dist

# Expose port
EXPOSE 8080

# Run backend
CMD ["./main"]
