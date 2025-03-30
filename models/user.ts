import { Schema, model, models, Document ,InferSchemaType } from 'mongoose';

// export interface IUser {
//     _id: Schema.Types.ObjectId;
//     name: string;
//     email: string;
//     createdAt: Date;
//     updatedAt: Date;
// }

const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
}, {
    timestamps: true
});

export interface IUser extends InferSchemaType<typeof userSchema> {
    _id: Schema.Types.ObjectId;
}

const User = models.User || model<IUser>('User', userSchema);

export default User; 