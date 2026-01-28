import { Controller, Post, Body, HttpException, HttpStatus } from '@nestjs/common';
import { JudgeService } from './judge.service';
import { RunCodeDto } from './dto/run-code.dto';
import { SubmitCodeDto } from './dto/submit-code.dto';
import { RunResultDto } from './dto/run-result.dto';
import { ProblemsService } from '../problems/problems.service';

@Controller('judge')
export class JudgeController {
  constructor(
    private readonly judgeService: JudgeService,
    private readonly problemsService: ProblemsService
  ) {}

  @Post('run')
  async run(@Body() dto: RunCodeDto): Promise<RunResultDto> {
    // Verify problem exists
    const problem = this.problemsService.findOne(dto.problemId);
    if (!problem) {
      throw new HttpException('Problem not found', HttpStatus.NOT_FOUND);
    }

    return this.judgeService.runCode(dto.problemId, dto.language, dto.code);
  }

  @Post('submit')
  async submit(@Body() dto: SubmitCodeDto): Promise<RunResultDto> {
    // Verify problem exists
    const problem = this.problemsService.findOne(dto.problemId);
    if (!problem) {
      throw new HttpException('Problem not found', HttpStatus.NOT_FOUND);
    }

    return this.judgeService.submitCode(dto.problemId, dto.language, dto.code);
  }
}
