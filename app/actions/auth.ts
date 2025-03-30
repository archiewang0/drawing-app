"use server";

// import { getCollection } from "@/lib/mongodb";
// import { redirect } from "next/navigation";
import connectDB from "@/lib/mongodb";
import User from "@/models/user";

export async function register() {
    // Check if email is already registered
    // const userCollection = await getCollection("users");

    await connectDB()
    // const users =  await User.find({})

    const userdata = new User({
        name: 'archietest3213213123',
        email: 'archie@email121321x'
    })

    await userdata.save()

    return {}
}