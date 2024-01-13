'use server';
import Answer from "@/database/answer.model";
import { connectToDatabase } from "../mongoose";
import { AnswerVoteParams, CreateAnswerParams, GetAnswersParams } from "./shared.types";
import { revalidatePath } from "next/cache";
import Question from "@/database/question.model";

export async function createAnswer(params: CreateAnswerParams) {
    try {
        await connectToDatabase();
        const { content, author, path, question } = params;

        console.log('params', params);

        // Create a answer 

        const newAnswer = await Answer.create({
            content,
            author,
            question
        });

        console.log('newAnswer', newAnswer)

        // Add the answer to the questions's answer array
        const updatedQuestion = await Question.findByIdAndUpdate(question, {
            $push: { answers: newAnswer._id },
        }, { upsert: true, new: true })
        console.log('updatedQuestion', updatedQuestion);
        // TODO: Add interration

        revalidatePath(path);
    }
    catch (e) {
        console.log(e);
    }
}

export async function getAnswersByQuestionId(params: GetAnswersParams) {
    try {
        connectToDatabase();
        const { questionId } = params;
        const answers = await Answer.find({ question: questionId })
            .populate('author', "_id clerkId name picture")
            .sort({ createdAt: -1 });

        return { answers };

    }
    catch (error) {
        console.log('error while fettching the answers by question Id', error);
        throw error;
    }


}

export async function upvoteAnswer(params: AnswerVoteParams) {
    try {
        connectToDatabase();
        const { userId, answerId, hasdownVoted, hasupVoted, path } = params;
        let updateQuery = {};

        if (hasupVoted) {
            updateQuery = { $pull: { upvotes: userId } }
            console.log('hasupVoted')
        } else if (hasdownVoted) {
            updateQuery = {
                $pull: { downvotes: userId },
                $push: { upvotes: userId }
            }
            console.log('hasdownVoted')
        } else {
            updateQuery = { $addToSet: { upvotes: userId } }
            console.log('cancel')
        }

        const answer = await Answer.findByIdAndUpdate(answerId, updateQuery, { new: true });

        // console.clear();
        // console.log('question', answer);
        // console.log('userId', userId);
        if (!answer) { throw new Error("Answer not found"); }

        // Increment author's reputation by +10 for upvoting a question
        revalidatePath(path);
    } catch (e) {
        console.log('error while fetching the upvoting the answer', e);
        throw e;
    }
}

export async function downvoteAnswer(params: AnswerVoteParams) {
    try {
        connectToDatabase();
        const { userId, answerId, hasdownVoted, hasupVoted, path } = params;
        let updateQuery = {};

        if (hasdownVoted) {
            updateQuery = { $pull: { downvotes: userId } }
            console.log('hasdownVoted')
        }
        else if (hasupVoted) {
            updateQuery = { $pull: { upvotes: userId }, $push: { downvotes: userId } }
            console.log('hasupVoted')
        }
        else {
            updateQuery = { $addToSet: { downvotes: userId } }
            console.log('Cancel')
        }

        const answer = await Answer.findByIdAndUpdate(answerId, updateQuery, { new: true });
        // console.clear();
        // console.log('question', answer);
        if (!answer) { throw new Error("Answer not found"); }

        // Increment author's reputation by +10 for upvoting a question
        revalidatePath(path);
    } catch (e) {
        console.log('error while fetching the downvoting the Answer', e);
        throw e;
    }
}