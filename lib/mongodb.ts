// import { MongoClient, ServerApiVersion } from "mongodb";
import mongoose from "mongoose";


interface GlobalMongo {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
}

declare global {
    // eslint-disable-next-line no-var
    var mongoose: GlobalMongo | undefined;
}


const MONGODB_URI = process.env.DB_URI;
const DB_NAME = process.env.DB_NAME;
if(!MONGODB_URI || !DB_NAME ) throw new Error('請在環境變數中設定 MONGODB_URI 以及 DB_NAME');


const cached: GlobalMongo = global.mongoose || { conn: null, promise: null };

if (!global.mongoose) {
    global.mongoose = cached;
}

async function connectDB() {
    if (cached.conn) {
        console.log('使用已存在的 MongoDB 連接');
        return cached.conn;
    }

    if (!cached.promise) {
        const opts = {
            bufferCommands: true,
            maxPoolSize: 10,
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
            family: 4,
            retryWrites: true,
            retryReads: true,
            dbName: DB_NAME
        };

        console.log('正在建立新的 MongoDB 連接...');
        cached.promise = mongoose.connect(MONGODB_URI!, opts)
            .then((mongoose) => {
                console.log('MongoDB 連接成功');
                mongoose.set('debug', { 
                    shell: true,
                    color: true
                });
            
                // 監聽所有 MongoDB 事件
                const db = mongoose.connection;
                db.on('error', (error) => console.error('MongoDB 錯誤:', error));
                db.on('disconnected', () => console.log('MongoDB 連接斷開'));
                db.on('reconnected', () => console.log('MongoDB 重新連接'));
                db.on('connected', () => console.log('MongoDB 已連接'));
                
                return mongoose;
            })
            .catch((error) => {
                console.error('MongoDB 連接失敗:', error);
                throw error;
            });
    }

    try {
        cached.conn = await cached.promise;
        console.log('MongoDB 連接狀態:', mongoose.connection.readyState);
        return cached.conn;
    } catch (e) {
        cached.promise = null;
        throw e;
    }
}

export default connectDB; 