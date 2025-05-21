import { Controller, Get, Post, Body, Param, Delete, NotFoundException, UseGuards, Request, Put } from '@nestjs/common';
import { InvestmentsService } from './investments.service';
import { Investment } from './entities/investment.entity';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from 'src/roles/roles.decorator';
import { RolesGuard } from 'src/roles/roles.guard';

@Controller('investments')
export class InvestmentsController {
    constructor(private readonly investmentsService: InvestmentsService) {}
}
