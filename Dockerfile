# Use an official Node.js runtime as a base image
FROM node:20

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY . .

# Install dependencies
RUN npm install

# Expose the port your app will run on
EXPOSE 5000

# Command to run your application
CMD ["node", "src/index.js"]
