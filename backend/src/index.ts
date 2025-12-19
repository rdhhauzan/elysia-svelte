import { Elysia, t } from "elysia";
import { cors } from "@elysiajs/cors";

// In-memory database for simplicity
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
  // GET all items
  .get("/api/items", () => items)
  // GET single item by ID
  .get(
    "/api/items/:id",
    ({ params: { id }, set }) => {
      const item = items.find((item) => item.id === Number(id));
      if (!item) {
        set.status = 404;
        return { message: "Item not found" };
      }
      return item;
    },
    {
      params: t.Object({
        id: t.String(),
      }),
    },
  )
  // CREATE new item
  .post(
    "/api/items",
    ({ body, set }) => {
      const newItem: Item = {
        id: nextId++,
        name: body.name,
        description: body.description,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      items.push(newItem);
      set.status = 201;
      return newItem;
    },
    {
      body: t.Object({
        name: t.String({ minLength: 1 }),
        description: t.String(),
      }),
    },
  )
  // UPDATE item
  .put(
    "/api/items/:id",
    ({ params: { id }, body, set }) => {
      const index = items.findIndex((item) => item.id === Number(id));
      if (index === -1) {
        set.status = 404;
        return { message: "Item not found" };
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
  // DELETE item
  .delete(
    "/api/items/:id",
    ({ params: { id }, set }) => {
      const index = items.findIndex((item) => item.id === Number(id));
      if (index === -1) {
        set.status = 404;
        return { message: "Item not found" };
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
