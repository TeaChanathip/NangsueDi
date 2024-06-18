import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.enableCors();

    const config = new DocumentBuilder()
        .setTitle('Library Management System')
        .setDescription('A backend API utilized MongoDB to manage the library')
        .setVersion('1.0')
        .addBearerAuth()
        .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);

    await app.listen(process.env.PORT);
    console.log(`Service start on http://localhost:${process.env.PORT}`);
}
bootstrap();
