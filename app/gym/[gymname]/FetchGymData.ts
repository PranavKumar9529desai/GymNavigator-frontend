'use server';

interface GymDataType {
  name: string;
  id: string;
  img: string;
  address: string;
}

export default async function FetchGymData(
  gymname: string
): Promise<GymDataType | null> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/public/gym/${gymname}`,
      {
        next: { revalidate: 3600 }
      }
    );

    if (!response.ok) {
      console.error(`API request failed with status ${response.status}`);
      return null;
    }

    const data = await response.json();

    if (data.msg === 'success') {
      return data.gym;
    }
    return null;
  } catch (error) {
    console.error('Error fetching gym data:', error);
    return null;
  }
}
