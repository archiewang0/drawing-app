import {Schema, model, models, Document, InferSchemaType, Model} from 'mongoose';

export interface ICanvas extends Document {
    _id: Schema.Types.ObjectId;
    name?: string;
    imageUrl: string;
    createdAt?: Date;
    updatedAt?: Date;
}

const CanvasSchema = new Schema(
    {
        imageUrl: {type: String, required: true},
        name: {type: String, required: false},
    },
    {
        timestamps: true,
    },
);

// Infer the TypeScript type from the schema
// type ICanvas = InferSchemaType<typeof CanvasSchema>;

export interface IUser extends Document {
    _id: Schema.Types.ObjectId;
    userId: string;
    name: string;
    email: string;
    canvasImages: ICanvas[];
    createdAt?: Date;
    updatedAt?: Date;
}

const userSchema = new Schema<IUser>(
    {
        userId: {
            type: String,
            required: true,
            unique: true,
        },
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        canvasImages: {type: [CanvasSchema], default: []}, // 陣列存放 DrawElement
    },
    {
        timestamps: true,
    },
);

const ModelUser: Model<IUser> = models.User || model<IUser>('User', userSchema);

export default ModelUser;
