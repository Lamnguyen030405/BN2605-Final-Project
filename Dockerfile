FROM node:24-alpine AS build

WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
# RUN apk add curl
# RUN curl -SSL https://provinces.open-api.vn/api/v1/ -o ./provinces.json
COPY . .

FROM node:24-alpine AS production
WORKDIR /app
COPY --from=build /app .
EXPOSE 8080
CMD ["node", "src/app.js"]