import { TPrompt } from "@models/prompt";
import { TUser } from "@models/user";


export type PopulatedPrompt = Omit<TPrompt, "creator"> & {
  creator: TUser;
};
