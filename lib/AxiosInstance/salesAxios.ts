// FILE: salesAxios.ts

'use server';
import { auth } from '@/app/(auth)/auth';
import axios, { type AxiosInstance } from 'axios';

export const SalesReqConfig = async (): Promise<AxiosInstance> => {
  const session = await auth();

  const salesAxios: AxiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
    headers: {
      Authorization: `${JSON.stringify(session)}`,
    },
  });
  console.log('salesAxios from the salesAxios file is ', salesAxios);

  return salesAxios;
};
