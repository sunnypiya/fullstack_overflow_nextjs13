"use server";

import User from "@/database/user.model";
import { connectToDatabase } from "../mongoose";

export async function getuserById(params: any) {
    try {
        connectToDatabase();
        const { userId } = params;
        const user = await User.findOne({ clerkId: userId });

        return user;
    } catch (e) {
        console.log('error while fetching the user by Id', e);
        throw e;
    }
}