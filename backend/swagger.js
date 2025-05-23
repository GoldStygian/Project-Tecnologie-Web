import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUI from 'swagger-ui-express';

swaggerUI.defaults = {
  // eventuali default per swaggerUI, se ti servono
};

const options = {
  definition: {
    openapi: '3.1.0',
    info: {
      title: 'STREETCATS API',
      version: '1.0.0',
      description: 'API per la condivisione avvistamenti di gatti randagi'
    },
  },
  apis: ['./routes/*.js']
};

const swaggerSpec = swaggerJSDoc(options);

export function serve() {
  return swaggerUI.serve;
}

export function setup() {
  return swaggerUI.setup(swaggerSpec);
}