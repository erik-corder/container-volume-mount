# Base image
FROM node:18-alpine

# Set the working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package.json yarn.lock ./
RUN yarn install

# Declare the volume
VOLUME ["/app/wwwroot/sitemaps"]

# Copy the application code
COPY . .

# Expose the Next.js default port
EXPOSE 3000

# Start the application
CMD ["yarn", "dev"]
