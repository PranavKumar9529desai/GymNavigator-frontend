import uploadImage from '@/app/(common)/_actions/clouldnary/UploadImageSA';
// app/api/upload/route.ts
import { type NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { image } = await req.json();
    console.log('Received image:', image);

    if (!image) {
      return NextResponse.json({ error: 'No image provided' }, { status: 400 });
    }

    const url = await uploadImage(image);
    return NextResponse.json({ msg: 'success', url });
  } catch (error) {
    console.error('Error in upload route:', error);
    return NextResponse.json({ msg: 'failed', error: error }, { status: 500 });
  }
}

// export const config = {
//   api: {
//     bodyParser: {
//       sizeLimit: '10mb', // Adjust the size limit as needed
//     },
//   },

// }
