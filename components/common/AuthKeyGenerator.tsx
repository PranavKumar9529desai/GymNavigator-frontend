// import React, { useState } from "react";
// import { Button } from "@/components/ui/button"; // Hypothetical import, adjust based on your setup
// import fetchToken from "../../app/actions/GetTokenSA"; // Adjust the path as necessary

// const AuthKeyGenerator: React.FC = () => {
//   const [authKey, setAuthKey] = useState<string | null>(null);
//   const [error, setError] = useState<string | null>(null);

//   const generateAuthKey = async () => {
//     try {
//       const token = await fetchToken();
//       if (token) {
//         // Generate a random 10-letter auth key
//         const randomKey = Math.random().toString(36).substring(2, 12).toUpperCase();
//         setAuthKey(randomKey);
//       } else {
//         setError("Failed to fetch token");
//       }
//     } catch (err) {
//       setError("An error occurred while fetching the token");
//     }
//   };

//   return (
//     <div className="flex flex-col items-center justify-center p-4 bg-white shadow-md rounded-lg">
//       <h2 className="text-xl font-bold mb-4">Generate Auth Key</h2>
//       <Button onClick={generateAuthKey} className="mb-4">
//         Generate Key
//       </Button>
//       {authKey && (
//         <div className="text-lg font-mono text-green-600">
//           Auth Key: {authKey}
//         </div>
//       )}
//       {error && (
//         <div className="text-red-600">
//           {error}
//         </div>
//       )}
//     </div>
//   );
// };

// export default AuthKeyGenerator;
