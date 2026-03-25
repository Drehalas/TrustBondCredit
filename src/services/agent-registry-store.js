import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";

const MAX_RECORDS = 2000;

export class AgentRegistryStore {
  constructor({ filePath = "./data/agents.jsonl" } = {}) {
    this.filePath = path.isAbsolute(filePath) ? filePath : path.join(process.cwd(), filePath);
  }

  async init() {
    await fs.mkdir(path.dirname(this.filePath), { recursive: true });
    await fs.appendFile(this.filePath, "", "utf8");
  }

  async register(payload) {
    const now = new Date().toISOString();
    const agent = {
      id: crypto.randomUUID(),
      createdAt: now,
      updatedAt: now,
      name: String(payload.name || "").trim(),
      ticker: String(payload.ticker || "").trim().toUpperCase(),
      uaid: payload.uaid ? String(payload.uaid).trim() : null,
      description: payload.description ? String(payload.description).trim() : "",
      skillMarkdown: payload.skillMarkdown ? String(payload.skillMarkdown) : "",
      source: payload.source ? String(payload.source) : "manual",
      metadata: payload.metadata && typeof payload.metadata === "object" ? payload.metadata : {}
    };

    const line = `${JSON.stringify(agent)}\n`;
    await fs.appendFile(this.filePath, line, "utf8");
    return agent;
  }

  async listRecent(limit = 200) {
    const lines = await this.#readLines();
    const parsed = this.#parseLines(lines);
    const deduped = this.#dedupeLatestByIdentity(parsed);
    const normalizedLimit = Math.max(1, Math.min(500, Math.trunc(limit || 200)));
    return deduped.slice(-normalizedLimit).reverse();
  }

  async getById(id) {
    const needle = String(id || "").trim();
    if (!needle) return null;
    const items = await this.listRecent(MAX_RECORDS);
    return items.find((item) => item.id === needle) || null;
  }

  async getByUaid(uaid) {
    const needle = String(uaid || "").trim();
    if (!needle) return null;
    const items = await this.listRecent(MAX_RECORDS);
    return items.find((item) => item.uaid === needle) || null;
  }

  async #readLines() {
    try {
      const raw = await fs.readFile(this.filePath, "utf8");
      return raw.split("\n").filter(Boolean);
    } catch (error) {
      if (error && typeof error === "object" && "code" in error && error.code === "ENOENT") {
        return [];
      }
      throw error;
    }
  }

  #parseLines(lines) {
    const parsed = [];
    for (const line of lines) {
      try {
        parsed.push(JSON.parse(line));
      } catch {
        // Skip malformed lines.
      }
    }
    return parsed;
  }

  #dedupeLatestByIdentity(records) {
    const seen = new Set();
    const output = [];
    for (let i = records.length - 1; i >= 0; i -= 1) {
      const item = records[i];
      const key = item.uaid || item.id;
      if (!key || seen.has(key)) continue;
      seen.add(key);
      output.push(item);
    }
    return output.reverse();
  }
}
