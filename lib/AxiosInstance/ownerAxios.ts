"use server";
import { auth } from "@/app/(auth)/auth";
import axios, { type AxiosInstance } from "axios";

export const OwnerReqConfig = async (): Promise<AxiosInstance> => {
  const session = await auth();
  console.log("session from the owner axios", session?.user);
  const ownerAxios: AxiosInstance = await axios.create({
    baseURL: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/owner`,
    headers: {
      Authorization: `${JSON.stringify(session)}`,
    },
  });

  return ownerAxios;
};
