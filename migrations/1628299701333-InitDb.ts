import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitDb1628299701333 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'CREATE TABLE clients (id varchar PRIMARY KEY NOT NULL, name varchar NOT NULL, latitude varchar(20) NOT NULL, longitude varchar(20) NOT NULL, cpf varchar NOT NULL, phone_number varchar NOT NULL, created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now())',
    );

    await queryRunner.query(
      'CREATE TABLE plans (id varchar NOT NULL PRIMARY KEY, name varchar NOT NULL, price decimal(12,2) NOT NULL, created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now())',
    );

    await queryRunner.query(
      'CREATE TABLE users (id varchar NOT NULL PRIMARY KEY, email varchar(100) NOT NULL, name varchar NOT NULL, password varchar(50) NOT NULL, created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now())',
    );

    await queryRunner.query(
      'CREATE TABLE orders (id varchar NOT NULL PRIMARY KEY, user_id varchar, client_id varchar, plan_id varchar, status varchar(10) NOT NULL, created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now())',
    );

    await queryRunner.query(
      'CREATE TABLE equipments (id varchar NOT NULL PRIMARY KEY, name varchar NOT NULL, manufacturer varchar NOT NULL, price decimal(12,2) NOT NULL, created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now())',
    );

    await queryRunner.query(
      'CREATE TABLE storage (id varchar NOT NULL PRIMARY KEY, equipment_id varchar, quantity int NOT NULL, created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now(), last_move timestamptz NOT NULL DEFAULT now())',
    );

    await queryRunner.query(
      'ALTER TABLE orders ADD CONSTRAINT FK_orders_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE SET NULL ON UPDATE SET NULL',
    );

    await queryRunner.query(
      'ALTER TABLE orders ADD CONSTRAINT FK_orders_plan FOREIGN KEY (plan_id) REFERENCES plans (id) ON DELETE SET NULL ON UPDATE SET NULL',
    );

    await queryRunner.query(
      'ALTER TABLE orders ADD CONSTRAINT FK_orders_client FOREIGN KEY (client_id) REFERENCES clients (id) ON DELETE SET NULL ON UPDATE SET NULL',
    );

    await queryRunner.query(
      'ALTER TABLE storage ADD CONSTRAINT FK_storage_equipment FOREIGN KEY (equipment_id) REFERENCES equipments (id) ON DELETE SET NULL ON UPDATE SET NULL',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE orders DROP CONSTRAINT FK_orders_user',
    );
    await queryRunner.query(
      'ALTER TABLE orders DROP CONSTRAINT FK_orders_plan',
    );
    await queryRunner.query(
      'ALTER TABLE orders DROP CONSTRAINT FK_orders_client',
    );
    await queryRunner.query(
      'ALTER TABLE storage DROP CONSTRAINT FK_storage_equipment',
    );

    await queryRunner.query('DROP TABLE storage');
    await queryRunner.query('DROP TABLE equipments');
    await queryRunner.query('DROP TABLE orders');
    await queryRunner.query('DROP TABLE users');
    await queryRunner.query('DROP TABLE plans');
    await queryRunner.query('DROP TABLE clients');
  }
}
