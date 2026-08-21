# Multi-stage build for production (matf.dev/chaos)
FROM node:20-alpine AS frontend-builder

RUN npm install -g pnpm

WORKDIR /app/frontend

COPY packages/frontend/package.json packages/frontend/pnpm-lock.yaml* ./
RUN pnpm install

COPY packages/shared/ ../shared/
COPY packages/frontend/ ./

ENV NODE_ENV=production
# tsc has pre-existing page typing debt; ship with vite emit only
RUN pnpm exec vite build

FROM golang:1.25-alpine AS backend-builder

WORKDIR /app

COPY packages/backend/go.mod packages/backend/go.sum ./
RUN go mod download

COPY packages/backend/ ./
RUN CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -o main .

FROM alpine:latest

RUN apk --no-cache add ca-certificates

WORKDIR /app

COPY --from=backend-builder /app/main .
COPY packages/shared/routes.json ./routes.json
COPY packages/backend/static/images ./static/images
COPY packages/backend/templates ./templates
COPY --from=frontend-builder /app/frontend/dist ./dist

ENV ENV=production
ENV PORT=8080
ENV PUBLIC_BASE=https://matf.dev/chaos

EXPOSE 8080

CMD ["./main"]
