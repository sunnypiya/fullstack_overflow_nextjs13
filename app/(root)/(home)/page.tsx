import HomeFilters from "@/components/home/HomeFilters";
import QuestionCard from "@/components/home/QuestionCards";
import Filter from "@/components/shared/Filter";
import NoResult from "@/components/shared/NoResult";
import LocalSearchBar from "@/components/shared/search/LocalSearchBar";
import { Button } from "@/components/ui/button";
import { HomePageFilters, QuestionFilters } from "@/constants/filters";
import { getQuestionns } from "@/lib/actions/question.action";
import Link from "next/link";

// const questions = [
//   {
//     _id: "1",
//     title:
//       "Best practices for data fetching in a Next.js application with Server-Side",
//     tags: [
//       {
//         _id: "1",
//         name: "python",
//       },
//       {
//         _id: "2",
//         name: "next.js",
//       },
//     ],
//     author: {
//       _id: "1",
//       name: "John Doe",
//       picture: "url/to/picture.jpg",
//     },
//     upvotes: 15000000,
//     answers: [], // An empty array for answers, you might want to populate this with actual answer objects
//     views: 1000000,
//     createdAt: new Date("2022-09-01T12:00:00.000Z"),
//   },
//   {
//     _id: "2",
//     title: "Redux Toolkit Not Updating State as Expected",
//     tags: [
//       {
//         _id: "1",
//         name: "REACT.JS",
//       },
//       {
//         _id: "2",
//         name: "Redux",
//       },
//     ],
//     author: {
//       _id: "2",
//       name: "Sk Arya",
//       picture: "url/to/another-picture.jpg",
//     },
//     upvotes: 100,
//     answers: [], // An empty array for answers, you might want to populate this with actual answer objects
//     views: 1000,
//     createdAt: new Date("2023-08-05T12:00:00.000Z"),
//   },
// ];

export default async function Home() {
  // Fetching the question data from DB
  const result = await getQuestionns({});
  console.log(result.questions);

  return (
    <>
      <div className="flex w-full flex-col-reverse justify-between gap-4 sm:flex-row sm:items-center">
        <h1 className="h1-bold text-dark100_light900">All Questions</h1>
        <Link href={"ask-question"} className="flex justify-end max-sm:w-full">
          <Button className="primary-gradient min-h-[46px] px-4 py-3 !text-light-900">
            Ask a Question
          </Button>
        </Link>
      </div>

      <div className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
        <LocalSearchBar
          placeHolder={"Search questions..."}
          route={"./"}
          iconPosition={"left"}
          imgSrc={"/assets/icons/search.svg"}
          otherClasses={"flex-1"}
        />
        <Filter
          filters={HomePageFilters}
          otherClasses="min-h-[56px]  sm:min-w-[170px]"
          containerClasses="hidden max-md:flex"
        />
      </div>
      <HomeFilters />
      <div className="mt-10 flex w-full flex-col gap-6">
        {/* {looping through questions} */}
        {result.questions.length > 0 ? (
          result.questions.map((item) => (
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
            title="There's no questions to show"
            description={
              "Be the first to break the silence! 🚀 Ask a Question and kickstart the discussion. our query could be the next big thing others learn from. Get involved! 💡"
            }
            link="/ask-question"
            linkTitle="Ask a Question"
          />
        )}
      </div>
    </>
  );
}
