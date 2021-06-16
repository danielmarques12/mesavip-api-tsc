import { Request, Response } from 'express';

import query from '../../shared/infra/knex/knex';

class ListReservations {
  async execute(request: Request, response: Response): Promise<Response> {
    const { id: client_id } = request.user;

    const reservations = await query
      .select([
        'r.reservation_id as id',
        'u.name as restaurant',
        query.raw(
          `concat_ws(' - ', a.logradouro, a.numero, a.complemento, a.cidade, a.estado) as address`
        ),
        query.raw(`to_char(r.date, 'Mon dd, yyyy') as date`),
        'h.hour',
      ])
      .from({ r: 'reservations' })
      .innerJoin({ h: 'hours' }, 'r.hour_id', 'h.hour_id')
      .innerJoin({ u: 'users' }, 'u.user_id', 'h.restaurant_id')
      .innerJoin({ a: 'addresses' }, 'a.user_id', 'h.restaurant_id')
      .where({ 'r.client_id': client_id, 'r.canceled': null });

    if (!reservations.length) {
      return response.status(400).json({ error: 'No reservations were found' });
    }

    return response.status(201).json(reservations);
  }
}
export { ListReservations };
