import { Client } from "pg";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

const DATABASE_URL = process.env.DATABASE_URL;

// Skip all tests if DATABASE_URL is not set
const describeWithDb = DATABASE_URL ? describe : describe.skip;

describeWithDb("Database integration tests", () => {
  let client: Client;

  beforeAll(async () => {
    client = new Client({
      connectionString: DATABASE_URL,
    });
    await client.connect();
  });

  afterAll(async () => {
    if (client) {
      await client.end();
    }
  });

  it("should connect to Postgres and execute a query", async () => {
    const result = await client.query("SELECT 1 as value");
    expect(result.rows[0].value).toBe(1);
  });

  it("should verify database is accessible", async () => {
    const result = await client.query("SELECT current_database() as db");
    expect(result.rows[0].db).toBeDefined();
  });
});

// Always run this test to verify the skip logic works
describe("Integration test skip logic", () => {
  it("should correctly identify if DATABASE_URL is set", () => {
    if (DATABASE_URL) {
      expect(DATABASE_URL).toContain("postgresql");
    } else {
      // This test passes when DATABASE_URL is not set
      expect(DATABASE_URL).toBeUndefined();
    }
  });
});
