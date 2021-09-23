import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddEmailToClient1632091637125 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE clients ADD COLUMN email varchar');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE clients DROP COLUMN email');
  }
}
