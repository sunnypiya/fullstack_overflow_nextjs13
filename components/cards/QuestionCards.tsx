import Link from "next/link";
import React from "react";
import RenderTag from "../shared/RenderTag";
import Metric from "../shared/Metric";
import { formatNumber, getTimeStamp } from "@/lib/utils";

interface Props {
  _id: string;
  title: string;
  tags: {
    _id: string;
    name: string;
  }[];
  author: {
    _id: string;
    name: string;
    picture: string;
  };
  upvotes: string[];
  answers: Array<object>;
  views: number;
  createdAt: Date;
}

const QuestionCard = ({
  _id,
  answers,
  author,
  tags,
  title,
  upvotes,
  views,
  createdAt,
}: Props) => {
  return (
    <div className="card-wrapper p-9 sm:px-11 rounded-[10px]">
      <div className="flex flex-col-reverse items-start justify-between gap-5 sm:flex-row">
        <div>
          <span className="subtle-regular text-dark400_light700 line-clamp-1 flex sm:hidden">
            {getTimeStamp(createdAt)}
          </span>
          <Link href={`/questions/${_id}`}>
            <h3 className="sm:h3-semibold base-semibold  text-dark200_light900 line-clamp-1 flex-1">
              {title}
            </h3>
          </Link>
        </div>
        {/* If signedin add edit/delete section */}
      </div>
      <div className="mt-3.5 flex flex-wrap gap-2">
        {tags.map((item) => (
          <RenderTag
            key={item._id}
            name={item.name}
            _id={item._id}
            showCount={false}
            totalQuestions={0}
          />
        ))}
      </div>

      <div className="flex-between mt-6 w-full flex-wrap gap-3">
        <Metric
          imgUrl={author.picture}
          alt="user"
          value={author.name}
          title={` - asked ${getTimeStamp(createdAt)}`}
          textStyles={"body-medium text-dark400_light700"}
          href={`/profile/${author._id}`}
          isAuthor={true}
        />
        <Metric
          imgUrl={"/assets/icons/like.svg"}
          alt="Upvotes"
          value={formatNumber(upvotes.length)}
          title=" Votes"
          textStyles={"small-medium text-dark400_light800"}
          href="/"
          isAuthor={true}
        />
        <Metric
          imgUrl={"/assets/icons/message.svg"}
          alt="Message"
          value={formatNumber(answers.length)}
          title=" Answers"
          textStyles={"small-medium text-dark400_light800"}
          href="/"
          isAuthor={true}
        />
        <Metric
          imgUrl={"/assets/icons/eye.svg"}
          alt="eye"
          value={formatNumber(views)}
          title=" Views"
          textStyles={"small-medium text-dark400_light800"}
          href="/"
          isAuthor={true}
        />
      </div>
    </div>
  );
};

export default QuestionCard;
