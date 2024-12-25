# Build stage
FROM node:18-alpine AS build
WORKDIR /src
COPY package*.json ./
RUN npm install
COPY . .
COPY --from=config config.ts src/app/config.ts
RUN npm run build

# Production stage
FROM nginx:stable-alpine AS production
COPY --from=build /src/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]