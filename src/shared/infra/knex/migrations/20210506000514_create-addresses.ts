import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('addresses', (table) => {
    table
      .uuid('id')
      .primary()
      .notNullable()
      .defaultTo(knex.raw('uuid_generate_v4()'));

    table
      .uuid('restaurant_id')
      .notNullable()
      .references('id')
      .inTable('restaurants')
      .onUpdate('CASCADE')
      .onDelete('SET NULL');

    table.string('bairro').notNullable();
    table.string('cidade').notNullable();
    table.string('estado').notNullable();
    table.string('cep').notNullable();
    table.string('logradouro').notNullable();
    table.string('numero').notNullable();
    table.string('complemento').nullable();

    table
      .timestamp('createdAt')
      .notNullable()
      .defaultTo(knex.raw('transaction_timestamp()'));
    table
      .timestamp('updatedAt')
      .notNullable()
      .defaultTo(knex.raw('transaction_timestamp()'));
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('addresses');
}
