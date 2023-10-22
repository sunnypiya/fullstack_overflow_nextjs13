import Question from "@/components/forms/Question";
import { getuserById } from "@/lib/actions/user.action";
import { redirect } from "next/navigation";
import React from "react";

async function AskQuestion() {
  // const { userId } = auth();
  const userId = "123456";
  //console.log(userId);

  if (!userId) redirect("./sign-in");
  const mongoUser = await getuserById({ userId });
  //console.log(mongoUser);
  return (
    <div>
      <h1 className="h1-bold text-dark100_light900">Ask a Question</h1>
      <div className="mt-9">
        <Question mongoUserId={JSON.stringify(mongoUser._id)} />
      </div>
    </div>
  );
}

export default AskQuestion;
