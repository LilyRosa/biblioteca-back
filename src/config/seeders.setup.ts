import { INestApplication } from '@nestjs/common';
import AdminSeederService from 'src/modules/user/admin-seeder.service';

export default async function setupSeeders(app: INestApplication) {
  const userSeederService = app.get(AdminSeederService);
  await userSeederService.createAdminUser();
}
