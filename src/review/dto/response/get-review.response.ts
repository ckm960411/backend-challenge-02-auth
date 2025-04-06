import { map } from 'lodash';
import { Review } from 'src/entities/review.entity';
import { WithRelations } from 'src/utils/types/utility/WithRelations.utility';
import { Column } from 'typeorm';

export class ReviewResponse {
  @Column()
  id: number;

  @Column()
  createdAt: Date;

  @Column()
  updatedAt: Date;

  @Column()
  rating: number;

  @Column()
  content: string;

  @Column()
  photos: string[];

  @Column()
  userId: number;

  @Column()
  userName: string;

  @Column()
  userEmail: string;

  constructor(review: WithRelations<Review, 'reviewPhotos' | 'user'>) {
    this.id = review.id;
    this.createdAt = review.createdAt;
    this.updatedAt = review.updatedAt;
    this.rating = review.rating;
    this.content = review.content;
    this.photos = map(review.reviewPhotos, 'url');
    this.userId = review.user.id;
    this.userName = review.user.name;
    this.userEmail = review.user.email;
  }
}
