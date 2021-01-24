import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, ValidationError, HttpStatus, HttpException } from '@nestjs/common';
import { HttpExceptionFilter } from './common/providers/http-exception.filter';
import { CustomError } from './common/models/custom-error';
import { Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder, SwaggerCustomOptions } from '@nestjs/swagger';
import { MongoExceptionFilter } from './common/providers/mongo-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = +app.get('ConfigService').get('PORT');
  const env = app.get('ConfigService').get('ENV');

  const corsOptions = {
    //Check if the origin is in the list of cors defined in the
    //env, if so let it pass otherwise return a error
    origin: function(origin, callback) {
      console.log(origin);
      const cors_origin = app.get('ConfigService').get('CORS_ORIGIN');
      if (cors_origin.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    optionsSuccessStatus: 200,
  };

  /*
  Override the base ValidatonPipe to send customError with more detailled info
  when a validation fails
  */
  app.useGlobalPipes(
    new ValidationPipe({
      exceptionFactory: (errors: ValidationError[]) => {
        let errorName = 'UndefinedParameter';
        errors.forEach(error => {
          for (const constraint in error.constraints) {
            if (constraint.includes('matches') || constraint.includes('isEnum') || constraint.includes('maxLength')) {
              errorName = 'BadParameter';
            }
          }
        });
        throw new HttpException(
          new CustomError(HttpStatus.BAD_REQUEST, errorName, 'ValidationError'),
          HttpStatus.BAD_REQUEST,
        );
      },
    }),
  );
  app.useGlobalFilters(new HttpExceptionFilter(), new MongoExceptionFilter());
  app.setGlobalPrefix('api');
  app.enableCors(corsOptions);

  if (env !== 'PROD') {
    //Swagger
    const swaggerOptions = new DocumentBuilder()
      .setTitle('Mount-Manager-Server')
      .setDescription('Server API of the MountManager application')
      .setVersion('1.0.0')
      .addServer(`http://localhost:${port}`, 'Local')
      .addBearerAuth()
      .build();
    const swaggerCustomOptions: SwaggerCustomOptions = {
      customCssUrl: `http://localhost:${port}/swaggerUICustom.css`,
      swaggerOptions: {
        defaultModelsExpandDepth: 0,
        defaultModelExpandDepth: 0,
        docExpansion: 'none',
      },
    };
    const document = SwaggerModule.createDocument(app, swaggerOptions);
    SwaggerModule.setup('api-docs', app, document, swaggerCustomOptions);
  }
  await app.listen(port);
  Logger.log(`🚀 Server running on http://localhost:${port}`, 'Bootstrap');
}
bootstrap();
