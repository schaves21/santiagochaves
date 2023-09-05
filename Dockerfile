# Definimos una imagen base
FROM node

# Creamos una carpeda donde vamos a guardar el proyecto
WORKDIR /app

# Copiar los packages de nuestra carpeta local a la carpeta de operaciones
COPY package*.json ./

# Corremos el comando para instalar dependencias
RUN npm install

# Tomamos el codigo del applicativo
COPY . .

# Habiltar un puerto que escuche nuestra computadora
EXPOSE 8080

# Una vez realizado, se debera ejecutar "npm start" para iniciar la aplicacion
CMD ["npm", "start"]