import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import RegisterTemplate from '../templates/register.template';

@Injectable()
export default class MailService {
  constructor(
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
  ) {}

  async sendRegisterUser(email: string, name: string): Promise<void> {
    const message = new RegisterTemplate(name).getEmail();

    await this.sendEmail(email, 'Registro exitoso en Biblioteca', message);
  }

  private async sendEmail(email: string, subject: string, message: string) {
    try {
      await this.mailerService.sendMail({
        to: email,
        from: {
          name: this.configService.get<string>('SENDER_NAME')!,
          address: this.configService.get('SENDER_EMAIL')!,
        },
        subject: subject,
        html: message,
        sender: {
          name: this.configService.get('SENDER_NAME')!,
          address: this.configService.get('SENDER_EMAIL')!,
        },
      });
      return { success: true };
    } catch {
      return { success: false };
    }
  }
}
