# Stage 1 - Build React App
FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

# Build Argument
ARG VITE_API_URL

# Create .env.production for Vite
RUN echo "VITE_API_URL=${VITE_API_URL}" > .env.production

# Verify
RUN cat .env.production

# Build React App
RUN npm run build

# Stage 2 - Nginx
FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]