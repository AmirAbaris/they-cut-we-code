import { Controller, Get, Param, HttpException, HttpStatus, Query } from '@nestjs/common';
import { ProblemsService } from './problems.service';
import { ProblemListItemDto } from './dto/get-problems.dto';
import { ProblemDetailDto } from './dto/get-problem-detail.dto';

@Controller('problems')
export class ProblemsController {
  constructor(private readonly problemsService: ProblemsService) {}

  @Get()
  findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('q') q?: string
  ): {
    items: ProblemListItemDto[];
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrevious: boolean;
  } {
    const parsedPage = Number(page);
    const parsedLimit = Number(limit);

    return this.problemsService.findAll({
      page: Number.isFinite(parsedPage) ? parsedPage : 1,
      limit: Number.isFinite(parsedLimit) ? parsedLimit : 20,
      q,
    });
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
