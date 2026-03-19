# Stage 1: Build the application
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

COPY . .

# Stage 2: Create the production image
FROM node:20-alpine

WORKDIR /app

# Create a non-root user
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Copy dependencies and application code from the builder stage
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/src ./src
COPY --from=builder /app/package.json ./

# Set ownership and permissions
RUN chown -R appuser:appgroup /app
USER appuser

ENV NODE_ENV=production
EXPOSE 3000

CMD ["npm", "start"]
