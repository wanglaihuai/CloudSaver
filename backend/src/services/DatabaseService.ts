import { Sequelize, QueryTypes } from "sequelize";

export class DatabaseService {
  private sequelize: Sequelize;

  constructor() {
    this.sequelize = new Sequelize({
      dialect: "sqlite",
      storage: "./data/database.sqlite",
    });
  }

  async initialize(): Promise<void> {
    try {
      await this.sequelize.query("PRAGMA foreign_keys = OFF");
      await this.cleanupBackupTables();
      await this.sequelize.sync({ alter: true });
      await this.sequelize.query("PRAGMA foreign_keys = ON");
    } catch (error) {
      throw new Error(`数据库初始化失败: ${(error as Error).message}`);
    }
  }

  private async cleanupBackupTables(): Promise<void> {
    const backupTables = await this.sequelize.query<{ name: string }>(
      "SELECT name FROM sqlite_master WHERE type='table' AND name LIKE '%\\_backup%' ESCAPE '\\'",
      { type: QueryTypes.SELECT }
    );

    for (const table of backupTables) {
      if (table?.name) {
        await this.sequelize.query(`DROP TABLE IF EXISTS ${table.name}`);
      }
    }
  }

  // ... 其他数据库相关方法
}
