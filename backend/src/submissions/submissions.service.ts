import { Injectable } from '@nestjs/common';
import { SqliteService } from '../db/sqlite.service';

export interface CreateSubmissionDto {
  problemId: number;
  language: string;
  code: string;
  verdict: string;
}

export interface CreateSubmissionCaseDto {
  submissionId: number;
  caseId: number;
  status: string;
  timeMs: number;
  stdout: string;
  stderr: string;
}

@Injectable()
export class SubmissionsService {
  constructor(private readonly dbService: SqliteService) {}

  createSubmission(dto: CreateSubmissionDto): number {
    const db = this.dbService.getDatabase();
    const stmt = db.prepare(
      'INSERT INTO submissions (problem_id, language, code, verdict, created_at) VALUES (?, ?, ?, ?, ?)'
    );
    const result = stmt.run(dto.problemId, dto.language, dto.code, dto.verdict, Date.now());
    return result.lastInsertRowid as number;
  }

  createSubmissionCase(dto: CreateSubmissionCaseDto): void {
    const db = this.dbService.getDatabase();
    const stmt = db.prepare(
      'INSERT INTO submission_cases (submission_id, case_id, status, time_ms, stdout, stderr) VALUES (?, ?, ?, ?, ?, ?)'
    );
    stmt.run(dto.submissionId, dto.caseId, dto.status, dto.timeMs, dto.stdout, dto.stderr);
  }
}
