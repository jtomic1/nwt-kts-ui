import { NoteType } from "./enums/NoteType";

export interface Note {
    id: number
    senderId: number;
    offenderId: number;
    noteType: NoteType;
    content: string;
    dateCreated: Date;
}