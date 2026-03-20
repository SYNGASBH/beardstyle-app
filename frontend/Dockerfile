# Stage 1: Build React aplikaciju
FROM node:18-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm ci --silent

COPY . .
RUN npm run build

# Stage 2: Nginx servira statičke fajlove
FROM nginx:alpine

# Ukloni default nginx config
RUN rm /etc/nginx/conf.d/default.conf

# Kopiraj naš nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Kopiraj build output
COPY --from=build /app/build /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
