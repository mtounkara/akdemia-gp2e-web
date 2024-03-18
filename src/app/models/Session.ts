export interface Session {
description: string;
    id: number;
    code: string;
    duration: number;
    price:number;
    status: string;
    date: Date;
    lacation : string;
    sessionScore:number;
    creationDate:Date;
    updateDate:Date;
    minParticipants:number;
}