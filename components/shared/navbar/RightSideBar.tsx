import Image from "next/image";
import Link from "next/link";
import React from "react";
import RenderTag from "../RenderTag";

const RightSideBar = () => {
  const topQuestions = [
    {
      _id: 1,
      title:
        "Best practices for data fetching in a Next.js application with Server-Side Rendering (SSR)?",
    },
    {
      _id: 2,
      title: "Can I get the course for free?",
    },
    {
      _id: 3,
      title: "Redux Toolkit Not Updating State as Expected",
    },
    {
      _id: 4,
      title: "Async/Await Function Not Handling Errors Properly",
    },
    {
      _id: 5,
      title: "How do I use express as a custom server in NextJS?",
    },
  ];
  const PolularTags = [
    {
      _id: "1",
      tag: "Next.Js",
      totalQuestions: 3,
    },
    {
      _id: "1",
      tag: "Next.Js",
      totalQuestions: 3,
    },
    {
      _id: "2",
      tag: "Javascript",
      totalQuestions: 2,
    },
    {
      _id: "3",
      tag: "Demo",
      totalQuestions: 2,
    },
    {
      _id: "4",
      tag: "React.Js",
      totalQuestions: 2,
    },
  ];
  return (
    <section className="background-light900_dark200 light-border sticky right-0 top-0 flex h-screen flex-col overflow-y-auto border-l p-6 pt-36 shadow-light-300 dark:shadow-none max-xl:hidden lg:w-[356px]">
      <div className="">
        <h3 className="h3-bold text-dark200_light900">Top Questions</h3>
        <div className="mt-7 flex w-full flex-col gap-[30px]">
          {topQuestions.map((item) => (
            <Link
              href={`/questions/${item._id}`}
              key={item._id}
              className="flex cursor-pointer items-center justify-between gap-7"
            >
              <p className="body-medium text-dark500_light700">{item.title}</p>
              <Image
                src={"/assets/icons/chevron-right.svg"}
                width={20}
                height={20}
                alt="chevron right"
                className="invert-colors"
              />
            </Link>
          ))}
        </div>
      </div>
      <div className="mt-16">
        <h3 className="h3-bold text-dark200_light900">Tags</h3>
        <div className="mt-7 flex w-full flex-col gap-[30px]">
          {PolularTags.map((item) => (
            <RenderTag
              key={item._id}
              _id={item._id}
              name={item.tag}
              totalQuestions={item.totalQuestions}
              showCount
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default RightSideBar;
