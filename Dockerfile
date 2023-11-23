# Stage 1: Build
FROM node:14 as builder
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .


# Stage 2: Runtime
FROM node:14
WORKDIR /usr/src/app
COPY --from=builder /usr/src/app .
EXPOSE 3004
CMD ["node", "server.js"]
