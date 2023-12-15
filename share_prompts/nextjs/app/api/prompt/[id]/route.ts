import Prompt from "@models/prompt";
import { TUser } from "@models/user";
import { connectToDB } from "@utils/database";

// GET (read)
export const GET = async (req: Request, { params }: { params: { id: string } }) => {
  try {
    await connectToDB();

    const prompt = await Prompt.findById(params.id).populate<TUser>("creator");

    return new Response(JSON.stringify(prompt), {
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

// PATCH (update)
export const PATCH = async (req: Request, { params }: { params: { id: string } }) => {
    const { prompt, tag } = await req.json()
    try {
        await connectToDB();

        const existingPrompt = await Prompt.findById(params.id);

        if (!existingPrompt) {
            return new Response("Prompt not found", { status: 404 });
        }

        existingPrompt.prompt = prompt;
        existingPrompt.tag = tag;

        await existingPrompt.save();

        return new Response(JSON.stringify(existingPrompt), { status: 200 });
    } catch (error) {
        return new Response("Failed to update prompt", { status: 500 });
    }
}

// DELETE (delete)
export const DELETE = async (req: Request, { params }: { params: { id: string } }) => {
    try {
        await connectToDB();

        await Prompt.findByIdAndDelete(params.id);

        return new Response("Prompt deleted successfully", { status: 200 });
    } catch (error) {
        return new Response("Failed to delete prompt", { status: 500 });
    }
}