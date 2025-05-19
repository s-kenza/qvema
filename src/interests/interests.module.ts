import { Global, Logger, Module } from '@nestjs/common';
import { TypeOrmModule, getRepositoryToken, getDataSourceToken } from '@nestjs/typeorm';
import { Interest } from './entities/interest.entity';
import { InterestsService } from './interests.service';
import { InterestsController } from './interests.controller';
import { DataSource } from 'typeorm';
import { InterestsRepository } from './interests.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Interest])],
  controllers: [InterestsController],
  providers: [
    {
      provide: getRepositoryToken(Interest),
      inject: [getDataSourceToken()],
      useFactory(dataSource: DataSource) {
        return dataSource.getRepository(Interest).extend(InterestsRepository);
      },
    },
    InterestsService,
    Logger
  ],
  exports: [InterestsService],
})
export class InterestsModule {}
