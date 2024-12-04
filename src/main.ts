import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);


  app.enableCors({
    origin: '*', // Cho phép mọi nguồn
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Các phương thức HTTP được cho phép
    allowedHeaders: '*', // Cho phép mọi header
  });
  
  await app.listen(process.env.APP_PORT ?? 3000);
}
bootstrap();
