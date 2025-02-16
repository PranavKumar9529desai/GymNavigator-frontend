import React from "react";
interface FormErrorPropsType {
  message: string;
  type: "success" | "fail";
}
import { CheckCircle } from "lucide-react";
import { BsExclamationCircle } from "react-icons/bs";
export default function FormError({
  FormErrorProps,
}: {
  FormErrorProps: FormErrorPropsType;
}) {
  return (
    <div className="text-center h-6  flex *:rounded-lg ">
      {FormErrorProps && FormErrorProps.type === "fail" ? (
        <div className="w-full bg-red-100 h-full flex items-center gap-1 justify-center">
          <BsExclamationCircle className=" w-4 h-4 text-red-600 " />
          <p className="text-sm text-red-600 ">{FormErrorProps.message} </p>
        </div>
      ) : (
        <div className="w-full bg-green-100 h-full flex items-center gap-1 justify-center">
          <CheckCircle className="w-4 h-4 text-green-600 flex items-center gap-1" />
          <p className="text-green-700 text-sm">{FormErrorProps.message}</p>
        </div>
      )}
    </div>
  );
}
