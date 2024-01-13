"use client";

import { downvoteAnswer, upvoteAnswer } from "@/lib/actions/answer.action";
import { viewQuestion } from "@/lib/actions/interaction.action";
import {
  downvoteQuestion,
  upvoteQuestion,
} from "@/lib/actions/question.action";
import { toggleSaveQuestion } from "@/lib/actions/user.action";
import { formatNumber } from "@/lib/utils";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect } from "react";
interface Props {
  hasSaved?: boolean;
  hasDownVoted: boolean;
  downvotes: number;
  hasUpVoted: boolean;
  upvotes: number;
  userId: string;
  itemId: string;
  type: string;
}
const Votes = async ({
  hasSaved,
  hasDownVoted,
  downvotes,
  hasUpVoted,
  upvotes,
  userId,
  itemId,
  type,
}: Props) => {
  const router = useRouter();
  const pathname = usePathname();
  const handleVote = async (action: string) => {
    if (!userId) return;

    if (action === "upvote") {
      if (type === "question") {
        const result = await upvoteQuestion({
          path: pathname,
          hasupVoted: hasUpVoted,
          hasdownVoted: hasDownVoted,
          questionId: JSON.parse(itemId),
          userId: JSON.parse(userId),
        });
      } else if (type === "answer") {
        const result = await upvoteAnswer({
          path: pathname,
          hasupVoted: hasUpVoted,
          hasdownVoted: hasDownVoted,
          answerId: JSON.parse(itemId),
          userId: JSON.parse(userId),
        });
      }
      // TODO : show a toast
      return;
    }

    if (action === "downvote") {
      if (type === "question") {
        const result = await downvoteQuestion({
          path: pathname,
          hasupVoted: hasUpVoted,
          hasdownVoted: hasDownVoted,
          questionId: JSON.parse(itemId),
          userId: JSON.parse(userId),
        });
      } else if (type === "answer") {
        const result = await downvoteAnswer({
          path: pathname,
          hasupVoted: hasUpVoted,
          hasdownVoted: hasDownVoted,
          answerId: JSON.parse(itemId),
          userId: JSON.parse(userId),
        });
      }
    }
  };
  const handleSave = async () => {
    await toggleSaveQuestion({
      userId: JSON.parse(userId),
      path: pathname,
      questionId: JSON.parse(itemId),
    });
  };

  useEffect(() => {
    viewQuestion({
      questionId: JSON.parse(itemId),
      userId: userId ? JSON.parse(userId) : undefined,
    });
  }, [itemId, userId, pathname, router]);
  return (
    <div className="flex gap-5">
      <div className="flex-center gap-2.5">
        <div className="flex-center gap-1.5">
          <Image
            src={
              hasUpVoted
                ? "/assets/icons/upvoted.svg"
                : "/assets/icons/upvote.svg"
            }
            height={18}
            width={18}
            alt="upvote"
            className="cursor-pointer"
            onClick={() => {
              handleVote("upvote");
            }}
          />
          <div className="flex-center background-light700_dark400 min-w-[18px] rounded-sm p-1">
            <p className="subtle-medium text-dark400_light900">
              {formatNumber(upvotes)}
            </p>
          </div>
        </div>
        <div className="flex-center gap-1.5">
          <Image
            src={
              hasDownVoted
                ? "/assets/icons/downvoted.svg"
                : "/assets/icons/downvote.svg"
            }
            height={18}
            width={18}
            alt="upvote"
            className="cursor-pointer"
            onClick={() => {
              handleVote("downvote");
            }}
          />
          <div className="flex-center background-light700_dark400 min-w-[18px] rounded-sm p-1">
            <p className="subtle-medium text-dark400_light900">
              {formatNumber(downvotes)}
            </p>
          </div>
        </div>
      </div>
      {type === "question" && (
        <Image
          src={
            hasSaved
              ? "/assets/icons/star-filled.svg"
              : "/assets/icons/star-red.svg"
          }
          height={18}
          width={18}
          alt="star"
          className="cursor-pointer"
          onClick={handleSave}
        />
      )}
    </div>
  );
};

export default Votes;
