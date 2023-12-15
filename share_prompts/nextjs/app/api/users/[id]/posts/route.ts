import Prompt from "@models/prompt";
import { TUser } from "@models/user";
import { connectToDB } from "@utils/database";

export const GET = async (req: Request, { params }: { params: { id: string } }) => {
  try {
    await connectToDB();

    const prompts = await Prompt.find({creator: params.id}).populate<TUser>("creator");

    return new Response(JSON.stringify(prompts), {
      headers: {
        "Content-Type": "application/json",
      },
      status: 200,
    });
  } catch (error) {
    console.error(error);

    return new Response("Failed to fetch all prompts", {
      status: 500,
    });
  }
};