import { Elysia, t } from "elysia";
import { cors } from "@elysiajs/cors";

interface Item {
  id: number;
  name: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

let items: Item[] = [
  {
    id: 1,
    name: "Sample Item 1",
    description: "This is a sample item",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 2,
    name: "Sample Item 2",
    description: "Another sample item",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

let nextId = 3;

const app = new Elysia()
  .use(cors())
  .get("/", () => ({
    message: "Hello World!",
  }))
  .get("/api/items", () => items)
  .get(
    "/api/items/:id",
    ({ params: { id }, error }) => {
      const item = items.find((item) => item.id === Number(id));
      if (!item) {
        return error(404, { message: "Item not found" });
      }
      return item;
    },
    {
      params: t.Object({
        id: t.String(),
      }),
    },
  )
  .post(
    "/api/items",
    ({ body }) => {
      const newItem: Item = {
        id: nextId++,
        name: body.name,
        description: body.description,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      items.push(newItem);
      return newItem;
    },
    {
      body: t.Object({
        name: t.String({ minLength: 1 }),
        description: t.String(),
      }),
    },
  )
  .put(
    "/api/items/:id",
    ({ params: { id }, body, error }) => {
      const index = items.findIndex((item) => item.id === Number(id));
      if (index === -1) {
        return error(404, { message: "Item not found" });
      }
      items[index] = {
        ...items[index],
        name: body.name,
        description: body.description,
        updatedAt: new Date(),
      };
      return items[index];
    },
    {
      params: t.Object({
        id: t.String(),
      }),
      body: t.Object({
        name: t.String({ minLength: 1 }),
        description: t.String(),
      }),
    },
  )
  .delete(
    "/api/items/:id",
    ({ params: { id }, error }) => {
      const index = items.findIndex((item) => item.id === Number(id));
      if (index === -1) {
        return error(404, { message: "Item not found" });
      }
      const deletedItem = items[index];
      items.splice(index, 1);
      return { message: "Item deleted successfully", item: deletedItem };
    },
    {
      params: t.Object({
        id: t.String(),
      }),
    },
  )
  .listen(3000);

console.log(
  `Elysia is running at http://${app.server?.hostname}:${app.server?.port}`,
);

export type App = typeof app;
