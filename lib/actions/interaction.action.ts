"use server"

import Question from "@/database/question.model";
import { connectToDatabase } from "../mongoose";
import { ViewQuestionParams } from "./shared.types";
import Interaction from "@/database/interaction.model";

export async function viewQuestion(params: ViewQuestionParams) {
    try {
        await connectToDatabase();
        const { questionId, userId } = params;
        // Update view count for the qustion we are currently viewing
        await Question.findByIdAndUpdate(questionId, {
            $inc: { views: 1 }
        });
        if (userId) {
            const existingInteration = await Interaction.findOne({ user: userId, action: 'view', question: questionId });
            if (existingInteration) {
                return console.log('User has already view the question.');
            }

            //  create interaction
            await Interaction.create({
                user: userId,
                action: 'view',
                question: questionId
            })
        }
    }
    catch (e) {
        console.log(e);
        throw e;
    }
}