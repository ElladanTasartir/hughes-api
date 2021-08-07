import { MigrationInterface, QueryRunner } from "typeorm";

export class InitDb1628299701333 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'CREATE TABLE clients (id varchar PRIMARY KEY NOT NULL, name varchar NOT NULL, latitude decimal NOT NULL, longitude decimal NOT NULL, cpf varchar NOT NULL, phone_number varchar NOT NULL, created_at timestamptz NOT NULL, updated_at timestamptz NOT NULL)',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE clients`);
  }
}
