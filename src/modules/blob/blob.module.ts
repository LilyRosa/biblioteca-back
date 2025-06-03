import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { BlobService } from './blob.service';

@Module({
  imports: [
    ConfigModule,
    MulterModule.registerAsync({
      useFactory: (configService: ConfigService) => ({
        dest: configService.get<string>('UPLOAD_DIR') || './uploads',
      }),
      inject: [ConfigService],
    }),
    ServeStaticModule.forRootAsync({
      useFactory: (configService: ConfigService) => [
        {
          rootPath: join(
            process.cwd(),
            configService.get<string>('UPLOAD_DIR') || './uploads',
          ),
          serveRoot: '/public',
        },
      ],
      inject: [ConfigService],
    }),
  ],
  providers: [BlobService],
  exports: [BlobService],
})
export class BlobModule {}
