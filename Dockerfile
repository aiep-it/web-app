# --- Base stage: install dependencies ---
FROM node:23-alpine AS deps

WORKDIR /app

COPY package.json ./
COPY tsconfig.json ./
COPY apps ./apps
COPY libs ./libs
RUN npm install --frozen-lockfile

# Install production dependencies and build the application
RUN npm run build

# --- Final stage: production-only runtime ---
FROM node:23-alpine AS runner

WORKDIR /app

# Copy only what's needed for production runtime
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

EXPOSE 3000
CMD ["yarn", "start"]

