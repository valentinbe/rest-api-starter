// import * as mongoose from "mongoose";
import * as findOrCreate from "mongoose-findorcreate";
import * as timestamps from "mongoose-timestamp";
import {
    InstanceType,
    ModelType,
    plugin,
    prop,
    Ref,
    staticMethod,
    Typegoose
} from "typegoose";

import { Account } from "./author";

@plugin(timestamps)
@plugin(findOrCreate)
export class Post extends Typegoose {
    /**
     *    Properties
     */
    @prop({ required: true })
    title: string;
    @prop()
    description?: string;
    @prop({ ref: Account, required: true })
    author: Ref<Account>;
    /**
     *    Static methods
     */
    @staticMethod
    static findAllByAuthor(
        this: ModelType<Account> & typeof Account,
        author: string
    ) {
        return this.find({ author: author })
            .lean()
            .exec();
    }
    /**
     *    Instance methods
     */

    /**
     *    Plugins additions
     */
    @prop()
    createdAt?: Date;
    @prop()
    updatedAt?: Date;

    static findOrCreate: (
        condition: InstanceType<Account>
    ) => Promise<{ doc: InstanceType<Account>; created: boolean }>;
}

export const PostModel = new Account().getModelForClass(Post);
