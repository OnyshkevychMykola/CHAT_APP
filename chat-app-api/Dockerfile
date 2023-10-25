FROM node:16.15

# Specify Working directory inside container
WORKDIR /app/backend

# Copy package-lock.json & package.json from host to inside container working directory
COPY package*.json ./
COPY tsconfig.build.json ./
COPY tsconfig.json ./

RUN npm install

RUN npm run build

CMD [ "node", "dist/main"]


