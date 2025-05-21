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
}
