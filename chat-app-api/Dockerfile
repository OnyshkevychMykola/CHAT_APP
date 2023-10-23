FROM node:16.15

# Specify Working directory inside container
WORKDIR /app/backend

# Copy package-lock.json & package.json from host to inside container working directory
COPY package*.json ./

RUN npm install
COPY . .

CMD ["npm", "run", "start:dev"]

