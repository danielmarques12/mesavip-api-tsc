import { Request, Response } from 'express';
import { Rating } from '../../interfaces/Rating';
import { db } from '../../shared/infra/knex/knex';

export class ListRatingById {
  async execute(request: Request, response: Response): Promise<Response> {
    const { reservation_id } = request.params;

    const rating = await db<Rating>('ratings')
      .select([
        'rating',
        'comment',
        db.raw(`to_char("createdAt", 'Mon dd, yyyy') as date`),
      ])
      .where({ reservation_id })
      .first();

    return response.status(200).json(rating);
  }
}
