import { Injectable } from '@nestjs/common';
import { SqliteService } from '../db/sqlite.service';

@Injectable()
export class ProblemsService {
  constructor(private readonly dbService: SqliteService) {}

  findAll(params?: { page?: number; limit?: number; q?: string }) {
    const db = this.dbService.getDatabase();

    const page = Math.max(1, params?.page ?? 1);
    const limit = Math.min(100, Math.max(1, params?.limit ?? 20));
    const q = (params?.q ?? '').trim();

    const whereClause = q
      ? 'WHERE lower(title) LIKE ? OR lower(slug) LIKE ? OR lower(tags) LIKE ?'
      : '';
    const qParam = `%${q.toLowerCase()}%`;
    const whereParams = q ? [qParam, qParam, qParam] : [];

    const totalRow = db
      .prepare(`SELECT COUNT(*) as total FROM problems ${whereClause}`)
      .get(...whereParams) as { total: number };

    const offset = (page - 1) * limit;

    const problems = db
      .prepare(
        `SELECT id, slug, title, difficulty, tags FROM problems ${whereClause} ORDER BY id LIMIT ? OFFSET ?`
      )
      .all(...whereParams, limit, offset) as Array<{
      id: number;
      slug: string;
      title: string;
      difficulty: string;
      tags: string;
    }>;

    const items = problems.map((p) => ({
      id: p.id,
      slug: p.slug,
      title: p.title,
      difficulty: p.difficulty,
      tags: JSON.parse(p.tags) as string[],
    }));

    const total = totalRow?.total ?? 0;
    const totalPages = Math.max(1, Math.ceil(total / limit));
    const hasPrevious = page > 1;
    const hasNext = page < totalPages;

    return {
      items,
      page,
      limit,
      total,
      totalPages,
      hasNext,
      hasPrevious,
    };
  }

  findOne(idOrSlug: string | number) {
    const db = this.dbService.getDatabase();
    const isNumeric = typeof idOrSlug === 'number' || /^\d+$/.test(String(idOrSlug));

    const problem = isNumeric
      ? db.prepare('SELECT * FROM problems WHERE id = ?').get(Number(idOrSlug))
      : db.prepare('SELECT * FROM problems WHERE slug = ?').get(String(idOrSlug));

    if (!problem) {
      return null;
    }

    const p = problem as {
      id: number;
      slug: string;
      title: string;
      difficulty: string;
      tags: string;
      statement_md: string;
      starter_js: string;
      starter_py: string;
    };

    // Get sample test cases (is_hidden = 0)
    const samples = db
      .prepare(
        'SELECT input_text, expected_output_text FROM test_cases WHERE problem_id = ? AND is_hidden = 0 ORDER BY order_index'
      )
      .all(p.id) as Array<{ input_text: string; expected_output_text: string }>;

    return {
      id: p.id,
      slug: p.slug,
      title: p.title,
      difficulty: p.difficulty,
      tags: JSON.parse(p.tags) as string[],
      statementMd: p.statement_md,
      starterCode: {
        js: p.starter_js,
        py: p.starter_py,
      },
      samples: samples.map((s) => ({
        input: s.input_text,
        output: s.expected_output_text,
      })),
    };
  }

  getTestCases(problemId: number, includeHidden: boolean) {
    const db = this.dbService.getDatabase();
    const query = includeHidden
      ? 'SELECT * FROM test_cases WHERE problem_id = ? ORDER BY order_index'
      : 'SELECT * FROM test_cases WHERE problem_id = ? AND is_hidden = 0 ORDER BY order_index';

    return db.prepare(query).all(problemId) as Array<{
      id: number;
      problem_id: number;
      is_hidden: number;
      input_text: string;
      expected_output_text: string;
      order_index: number;
    }>;
  }
}
