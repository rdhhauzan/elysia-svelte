import { treaty } from "@elysiajs/eden";
import type { App } from "../../../backend/src/index";

export const api = treaty<App>("localhost:3000");

export interface Item {
  id: number;
  name: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}
