import {Schema, model, models, Document, InferSchemaType, Model} from 'mongoose';
// import Position

const PositionXYXYSchema = new Schema({
    x1: {type: Number, required: true},
    y1: {type: Number, required: true},
    x2: {type: Number, required: true},
    y2: {type: Number, required: true},
});

const PositionXYSchema = new Schema({
    x: {type: Number, required: true},
    y: {type: Number, required: true},
});

const DrawElementSchema = new Schema({
    id: {type: Number, required: true},
    roughElement: {type: Schema.Types.Mixed, required: true}, // 存儲 Rough.js 元素
    type: {type: String, required: true}, // ToolModeEnum 可以用 Enum 限制
    points: {type: [PositionXYSchema], default: []}, // 陣列的 PositionXY
    text: {type: String, default: ''},
    ...PositionXYXYSchema.obj, // 繼承 PositionXYXYSchema 屬性
});

export interface ICanvas extends Document {
    _id: Schema.Types.ObjectId;
    name?: string;
    drawElements: DrawElement[];
}

const CanvasSchema = new Schema<ICanvas>(
    {
        drawElements: {type: [DrawElementSchema], default: []}, // 陣列存放 DrawElement
        name: {type: String, required: false},
    },
    {
        timestamps: true,
    },
);

export interface IUser extends Document {
    _id: Schema.Types.ObjectId;
    userId: string;
    name: string;
    email: string;
    canvas: ICanvas[];
}

const userSchema = new Schema<IUser>(
    {
        userId: {
            type: String,
            required: true,
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
        canvas: {type: [CanvasSchema], default: []}, // 陣列存放 DrawElement
    },
    {
        timestamps: true,
    },
);

const ModelUser: Model<IUser> = models.User || model<IUser>('User', userSchema);

export default ModelUser;
