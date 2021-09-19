import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddDescriptionToPlan1632019744115 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE plans ADD COLUMN description varchar');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE plans DROP COLUMN description');
  }
}
