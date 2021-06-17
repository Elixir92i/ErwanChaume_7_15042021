// Modèle pour les commentaires
import { User } from './user.model';
export class Comment {
    comment_id: string;
    post_id: string;
    user_id: string;
    commentContent: string;
    user: User;
}
