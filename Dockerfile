# Use Node.js Alpine version as the base image
FROM node:alpine

# Set working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json (or npm-shrinkwrap.json) to the working directory
COPY package*.json ./

# Install Node.js dependencies
RUN npm install --production

# Copy Prisma schema and directory
COPY ./prisma ./prisma



RUN npm install -g @nestjs/cli 
RUN npx prisma generate


COPY . .

# Build the application (assuming it's necessary, adjust as per your project)
RUN npm run build

# Expose port 8080 for the application
EXPOSE 8080

# Define command to run the application
CMD ["npm", "run","start:docker"]
