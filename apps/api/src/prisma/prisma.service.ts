import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient, PrismaPg } from '@repo/database';
import pg from 'pg';
import "dotenv/config";

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{

  constructor() {
      const connectionString = `${process.env.DATABASE_URL}`;

      const pool = new pg.Pool({ connectionString });
      const adapter = new PrismaPg(pool);

      super({ adapter });
    }

  async onModuleInit() {
    await this.$connect();
  }

  async enableShutdownHooks() {
    await this.$disconnect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
