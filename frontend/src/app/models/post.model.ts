import { User } from './user.model';
import { Like } from './like.model';
export class Post {
    post_id: string;
    user_id: string;
    title: string;
    mediaUrl: string;
    content: string;
    user: User;
    likes: Like;
}
