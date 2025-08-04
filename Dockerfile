# --- Base stage: install dependencies ---
# Use the 'slim' variant for better compatibility, especially on Apple Silicon
FROM node:23-slim AS deps

WORKDIR /app

# Copy package files first to leverage Docker layer caching
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci

# --- Builder stage: build the application ---
FROM node:23-slim AS builder

WORKDIR /app

# Copy dependencies
COPY --from=deps /app/node_modules ./node_modules
COPY . .


# OPTIONAL: reduce memory usage during build
ENV NODE_OPTIONS=--max_old_space_size=4086


# Build the application
RUN npm run build

# --- Final stage: production runtime ---
# Use the 'slim' variant here as well for consistency
FROM node:23-slim AS runner

WORKDIR /app

ENV NODE_ENV=production
# Copy only necessary files for a standalone Next.js server
COPY --from=builder /app/public ./public
# The standalone output is the recommended approach for production
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/package.json ./package.json

EXPOSE 3000

# The standalone output uses a minimal server.js file
CMD ["node", "server.js"]
