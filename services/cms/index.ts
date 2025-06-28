// integrate cms

import { cms } from "@/config/cms";
import {
    createItem,
  QueryItem,
  readItems,
} from "@directus/sdk";

/**
 * Fetches items from a Directus collection
 * @param collection - The collection name
 * @param query - Optional query parameters
 * @returns An array of items or null if error
 */
export const getItem = async <T = any>(
  collection: string,
  query?: QueryItem<any, T>,
  options?: { enabled?: boolean }
): Promise<T[] | null> => {
  if (options?.enabled === false) return null;

  try {
    const items = await cms.request<T[]>(readItems<T, any, any>(collection, query));
    return items;
  } catch (error) {
    console.error(`Error fetching items from collection ${collection}:`, error);
    return null;
  }
};


export const createItemCMS = async (collection: string, payload: any): Promise<any> => {
    try{
        return cms.request(createItem(collection, payload));
    } catch (error) {   
        console.error(`Error creating item in collection ${collection}:`, error);
        return null;
    }
}
