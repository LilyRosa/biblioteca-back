import { INestApplication, ValidationPipe } from '@nestjs/common';
import helmet from 'helmet'; // Importación por defecto
import { json, urlencoded } from 'express';

export default function initSetup(app: INestApplication) {
  app.enableCors();
  app.enableShutdownHooks();
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      enableDebugMessages: true,
    }),
  );
  app.use(helmet()); // Ahora funciona sin error
  app.use(json({ limit: '50mb' }));
  app.use(urlencoded({ extended: true, limit: '50mb' }));
}
