import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateOrderEquipmentTable1633918782115
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'CREATE TABLE order_equipments (order_id varchar NOT NULL, equipment_id varchar NOT NULL, quantity int NOT NULL)',
    );

    await queryRunner.query(
      'ALTER TABLE order_equipments ADD CONSTRAINT PK_order_equipments PRIMARY KEY (order_id, equipment_id)',
    );

    await queryRunner.query(
      'ALTER TABLE order_equipments ADD CONSTRAINT FK_order_equipments_order FOREIGN KEY (order_id) REFERENCES orders (id) ON DELETE CASCADE ON UPDATE CASCADE',
    );

    await queryRunner.query(
      'ALTER TABLE order_equipments ADD CONSTRAINT FK_order_equipments_equipment FOREIGN KEY (equipment_id) REFERENCES equipments (id) ON DELETE SET NULL ON UPDATE CASCADE',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE order_equipments DROP CONSTRAINT FK_order_equipments_equipment',
    );

    await queryRunner.query(
      'ALTER TABLE order_equipments DROP CONSTRAINT FK_order_equipments_order',
    );

    await queryRunner.query(
      'ALTER TABLE order_equipments DROP CONSTRAINT PK_order_equipments',
    );

    await queryRunner.query('DROP TABLE order_equipments');
  }
}
