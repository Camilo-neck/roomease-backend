declare namespace Express{
    export interface Request{
        userId: string;
        house: IHouse;
    }
}