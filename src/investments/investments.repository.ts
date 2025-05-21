  // src/investments/investment.repository.ts
  import { AppDataSource } from '../config/datasource';
  import { Investment } from './entities/investment.entity';
  import { Repository } from 'typeorm';

  export const InvestmentsRepository = AppDataSource.getRepository(Investment).extend({

  });