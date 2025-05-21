import { Global, Logger, Module } from '@nestjs/common';
import { TypeOrmModule, getRepositoryToken, getDataSourceToken } from '@nestjs/typeorm';
import { Investment } from './entities/investment.entity';
import { InvestmentsService } from './investments.service';
import { InvestmentsController } from './investments.controller';
import { DataSource } from 'typeorm';
import { InvestmentsRepository } from './investments.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Investment])],
  controllers: [InvestmentsController],
  providers: [
    {
      provide: getRepositoryToken(Investment),
      inject: [getDataSourceToken()],
      useFactory(dataSource: DataSource) {
        return dataSource.getRepository(Investment).extend(InvestmentsRepository);
      },
    },
    InvestmentsService,
    Logger
  ],
  exports: [InvestmentsService],
})
export class InvestmentsModule {}
