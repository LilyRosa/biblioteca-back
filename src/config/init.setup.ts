import { INestApplication, ValidationPipe } from '@nestjs/common';
import helmet from 'helmet'; // Importación por defecto
import { json, urlencoded } from 'express';

export default function initSetup(app: INestApplication) {
  app.enableCors({
    origin: '*', // Permite todos los orígenes (no recomendado para producción)
    // origin: true, // Alternativa que respeta el encabezado 'Origin' de la solicitud
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: '*', // Permite todos los encabezados
    exposedHeaders: '*', // Expone todos los encabezados
    credentials: false, // Desactiva credenciales si usas origin: '*'
    preflightContinue: false,
    optionsSuccessStatus: 204,
    maxAge: 86400,
  });
  app.enableShutdownHooks();
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      enableDebugMessages: true,
    }),
  );
  app.use(
    helmet({
      crossOriginResourcePolicy: false, // Desactiva la política CORP de helmet
    }),
  );
  app.use((req, res, next) => {
    res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
    // Opciones: 'same-site' | 'same-origin' | 'cross-origin'
    next();
  });
  app.use(json({ limit: '50mb' }));
  app.use(urlencoded({ extended: true, limit: '50mb' }));
}
