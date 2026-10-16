FROM node:22-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund
COPY . .
RUN npm run check:runtime && npx tsc && npx vite build

FROM nginx:stable-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist/client /usr/share/nginx/html
EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]
