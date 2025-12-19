import { treaty } from "@elysiajs/eden";
import type { App } from "../../../backend/src/index";

/**
 * Eden Treaty API Client
 *
 * This file creates a type-safe API client for communicating with the Elysia backend.
 * Eden Treaty provides end-to-end type safety by importing the backend's App type.
 *
 * Benefits:
 * - Full TypeScript autocomplete for all API endpoints
 * - Compile-time type checking
 * - No need to manually define API types
 * - Automatic inference of request/response types
 */

// Create the Eden Treaty client with the backend URL
// The generic type <App> provides full type safety based on the backend's routes
export const api = treaty<App>("localhost:3000");

/**
 * How to use Eden Treaty:
 *
 * 1. GET all items:
 *    const { data, error } = await api.api.items.get();
 *
 * 2. GET single item by ID:
 *    const { data, error } = await api.api.items({ id: '1' }).get();
 *
 * 3. POST (create) new item:
 *    const { data, error } = await api.api.items.post({
 *      name: 'Item name',
 *      description: 'Item description'
 *    });
 *
 * 4. PUT (update) item:
 *    const { data, error } = await api.api.items({ id: '1' }).put({
 *      name: 'Updated name',
 *      description: 'Updated description'
 *    });
 *
 * 5. DELETE item:
 *    const { data, error } = await api.api.items({ id: '1' }).delete();
 *
 * Response structure:
 * - data: Contains the successful response data (or null if error)
 * - error: Contains error information (or null if successful)
 * - status: HTTP status code
 * - headers: Response headers
 */

// Item interface matching the backend's Item type
export interface Item {
  id: number;
  name: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}
