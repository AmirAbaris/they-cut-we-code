import { Controller, Get, Param, HttpException, HttpStatus } from '@nestjs/common';
import { ProblemsService } from './problems.service';
import { ProblemListItemDto } from './dto/get-problems.dto';
import { ProblemDetailDto } from './dto/get-problem-detail.dto';

@Controller('problems')
export class ProblemsController {
  constructor(private readonly problemsService: ProblemsService) {}

  @Get()
  findAll(): ProblemListItemDto[] {
    return this.problemsService.findAll();
  }

  @Get(':idOrSlug')
  findOne(@Param('idOrSlug') idOrSlug: string): ProblemDetailDto {
    const problem = this.problemsService.findOne(idOrSlug);
    if (!problem) {
      throw new HttpException('Problem not found', HttpStatus.NOT_FOUND);
    }
    return problem;
  }
}
