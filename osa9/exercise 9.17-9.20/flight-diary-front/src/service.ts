import axios from 'axios';
import type { DiaryEntry, NewDiaryEntry } from "./types";

const baseUrl = '/api/diaries'

export const getAllDiaries = async () => {
  try {
    const response = await axios.get<DiaryEntry[]>(baseUrl);
    return response.data;
  } catch (error) {
    console.error("Error fetching diaries:", error);
    throw error;
  }
}

export const createDiary = async (object: NewDiaryEntry) => {
  try {
    const response = await axios.post<DiaryEntry>(baseUrl, object);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      const errorMessage = error.response.data;
      throw new Error(typeof errorMessage === 'string' ? errorMessage : 'Validation error occurred');
    } else {
      throw new Error('An unexpected error occurred');
    }
  }
}