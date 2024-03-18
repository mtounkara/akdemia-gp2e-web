import { Theme } from "./Theme";

export interface Formation {
    id:number;
    title:string;
    description:string;
    trainingPrice:number;
    logo:string;
    creationDate: Date;
    updateDate: Date;
    themes: Theme[];
}