// integrate cms

import { cms } from "@/config/cms";
import {
  createItem,
  QueryItem,
  readItem,
  readItems,
  updateItem,
  uploadFiles,
} from "@directus/sdk";

/**
 * Fetches items from a Directus collection
 * @param collection - The collection name
 * @param query - Optional query parameters
 * @returns An array of items or null if error
 */
export const getItems = async <T = any>(
  collection: string,
  query?: QueryItem<any, T>,
  options?: { enabled?: boolean }
): Promise<T[] | null> => {
  if (options?.enabled === false) return null;

  try {
    const items = await cms.request<T[]>(
      readItems<T, any, any>(collection, query)
    );
    return items;
  } catch (error) {
    console.error(`Error fetching items from collection ${collection}:`, error);
    return null;
  }
};

export const createItemCMS = async (
  collection: string,
  payload: any
): Promise<any> => {
  try {
    return cms.request(createItem(collection, payload));
  } catch (error) {
    console.error(`Error creating item in collection ${collection}:`, error);
    return null;
  }
};

export const updateItemCMS = async (
  collection: string,
  item_id: string,
  payload: any,
): Promise<any> => {
  try {
    return cms.request(updateItem(collection, item_id, payload));
  } catch (error) {
    console.error(`Error creating item in collection ${collection}:`, error);
    return null;
  }
};

export const uploadFile = async (file: File, folder?: string) => {
  // upload sigle file and return Id
  const formData = new FormData();
  formData.append("file", file);
  if (folder) {
    formData.append("folder", folder);
  }
  const res = await cms.request(uploadFiles(formData));


  return res.id;
};
