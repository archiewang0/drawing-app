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
        name: 'archietest',
        email: 'archie@email'
    })
    // console.log('users: ',users)

    await userdata.save()

    //   if (!userCollection) return { errors: { email: "Server error!" } };

    // console.log('userCollection: ' , userCollection) 

    // Redirect
    // redirect("/");
    return {}
}