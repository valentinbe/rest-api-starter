import {
    prop,
    Ref,
    Typegoose,
    staticMethod,
    arrayProp,
    ModelType,
    instanceMethod,
    pre,
    post,
    plugin,
    InstanceType
} from "typegoose";
import * as EmailValidator from "email-validator";
import * as timestamps from "mongoose-timestamp";
import * as findOrCreate from "mongoose-findorcreate";
import * as _ from "lodash";
import * as bcrypt from "bcryptjs";

const isEmail = (string): boolean => {
    return EmailValidator.validate(string);
};

class Job {
    @prop()
    title?: string;

    @prop()
    position?: string;
}

class Car extends Typegoose {
    @prop()
    model?: string;
}

enum Role {
    AGENT = "AGENT",
    ADMIN = "ADMIN"
}

@pre<Account>("save", next => {
    let account = this;
    if (!account.isModified("password")) return next();
    bcrypt.hash(account.password, 10, (err, hash) => {
        if (err) return next(err);
        const hashed_account = _.omit(account, "password");
        hashed_account.hash = bcrypt.hashSync(account.password, 10);
        account = hashed_account;
        next();
    });
})
@pre<Account>("remove", next => {
    // const CarModel = new Account().getModelForClass(Car);
    // CarModel.remove({ownerId: this._id})
    next();
})
@post<Account>("save", account => {
    if (account.role === Role.AGENT) {
        console.log(account.name, "is an agent!");
    } else {
        console.log(account.name, "is an admin!");
    }
})
@plugin(timestamps)
@plugin(findOrCreate)
export class Account extends Typegoose {
    /**
     *    Properties
     */
    @prop({
        unique: true,
        minlength: 5,
        maxlength: 10,
        match: /[0-9a-Z]*/,
        required: true
    })
    username: string;
    @prop({ required: true })
    name: string;
    @prop({ required: true })
    hash: string;
    @prop({
        validate: {
            validator: val => isEmail(val),
            message: `{VALUE} is not a valid email`
        }
    })
    email?: string;
    @prop({ required: true })
    age: number;
    @prop({ index: true })
    tags?: [string];
    @prop()
    description?: string;
    @prop()
    job?: Job;
    @prop()
    jobs?: [Job];
    @prop({ ref: Car, required: true })
    car: Ref<Car>;
    @arrayProp({ itemsRef: Car })
    previousCars?: Ref<Car>[];
    @prop({ enum: Role, required: true, default: Role.AGENT })
    role: Role;
    @prop() // this will create a virtual property called 'fullName'
    get fullName() {
        return `${this.name} ${this.description}`;
    }
    set fullName(full) {
        const [name, description] = full.split(" ");
        this.name = name;
        this.description = description;
    }
    /**
     *    Static methods
     */
    @staticMethod
    static findByAge(this: ModelType<Account> & typeof Account, age: number) {
        return this.findOne({ age });
    }
    @staticMethod
    static updateAuthor(
        this: ModelType<Account> & typeof Account,
        id: string,
        description: string
    ) {
        return this.update(
            { _id: id },
            { $set: { description: description } }
        ).exec();
    }
    @staticMethod
    static updateByAge(
        this: ModelType<Account> & typeof Account,
        ageLimit: number,
        text: string
    ): Promise<number> {
        return this.where("age")
            .gte(ageLimit)
            .update({
                $set: {
                    description: text
                }
            })
            .exec();
    }
    /**
     *    Instance methods
     */
    @instanceMethod
    incrementAge(this: InstanceType<Account>) {
        const age = this.age || 1;
        this.age = age + 1;
        return this.save();
    }

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

export const AccountModel = new Account().getModelForClass(Account);
