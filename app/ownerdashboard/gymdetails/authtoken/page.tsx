import CreateTokenButton from './createTokenButton';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { CheckCircle2 } from 'lucide-react';
import { OwnerReqConfig } from '@/lib/AxiosInstance/ownerAxios';

async function getExistingToken() {
  'use server';
  const ownerAxios = await OwnerReqConfig();
  const response = await ownerAxios.get(`/getauthtoken`);
  return response.data.token;
}

export default async function AuthTokenPage() {
  const existingToken = await getExistingToken();
  console.log('existingToken', existingToken);
  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Authentication Token</CardTitle>
        </CardHeader>
        <CardContent>
          {existingToken ? (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircle2 className="w-5 h-5" />
                <span>Active Token</span>
              </div>
              <div className="p-4 bg-gray-50 rounded-md font-mono">
                {existingToken}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-gray-600">
                No active token found. Generate a new authentication token for
                your gym.
              </p>
              <CreateTokenButton existingToken={existingToken} />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
