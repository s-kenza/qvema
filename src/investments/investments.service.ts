import { BadRequestException, ForbiddenException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InvestmentsRepository } from './investments.repository';
import { Investment } from './entities/investment.entity';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { UserRole } from 'src/enums/user-role.enum';

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

      if (investments.length === 0) {
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

    // Récupérer un investissement par son UUID
    async findById(uuid: string): Promise<Investment> {
      const investment = await this.investmentsRepository.findOne({
        where: { uuid },
        relations: ['investor', 'project'],
      });

      if (!investment) {
        throw new NotFoundException('Investissement non trouvé');
      }

      return investment;
    }
    
    // Récupérer les investissements d'un projet pour son propriétaire
    async findByProjectIdForOwner(projectId: string, ownerId: string): Promise<Investment[]> {
      // D'abord vérifier que le projet appartient bien à l'utilisateur
      const projectOwnership = await this.investmentsRepository
        .createQueryBuilder('investment')
        .innerJoin('investment.project', 'project')
        .innerJoin('project.owner', 'owner')
        .where('project.uuid = :projectId', { projectId })
        .andWhere('owner.uuid = :ownerId', { ownerId })
        .getCount();

      // Si aucun résultat, l'utilisateur n'est pas propriétaire du projet
      if (projectOwnership === 0) {
        throw new ForbiddenException('Vous n\'êtes pas autorisé à consulter les investissements de ce projet');
      }

      // Si l'utilisateur est bien le propriétaire, récupérer les investissements
      const investments = await this.investmentsRepository
        .createQueryBuilder('investment')
        .innerJoinAndSelect('investment.project', 'project', 'project.uuid = :projectId', { projectId })
        .innerJoinAndSelect('investment.investor', 'investor')
        .where('investment.projectId = :projectId', { projectId })
        .getMany();

      if (investments.length === 0) {
        throw new NotFoundException('Aucun investissement trouvé pour ce projet');
      }

      return investments;
    }

    async createInvestment(investmentData: Investment, userId: string): Promise<Investment> {

      // Créer un nouvel investissement
      const newInvestment = this.investmentsRepository.create({
        ...investmentData,
        investor: { uuid: userId },
      });

      return this.investmentsRepository.save(newInvestment);
    }

    async removeInvestment(uuid: string, userId: string, userRole: string): Promise<void> {
      // Vérifier si l'investissement existe
      const investment = await this.investmentsRepository.findOne({ 
        where: { uuid },
        relations: ['investor']
      });

      if (!investment) {
        throw new NotFoundException('Investissement non trouvé');
      }

      // Si c'est un admin, on peut supprimer n'importe quel investissement
      if (userRole === UserRole.ADMIN) {
        this.logger.log(`L'administrateur ${userId} supprime l'investissement ${uuid}`);
        await this.investmentsRepository.remove(investment);
        return;
      }
      console.log('investment', investment);
      // Vérifier si l'investisseur qui supprime l'investissement est le même que celui qui l'a créé
      if (investment.investor.uuid !== userId) {
        throw new ForbiddenException('Vous ne pouvez pas supprimer cet investissement');
      }

      // Supprimer l'investissement
      await this.investmentsRepository.remove(investment);
    }
}
