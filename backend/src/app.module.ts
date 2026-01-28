import { Module } from '@nestjs/common';
import { DbModule } from './db/db.module';
import { ProblemsModule } from './problems/problems.module';
import { JudgeModule } from './judge/judge.module';
import { RunnerModule } from './runner/runner.module';
import { SubmissionsModule } from './submissions/submissions.module';
import { AppController } from './app.controller';

@Module({
  imports: [DbModule, ProblemsModule, JudgeModule, RunnerModule, SubmissionsModule],
  controllers: [AppController],
})
export class AppModule {}
