import { NoteType } from "./enums/NoteType";

export interface Note {
    offenderId: number;
    noteType: NoteType;
    content: string;
}