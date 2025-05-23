import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InvestmentsRepository } from './investments.repository';
import { Investment } from './entities/investment.entity';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class InvestmentsService {
  constructor(
    @InjectRepository(Investment)
    private readonly investmentsRepository: typeof InvestmentsRepository,
    private readonly logger: Logger) {}

    async findByInvestorId(investorId: string): Promise<Investment[]> {
      const investments = await this.investmentsRepository
      .createQueryBuilder('investment')
      .innerJoinAndSelect('investment.investor', 'investor', 'investor.uuid = :investorId', { investorId })
      .innerJoinAndSelect('investment.project', 'project')
      .where('investment.investorId = :investorId', { investorId })
      .getMany();

      if (!investments) {
          throw new BadRequestException('Aucun investissement trouvé pour cet investisseur');
      }

      return investments;
    }

    async findByProjectId(projectId: string): Promise<Investment[]> {
      const investments = await this.investmentsRepository
      .createQueryBuilder('investment')
      .innerJoinAndSelect('investment.project', 'project', 'project.uuid = :projectId', { projectId })
      .innerJoinAndSelect('investment.investor', 'investor')
      .where('investment.projectId = :projectId', { projectId })
      .getMany();

      if (!investments) {
          throw new BadRequestException('Aucun investissement trouvé pour ce projet');
      }

      return investments;
    }
}
