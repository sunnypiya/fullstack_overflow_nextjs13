'use server';

import Question from "@/database/question.model";
import { connectToDatabase } from "../mongoose";
import Tag from "@/database/tag.model";
import { Types } from 'mongoose';
import { GetQuestionsParams, CreateQuestionParams } from "./shared.types";
import User from "@/database/user.model";

export async function getQuestionns(parms: GetQuestionsParams) {
    try {
        connectToDatabase();
        const questions = await Question.find({})
            .populate({ path: 'tags', model: Tag })
            .populate({ path: 'author', model: User });

        return { questions };
    }
    catch (error) {
        console.log('getQuestionns: ', error);
        throw error;
    }
}

export async function createQuestion(params: CreateQuestionParams) {
    const { ObjectId } = Types;
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
                { $setOnInsert: { name: tag }, $push: { question: question._id } },
                { upsert: true, new: true }
            )
            tagDocuments.push(existingTag._id);
        }

        const ques = await Question.findByIdAndUpdate(question._id, {
            $push: { tags: { $each: tagDocuments } }
        });

        console.log('question', ques);

    }
    catch (e) {
        console.log(e);
    }
    finally {

    }
}