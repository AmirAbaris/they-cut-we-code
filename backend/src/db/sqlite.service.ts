import { Injectable, OnModuleInit } from '@nestjs/common';
import Database from 'better-sqlite3';
import * as path from 'path';
import * as fs from 'fs';

@Injectable()
export class SqliteService implements OnModuleInit {
  private db: Database.Database;

  constructor() {
    const dbPath = path.join(process.cwd(), 'data', 'app.db');
    const dbDir = path.dirname(dbPath);

    // Ensure data directory exists
    if (!fs.existsSync(dbDir)) {
      fs.mkdirSync(dbDir, { recursive: true });
    }

    this.db = new Database(dbPath);
    this.db.pragma('journal_mode = WAL');
    this.db.pragma('foreign_keys = ON');
  }

  getDatabase(): Database.Database {
    return this.db;
  }

  async onModuleInit() {
    this.initSchema();
  }

  private initSchema() {
    // Problems table
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS problems (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        slug TEXT UNIQUE NOT NULL,
        title TEXT NOT NULL,
        difficulty TEXT NOT NULL,
        tags TEXT NOT NULL,
        statement_md TEXT NOT NULL,
        starter_js TEXT NOT NULL,
        starter_py TEXT NOT NULL,
        created_at INTEGER NOT NULL
      )
    `);

    // Test cases table
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS test_cases (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        problem_id INTEGER NOT NULL,
        is_hidden INTEGER NOT NULL,
        input_text TEXT NOT NULL,
        expected_output_text TEXT NOT NULL,
        order_index INTEGER NOT NULL,
        FOREIGN KEY (problem_id) REFERENCES problems(id) ON DELETE CASCADE
      )
    `);

    // Submissions table
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS submissions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        problem_id INTEGER NOT NULL,
        language TEXT NOT NULL,
        code TEXT NOT NULL,
        verdict TEXT NOT NULL,
        created_at INTEGER NOT NULL,
        FOREIGN KEY (problem_id) REFERENCES problems(id) ON DELETE CASCADE
      )
    `);

    // Submission cases table
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS submission_cases (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        submission_id INTEGER NOT NULL,
        case_id INTEGER NOT NULL,
        status TEXT NOT NULL,
        time_ms INTEGER NOT NULL,
        stdout TEXT NOT NULL,
        stderr TEXT NOT NULL,
        FOREIGN KEY (submission_id) REFERENCES submissions(id) ON DELETE CASCADE,
        FOREIGN KEY (case_id) REFERENCES test_cases(id) ON DELETE CASCADE
      )
    `);

    // Indexes
    this.db.exec(`
      CREATE INDEX IF NOT EXISTS idx_test_cases_problem_id ON test_cases(problem_id);
      CREATE INDEX IF NOT EXISTS idx_submissions_problem_id ON submissions(problem_id);
      CREATE INDEX IF NOT EXISTS idx_submission_cases_submission_id ON submission_cases(submission_id);
    `);
  }

  async onModuleDestroy() {
    this.db.close();
  }
}
