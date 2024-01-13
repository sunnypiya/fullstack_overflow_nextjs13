import UserCard from "@/components/cards/UserCard";
import Question from "@/components/forms/Question";
import HomeFilters from "@/components/home/HomeFilters";
import QuestionCard from "@/components/cards/QuestionCards";
import Filter from "@/components/shared/Filter";
import NoResult from "@/components/shared/NoResult";
import LocalSearchBar from "@/components/shared/search/LocalSearchBar";
import { UserFilters } from "@/constants/filters";
import { getQuestionns } from "@/lib/actions/question.action";
import { getuserById, getAllUsers } from "@/lib/actions/user.action";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import React from "react";

async function Page() {
  const { userId } = auth();

  if (!userId) redirect("./sign-in");
  const mongoUser = await getuserById({ userId });
  // Fetching the question data from DB
  const result = await getAllUsers({});
  //console.log(result.questions);
  console.clear();
  console.log(result.users);

  return (
    <>
      <h1 className="h1-bold text-dark100_light900">All Users</h1>

      <div className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
        <LocalSearchBar
          placeHolder={"Search amazing minds here..."}
          route={"/community"}
          iconPosition={"left"}
          imgSrc={"/assets/icons/search.svg"}
          otherClasses={"flex-1"}
        />
        <Filter
          filters={UserFilters}
          otherClasses="min-h-[56px] sm:min-w-[170px]"
        />
      </div>

      <section className="mt-12 flex w-full flex-wrap gap-6">
        {/* {looping through users} */}
        {result.users.length > 0 ? (
          result.users.map((item) => <UserCard key={item._id} user={item} />)
        ) : (
          <NoResult
            title="No Users yet"
            description={""}
            link="/sign-up"
            linkTitle="Join to be the first!"
            showImages={false}
          />
        )}
      </section>
    </>
  );
}

export default Page;
