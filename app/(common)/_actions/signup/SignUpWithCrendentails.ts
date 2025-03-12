'use server';
import type { AxiosResponse } from 'axios';
import axios from 'axios';
export interface SignupResponse {
  msg: string;
  user: {
    id: string;
    name: string;
    email: string;
    password: string;
  };
}

export default async function SignupSA(
  Role: string,
  name: string,
  email: string,
  password: string,
): Promise<SignupResponse> {
  const role = Role.toLowerCase();
  console.log('role rom, the signupSa ', role, name, email, password);
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/signup/${role}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, password }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = (await response.json()) as SignupResponse;
    console.log('data from the signupsa', data);
    if (!data) {
      throw new Error('No data received');
    }

    return data;
  } catch (error) {
    console.error('Error signing up:', error);
    return {
      msg: 'Error signing up',
      user: { id: '', name: '', email: '', password: '' },
    };
  }
}

export interface UserExistsResponse {
  msg: string;
  user:
    | false
    | {
        name: string;
        password: string;
        email: string;
      };
}

export interface UserExistsFormat {
  msg: string;
  user: {
    name: string;
    email: string;
  } | null;
}
// does the user exists
export async function UserExistsSA(
  email: string,
  name: string,
  password: string,
): Promise<UserExistsFormat> {
  //  return true if user exists and password is correct

  const response: AxiosResponse<UserExistsResponse> = await axios.post(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/signup/isexists`,
    {
      email,
      name,
      password,
    },
    {
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );
  console.log('response is this from  signup credentails ', response.data);
  const user = response.data;

  if (user.user === false) {
    return {
      msg: user.msg,
      user: null,
    };
  }

  const userExists: UserExistsFormat = {
    msg: user.msg,
    user: user.user,
  };

  return userExists;
}
