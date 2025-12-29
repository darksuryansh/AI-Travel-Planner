FROM node:20-alpine

# Set working directory inside the container
WORKDIR /app

# copy all .json files
COPY package*.json ./

RUN npm install

# Copy all files from current directory to working directory inside the container
COPY . .

#for backend
# EXPOSE 5000


# start backend 

CMD [ "npm", "run"  ,"dev" ]


# for huggingface
ENV PORT=7860
EXPOSE 7860