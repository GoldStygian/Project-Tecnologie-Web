import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUI from 'swagger-ui-express';

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Cat API',
    version: '1.0.0',
    description: 'API per StreetCats',
  },
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
  },
};

const options = {
  swaggerDefinition,
  apis: ['./routes/*.js'], // Percorso ai file con commenti JSDoc
};

const swaggerSpec = swaggerJSDoc(options);

export function serve() {
  return swaggerUI.serve;
}

export function setup() {
  return swaggerUI.setup(swaggerSpec);
}