import { Schema, model, models, Document } from 'mongoose';

export interface IUser extends Document {
    _id: Schema.Types.ObjectId;
    name: string;
    email: string;
    createdAt: Date;
    updatedAt: Date;
}

const userSchema = new Schema<IUser>({
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

const User = models.User || model<IUser>('User', userSchema);

export default User; 