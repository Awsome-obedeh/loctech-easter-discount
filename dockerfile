# 1. Use an official Node.js runtime as a parent image
# 'alpine' versions are much smaller and more secure
FROM node:20-alpine

# 2. Set the working directory inside the container
WORKDIR /usr/src/app

# 3. Copy package.json and package-lock.json first
# This allows Docker to cache your npm dependencies
COPY package*.json ./

# 4. Install dependencies
RUN npm install --production

# 5. Copy the rest of your app's source code
COPY . .

# 6. Expose the port your app runs on (e.g., 3000)
EXPOSE 3000

# 7. Define the command to run your app
CMD [ "node", "app.js" ]