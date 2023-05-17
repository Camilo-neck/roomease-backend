declare namespace Express{
    export interface Request{
        userId: ObjectId;
        house: Document;
    }
}