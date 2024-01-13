import QuestionCard from "@/components/cards/QuestionCards";
import Filter from "@/components/shared/Filter";
import NoResult from "@/components/shared/NoResult";
import LocalSearchBar from "@/components/shared/search/LocalSearchBar";
import { TagFilters } from "@/constants/filters";
import { IQuestion } from "@/database/question.model";
import { getQuestionsByTagId } from "@/lib/actions/tag.action";
import { URLProps } from "@/types";
import React from "react";

const Page = async ({ params, searchParams }: URLProps) => {
  const result = await getQuestionsByTagId({
    tagId: params?.id,
    searchQuery: searchParams?.q,
  });
  console.log("result", result);
  return (
    <>
      <h1 className="h1-bold text-dark100_light900">{result?.tagTitle}</h1>

      <div className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
        <LocalSearchBar
          placeHolder={"Search tagged questions..."}
          route={"./"}
          iconPosition={"left"}
          imgSrc={"/assets/icons/search.svg"}
          otherClasses={"flex-1"}
        />
        <Filter
          filters={TagFilters}
          otherClasses="min-h-[56px]  sm:min-w-[170px]"
          //   containerClasses="hidden max-md:flex"
        />
      </div>
      {/* <HomeFilters /> */}
      <div className="mt-10 flex w-full flex-col gap-6">
        {/* {looping through questions} */}
        {result.questions.length > 0 ? (
          result.questions.map((item: IQuestion) => (
            <QuestionCard
              key={item._id}
              _id={item._id}
              title={item.title}
              tags={item.tags}
              author={item.author}
              upvotes={item.upvotes}
              answers={item.answers}
              views={item.views}
              createdAt={item.createdAt}
            />
          ))
        ) : (
          <NoResult
            title="There's no tag question saved to show"
            description={
              "Be the first to break the silence! 🚀 Ask a Question and kickstart the discussion. our query could be the next big thing others learn from. Get involved! 💡"
            }
            link="/ask-question"
            linkTitle="Ask a Question"
            showImages={true}
          />
        )}
      </div>
    </>
  );
};

export default Page;
