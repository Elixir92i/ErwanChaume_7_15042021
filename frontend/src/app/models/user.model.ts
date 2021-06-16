import { Post } from './post.model';
export class User {
    firstname: string;
    lastname: string;
    user_id: string;
    email: string;
    password: string;
    imageUrl: string;
    admin: boolean;
    posts: Post;
}
