import { connectToDB } from "@utils/database";
import Prompt from "@models/prompt";
import { TUser } from "@models/user";

export const POST = async (req: Request) => {
  const { prompt, userId, tag } = await req.json();

  try {
    await connectToDB();
    const newPrompt = new Prompt({
      creator: userId,
      tag: tag,
      prompt: prompt,
    });

    await newPrompt.save();

    return new Response(JSON.stringify(newPrompt), {
      headers: {
        "Content-Type": "application/json",
      },
      status: 201,
    });
  } catch (error) {
    console.error(error);

    return new Response(JSON.stringify(error), {
      headers: {
        "Content-Type": "application/json",
      },
      status: 500,
    });
  }
};

export const GET = async (req: Request) => {
  try {
    await connectToDB();

    const prompts = await Prompt.find({}).populate<TUser>("creator");

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
