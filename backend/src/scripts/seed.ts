import * as fs from 'fs';
import * as path from 'path';
import Database from 'better-sqlite3';

const dbPath = path.join(process.cwd(), 'data', 'app.db');
const dbDir = path.dirname(dbPath);

if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const db = new Database(dbPath);
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

// Initialize schema
db.exec(`
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

db.exec(`
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

// Clear existing data (optional - comment out if you want to keep existing)
db.exec('DELETE FROM test_cases');
db.exec('DELETE FROM problems');

// Load seed data
const seedPath = path.join(process.cwd(), 'seed', 'problems.json');
const problemsData = JSON.parse(fs.readFileSync(seedPath, 'utf-8'));

const insertProblem = db.prepare(`
  INSERT INTO problems (slug, title, difficulty, tags, statement_md, starter_js, starter_py, created_at)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?)
`);

const insertTestCase = db.prepare(`
  INSERT INTO test_cases (problem_id, is_hidden, input_text, expected_output_text, order_index)
  VALUES (?, ?, ?, ?, ?)
`);

const insertMany = db.transaction((problems) => {
  for (const problem of problems) {
    const result = insertProblem.run(
      problem.slug,
      problem.title,
      problem.difficulty,
      JSON.stringify(problem.tags),
      problem.statementMd,
      problem.starterJs,
      problem.starterPy,
      Date.now()
    );

    const problemId = result.lastInsertRowid as number;

    problem.testCases.forEach((testCase: any, index: number) => {
      insertTestCase.run(
        problemId,
        testCase.isHidden ? 1 : 0,
        testCase.input,
        testCase.expectedOutput,
        index
      );
    });
  }
});

insertMany(problemsData);

console.log(`Seeded ${problemsData.length} problems with test cases`);
db.close();
