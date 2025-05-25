  // src/investments/investment.repository.ts
  import { AppDataSource } from '../config/datasource';
  import { Investment } from './entities/investment.entity';
  import { Repository } from 'typeorm';

  export const InvestmentsRepository = AppDataSource.getRepository(Investment).extend({
    createInvestment: async function (investmentData, userId) {
      const investment = this.create({
        ...investmentData,
        investor: { uuid: userId },
      });
      return await this.save(investment);
    }
  });