import * as mongoose from "mongoose";

(mongoose as any).Promise = global.Promise;

mongoose.connect(
    "mongodb://localhost:27017/test",
    {
        useMongoClient: true
    }
);

export { mongoose };
