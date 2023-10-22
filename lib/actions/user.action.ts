"use server";

import User from "@/database/user.model";
import { connectToDatabase } from "../mongoose";
import { CreateUserParams, DeleteUserParams, UpdateUserParams } from "./shared.types";
import { revalidatePath } from "next/cache";
import Question from "@/database/question.model";

export async function createUser(userData: CreateUserParams) {
    try {
        connectToDatabase();
        const newUser = await User.create(userData);

        return newUser;
    } catch (e) {
        console.log('error while creating the user', e);
        throw e;
    }
}
export async function deleteUser(userData: DeleteUserParams) {
    try {
        connectToDatabase();
        const { clerkId } = userData;
        const user = await User.findByIdAndDelete({ clerkId });
        if (!deleteUser) {
            throw new Error('User not found!!!');
        }

        // delete the everything that the user ever done
        // 1. delete user from db
        // 2. questions, answers, comments, etc.

        // get user questions ids
        // const userQuestionIds = await Question.find({ author: user._id }).distinct('_id');

        // Now deleting user questions
        await Question.deleteMany({ author: user._id });

        // TODO we will need to delete the answers, comments, etc using userQuestionIds

        const deletedUser = await User.findByIdAndDelete(user._id);
        return deletedUser;

    } catch (e) {
        console.log('error while deleting the user by Id', e);
        throw e;
    }
}
export async function updateUser(userData: UpdateUserParams) {
    try {
        connectToDatabase();
        const { clerkId, updateData, path } = userData;
        // const newUser = 
        await User.findOneAndUpdate({ clerkId }, updateData, { new: true });

        revalidatePath(path);
    } catch (e) {
        console.log('error while fetching the user by Id', e);
        throw e;
    }
}

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