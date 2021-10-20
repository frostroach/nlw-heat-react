import { User } from "./user";

export type Message = {
  created_at: string;
  id: string;
  text: string;
  user: User;
  user_id: string;
};
