'use server';

import connectDB from '@/lib/mongodb';
import ModelUser from '@/models/user';

export async function register({
    userId,
    name,
    email,
    canvas = [],
}: {
    userId: string;
    name: string;
    email: string;
    canvas: {
        name?: string;
        drawElements: DrawElement[];
    }[];
}) {
    await connectDB();

    const userdata = new ModelUser({
        userId,
        name,
        email,
        canvas,
    });

    await userdata.save();

    return {};
}
