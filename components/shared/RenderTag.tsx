"use client";
import Link from "next/link";
import React from "react";
import { Badge } from "../ui/badge";

interface Props {
  _id: string;
  name: string;
  totalQuestions: number;
  showCount: Boolean;
}
const RenderTag = ({ _id, name, totalQuestions, showCount }: Props) => {
  return (
    <div>
      <Link
        href={`/tags/${_id}`}
        key={_id}
        className="flex cursor-pointer items-center justify-between gap-7"
      >
        <Badge className="subtle-medium background-light800_dark300 text-light400_light500 rounded-md border-none px-4 py-2">
          {name}
        </Badge>
        {showCount && (
          <p className="small-medium text-dark500_light700 ">
            {totalQuestions}
          </p>
        )}
      </Link>
    </div>
  );
};

export default RenderTag;
