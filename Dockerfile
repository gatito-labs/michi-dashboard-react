# pull official base image
FROM node:16.14.0-alpine


# set working directory
WORKDIR /app

# add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH

# install app dependencies
COPY package.json ./
COPY package-lock.json ./
RUN npm install 
RUN npm install react-scripts -g 

# add app
COPY . ./

RUN chown -R node /app/node_modules
USER node

# start app
CMD ["npm", "start"]
