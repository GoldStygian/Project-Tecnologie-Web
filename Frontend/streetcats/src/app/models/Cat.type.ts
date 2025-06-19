import { Comment } from './Comment.type';

export interface Cat{
    id?: number,
    photo: string,
    longitudine: number,
    latitudine: number,
    title: string,
    createdAt?: string,
    updatedAt?: string,
    userName?: string,
    description?: string,
    Comments?: Comment[]
}