# Build stage
FROM node:20-alpine AS build

WORKDIR /app

COPY package.json yarn.lock* package-lock.json* ./
RUN yarn install --frozen-lockfile || npm install

COPY . .
RUN yarn build || npm run build


# Runtime stage
FROM nginx:alpine

# Remove default nginx config
RUN rm /etc/nginx/conf.d/default.conf

# Custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy build output
COPY --from=build /app/build /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
