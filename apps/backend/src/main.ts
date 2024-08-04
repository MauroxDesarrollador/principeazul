import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as dotenv from 'dotenv';

async function bootstrap() {
  dotenv.config();//cargar .env
  const modeSystem = process.env.MODE || "DEV";

  const app = await NestFactory.create(AppModule);
  // Set the base API route
  app.setGlobalPrefix('api');
  
  if(modeSystem=="DEV"){
    const config = new DocumentBuilder()
    .setTitle('InventarioApi')
    .setDescription('The cats API description')
    .setVersion('1.0')
    .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);
  }
  const port = process.env.PORT || 3000;
  await app.listen(port);
}
bootstrap();
