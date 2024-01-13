'use server';

import Question from "@/database/question.model";
import { connectToDatabase } from "../mongoose";
import Tag from "@/database/tag.model";
import { GetQuestionsParams, CreateQuestionParams, GetQuestionByIdParams, QuestionVoteParams } from "./shared.types";
import User from "@/database/user.model";
import { revalidatePath } from "next/cache";

export async function getQuestionns(parms: GetQuestionsParams) {
    try {
        connectToDatabase();
        const questions = await Question.find({})
            .populate({ path: 'tags', model: Tag })
            .populate({ path: 'author', model: User })
            .sort({ createdAt: -1 });

        return { questions };
    }
    catch (error) {
        console.log('getQuestionns: ', error);
        throw error;
    }
}

export async function getQuestionnId(parms: GetQuestionByIdParams) {
    try {
        connectToDatabase();
        const { questionId } = parms;
        const question = await Question.findById(questionId)
            .populate({ path: 'tags', model: Tag })
            .populate({ path: 'author', model: User })
            .sort({ createdAt: -1 });

        return question;
    }
    catch (error) {
        console.log('getQuestionns: ', error);
        throw error;
    }
}

export async function createQuestion(params: CreateQuestionParams) {
    // const { ObjectId } = Types;
    try {
        await connectToDatabase();
        const { title, content, tags, author, path } = params;

        // Create a question
        console.log('author', author);
        const question = await Question.create({
            title,
            content,
            author
        });


        const tagDocuments = [];

        // create the tags or get them if they already exist

        for (const tag of tags) {
            const existingTag = await Tag.findOneAndUpdate(
                { name: { $regex: new RegExp(`^${tag}$`, "i") } },
                { $setOnInsert: { name: tag }, $push: { questions: question._id } },
                { upsert: true, new: true }
            )
            tagDocuments.push(existingTag._id);
        }

        await Question.findByIdAndUpdate(question._id, {
            $push: { tags: { $each: tagDocuments } }
        });



        revalidatePath(path);
        return true;
    }
    catch (e) {
        console.log(e);
    }
}

export async function upvoteQuestion(params: QuestionVoteParams) {
    try {
        connectToDatabase();
        const { userId, questionId, hasdownVoted, hasupVoted, path } = params;
        let updateQuery = {};

        if (hasupVoted) {
            updateQuery = { $pull: { upvotes: userId } }
        } else if (hasdownVoted) {
            updateQuery = {
                $pull: { downvotes: userId },
                $push: { upvotes: userId }
            }
        } else {
            updateQuery = { $addToSet: { upvotes: userId } }
        }

        const question = await Question.findByIdAndUpdate(questionId, updateQuery, { new: true });

        console.clear();
        console.log('question', question);
        console.log('userId', userId);
        if (!question) { throw new Error("Question not found"); }

        // Increment author's reputation by +10 for upvoting a question
        revalidatePath(path);
    } catch (e) {
        console.log('error while fetching the upvoting the question', e);
        throw e;
    }
}

export async function downvoteQuestion(params: QuestionVoteParams) {
    try {
        connectToDatabase();
        const { userId, questionId, hasdownVoted, hasupVoted, path } = params;
        let updateQuery = {};

        if (hasdownVoted) {
            updateQuery = { $pull: { downvotes: userId } }
        }
        else if (hasupVoted) {
            updateQuery = { $pull: { upvotes: userId }, $push: { downvotes: userId } }
        }
        else {
            updateQuery = { $addToSet: { downvotes: userId } }
        }

        const question = await Question.findByIdAndUpdate(questionId, updateQuery, { new: true });
        console.clear();
        console.log('question', question);
        if (!question) { throw new Error("Question not found"); }

        // Increment author's reputation by +10 for upvoting a question
        revalidatePath(path);
    } catch (e) {
        console.log('error while fetching the upvoting the question', e);
        throw e;
    }
}