import { Module } from '@nestjs/common';
import { JudgeController } from './judge.controller';
import { JudgeService } from './judge.service';
import { ProblemsModule } from '../problems/problems.module';
import { RunnerModule } from '../runner/runner.module';
import { SubmissionsModule } from '../submissions/submissions.module';

@Module({
  imports: [ProblemsModule, RunnerModule, SubmissionsModule],
  controllers: [JudgeController],
  providers: [JudgeService],
})
export class JudgeModule {}
