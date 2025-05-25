import { Module, Logger } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ProjectsModule } from './projects/projects.module';
import { typeOrmConfig } from './config/typeorm.config';
import { InterestsModule } from './interests/interests.module';
import { InvestmentsModule } from './investments/investments.module';
import { AdminModule } from './roles/admin.module';

@Module({
  imports: [
    ConfigModule.forRoot(), // Charge les variables d'env depuis .env
    TypeOrmModule.forRoot(
     typeOrmConfig),
    UsersModule,
    AuthModule,
    ProjectsModule,
    InterestsModule,
    InvestmentsModule,
    AdminModule,
  ],
  providers: [Logger],
})
export class AppModule {}
