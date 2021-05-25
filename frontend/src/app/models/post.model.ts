import {User} from './user.model';
export class Post {
    post_id: string;
    user_id: string;
    title: string;
    mediaUrl: string;
    content: string;
    likes: number;
    dislikes: number;
    users_liked: string[];
    users_disliked: string[];
    user: User;
}
