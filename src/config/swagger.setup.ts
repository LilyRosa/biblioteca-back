import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export default function setupSwagger(
  app: INestApplication,
  swaggerPath: string,
) {
  const options = new DocumentBuilder()
    .setTitle('Api Library')
    .setDescription('### API of a library app.')
    .setLicense('MIT', 'https://opensource.org/license/mit')
    .setVersion('1.0.0')
    .addBearerAuth()
    .build();

  const doc = SwaggerModule.createDocument(app, options);

  const paths = Object.keys(doc.paths).sort();
  const sortedPaths = {};
  paths.forEach((path) => {
    sortedPaths[path] = doc.paths[path];
  });
  doc.paths = sortedPaths;

  const schemas = Object.keys(doc.components!.schemas!).sort();
  const sortedSchemas = {};
  schemas.forEach((schema) => {
    sortedSchemas[schema] = doc.components!.schemas![schema];
  });
  doc.components!.schemas = sortedSchemas;

  SwaggerModule.setup(swaggerPath, app, doc);
}
