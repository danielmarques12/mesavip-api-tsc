import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('tables', (table) => {
    table
      .uuid('table_id')
      .primary()
      .notNullable()
      .defaultTo(knex.raw('uuid_generate_v4()'));

    table
      .uuid('restaurant_id')
      .notNullable()
      .references('user_id')
      .inTable('users')
      .onUpdate('CASCADE')
      .onDelete('SET NULL');

    table
      .timestamp('createdAt')
      .notNullable()
      .defaultTo(new Date().toLocaleString());
    table
      .timestamp('updatedAt')
      .notNullable()
      .defaultTo(new Date().toLocaleString());
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('tables');
}