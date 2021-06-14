import { Request, Response } from 'express';

import query from '../../shared/infra/knex/knex';

class ListOneRestaurant {
  async execute(request: Request, response: Response): Promise<Response> {
    const { restaurant_id } = request.params;

    const restaurant = await query
      .select([
        'u.name',
        'r.about',
        'r.phone',
        'r.site',
        'c.name AS culinary',
        'a.bairro',
        'a.cidade',
        'a.estado',
        'a.cep',
        'a.logradouro',
        'a.numero',
        'a.complemento',
        query.raw('cast(avg(rates.rate) as decimal(10,1)) AS average_rate'),
      ])
      .count('rates.rate as total_ratings')
      .from({ u: 'users' })
      .innerJoin({ r: 'restaurants' }, 'u.user_id', 'r.restaurant_id')
      .innerJoin({ c: 'culinaries' }, 'c.culinary_id', 'r.culinary_id')
      .innerJoin({ a: 'addresses' }, 'a.user_id', 'r.restaurant_id')
      .innerJoin('rates', 'rates.restaurant_id', 'r.restaurant_id')
      .where({ 'r.restaurant_id': restaurant_id })
      .groupBy(['u.user_id', 'r.id', 'c.culinary_id', 'a.address_id']);

    if (!restaurant) {
      return response.status(201).json({ error: 'Restaurant not found' });
    }

    return response.status(201).json(restaurant);
  }
}
export { ListOneRestaurant };