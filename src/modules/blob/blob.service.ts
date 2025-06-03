import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { join } from 'path';
import { existsSync, mkdirSync } from 'fs';
import { v4 as uuidv4 } from 'uuid';
import { Multer } from 'multer';
import fs from 'fs';

@Injectable()
export class BlobService {
  constructor(private readonly configService: ConfigService) {
    this.ensureUploadDirectoriesExist();
  }

  private ensureUploadDirectoriesExist() {
    const uploadDir =
      this.configService.get<string>('UPLOAD_DIR') || './uploads';
    const imageDir = join(uploadDir, 'images');
    const pdfDir = join(uploadDir, 'pdfs');

    [uploadDir, imageDir, pdfDir].forEach((dir) => {
      if (!existsSync(dir)) {
        mkdirSync(dir, { recursive: true });
      }
    });
  }

  private getUploadPath(type: 'image' | 'pdf'): string {
    const uploadDir =
      this.configService.get<string>('UPLOAD_DIR') || './uploads';
    return join(uploadDir, type === 'image' ? 'images' : 'pdfs');
  }

  private validateImage(file: Express.Multer.File): void {
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException(
        'Solo se permiten imágenes en formato JPG, JPEG o PNG',
      );
    }

    if (file.size > maxSize) {
      throw new BadRequestException(
        'El tamaño de la imagen no puede exceder los 5MB',
      );
    }
  }

  private validatePdf(file: Express.Multer.File): void {
    const allowedMimeTypes = ['application/pdf'];
    if (!allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException('Solo se permiten archivos PDF');
    }
  }

  uploadImage(file: Express.Multer.File): string {
    this.validateImage(file);

    try {
      const uploadPath = this.getUploadPath('image');
      const fileName = `${uuidv4()}${this.getFileExtension(file.originalname)}`;
      const filePath = join(uploadPath, fileName);

      fs.writeFileSync(filePath, file.buffer);

      return this.generatePublicUrl('images', fileName);
    } catch (error) {
      throw new InternalServerErrorException(
        'Error al guardar la imagen: ' + error.message,
      );
    }
  }

  uploadPdf(file: Express.Multer.File): string {
    this.validatePdf(file);

    try {
      const uploadPath = this.getUploadPath('pdf');
      const fileName = `${uuidv4()}${this.getFileExtension(file.originalname)}`;
      const filePath = join(uploadPath, fileName);

      fs.writeFileSync(filePath, file.buffer);

      return this.generatePublicUrl('pdfs', fileName);
    } catch (error) {
      throw new InternalServerErrorException(
        'Error al guardar el PDF: ' + error.message,
      );
    }
  }

  private getFileExtension(filename: string): string {
    return filename.substring(filename.lastIndexOf('.'));
  }

  private generatePublicUrl(folder: string, filename: string): string {
    const baseUrl =
      this.configService.get<string>('BASE_URL') || 'http://localhost:3000';
    return `${baseUrl}/public/${folder}/${filename}`;
  }
}
