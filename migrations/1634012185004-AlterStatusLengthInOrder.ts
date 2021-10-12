import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterStatusLengthInOrder1634012185004
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE orders ALTER COLUMN status TYPE varchar(11)',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE orders ALTER COLUMN status TYPE varchar(10)',
    );
  }
}
