FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

# Install dependencies (including devDependencies for building)
RUN npm install

COPY . .
# Generate Prisma client
RUN npx prisma generate

# Build the TypeScript application
RUN npm run build

# Expose the port the app runs on
EXPOSE 5001

# Push schema to DB, generate data, and start app
CMD ["sh", "-c", "npx prisma db push && npm run generar-datos && npm start"]
