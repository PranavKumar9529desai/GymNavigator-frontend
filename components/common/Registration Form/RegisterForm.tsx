"use client";
import { getUserByEmail } from "@/app/(common)/_actions/auth/get-userinfo";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Lock, Mail, User, UserRoundCogIcon } from "lucide-react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { Button } from "../../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import FormError from "../../ui/form-error";
import GoogleButton from "../../ui/googleButton";
import { Input } from "../../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";
import SignIn from "../Auth/Signin";
import { type RegisterFormValues, registerSchema } from "./register-schema";

// Remove the formSchema definition as it's now in register-schema.ts

export default function RegisterForm() {
  const [error, seterror] = useState<string>("");
  const [type, settype] = useState<"success" | "fail" | null>();
  const [ispending, startTransition] = useTransition();
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      password: "",
      name: "",
      role: undefined,
    },
  });

  const {
    formState: { errors },
  } = form;

  async function onSubmit(values: RegisterFormValues) {
    console.log("form is submitted values", values);
    const { email, password, name, role } = values;
    startTransition(async () => {
      try {
        // Check if the user already exists using the new getUserByEmail function
        const userExistsResponse = await getUserByEmail(email);

        if (userExistsResponse.success) {
          // If the call was successful, it means the user exists
          settype("fail");
          seterror("Email is already registered");
          return;
        }

        // If we reach here, the user doesn't exist, so we can proceed with registration
        settype("success");
        const signInResult = await signIn("credentials", {
          name,
          password,
          email,
          role,
          redirect: false,
        });

        if (signInResult?.error) {
          settype("fail");
          try {
            const errorData = JSON.parse(signInResult.error);
            switch (errorData.error) {
              case "USER_NOT_FOUND":
                seterror("Registration failed: Account not found");
                break;
              case "INVALID_PASSWORD":
                seterror("Registration failed: Password error");
                break;
              case "SERVER_ERROR":
                seterror("Registration failed: Please try again later");
                break;
              default:
                seterror(errorData.message || "Registration failed");
            }
          } catch {
            seterror("Registration failed");
          }
        } else {
          seterror("Account created successfully");
          router.refresh();
        }
      } catch (error) {
        settype("fail");
        seterror("An unexpected error occurred");
        console.error("Registration error:", error);
      }
    });
  }

  async function handleGoogleSubmit() {
    console.log("role from the form", form.getValues("role"));
    startTransition(async () => {
      const result = await signIn("google", {
        redirect: true,
        redirectTo: "/selectrole",
      });
      console.log("result from the google signin", result?.status);
    });
  }

  return (
    <>
      <Card className="w-full max-w-md mx-auto shadow-xl rounded-xl border border-blue-500/20 bg-gradient-to-b from-blue-900/40 to-black/60 backdrop-blur-md">
        <CardHeader className="space-y-3 pb-8">
          <CardTitle className="text-3xl font-bold text-center bg-gradient-to-r from-blue-400 to-blue-500 bg-clip-text text-transparent">
            Create Account
          </CardTitle>
          <p className="text-sm text-center text-gray-300">
            Enter your details to create your account
          </p>
        </CardHeader>
        <CardContent className="space-y-8">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="space-y-1">
                    {/* @ts-ignore */}
                    <FormLabel className="text-sm font-medium text-gray-300">
                      <div className="flex items-center space-x-2">
                        <User
                          className={`w-4 h-4 ${
                            errors.name ? "text-destructive" : "text-blue-400"
                          }`}
                        />
                        <span>Username</span>
                      </div>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Username"
                        {...field}
                        disabled={ispending}
                        type="text"
                        className="bg-blue-950/30 border-blue-500/30 text-white placeholder:text-gray-400"
                      />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="space-y-1">
                      {/* @ts-ignore */}
                      <FormLabel className="text-sm font-medium text-gray-300">
                        <div className="flex items-center space-x-2">
                          <Mail
                            className={`w-4 h-4 ${
                              errors.email
                                ? "text-destructive"
                                : "text-blue-400"
                            }`}
                          />
                          <span>Email</span>
                        </div>
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="your@email.com"
                          {...field}
                          type="email"
                          disabled={ispending}
                          className="bg-blue-950/30 border-blue-500/30 text-white placeholder:text-gray-400"
                        />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem className="space-y-1">
                      {/* @ts-ignore */}
                      <FormLabel className="text-sm font-medium text-gray-300">
                        <div className="flex items-center space-x-2">
                          <Lock
                            className={`w-4 h-4 ${
                              errors.password
                                ? "text-destructive"
                                : "text-blue-400"
                            }`}
                          />
                          <span>Password</span>
                        </div>
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            placeholder="••••••••"
                            {...field}
                            disabled={ispending}
                            type={showPassword ? "text" : "password"}
                            className="bg-blue-950/30 border-blue-500/30 text-white placeholder:text-gray-400 pr-10"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-400 hover:text-blue-300 transition-colors"
                          >
                            {showPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem className="space-y-1 w-full mt-4">
                    {/* @ts-ignore */}
                    <FormLabel className="text-sm font-medium text-gray-300">
                      <div className="flex items-center space-x-2">
                        <UserRoundCogIcon
                          className={`w-4 h-4 ${
                            errors.role ? "text-destructive" : "text-blue-400"
                          }`}
                        />
                        <span>Role</span>
                      </div>
                    </FormLabel>
                    <Select
                      onValueChange={(value) => field.onChange(value)}
                      value={field.value}
                      disabled={ispending}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full bg-blue-950/30 border-blue-500/30 text-white">
                          <SelectValue placeholder="Select your Role" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="z-50 bg-blue-900/80 backdrop-blur-md border-blue-500/30 text-white">
                        <SelectItem
                          value="owner"
                          className="hover:bg-blue-800/50"
                        >
                          Gym Owner
                        </SelectItem>
                        <SelectItem
                          value="trainer"
                          className="hover:bg-blue-800/50"
                        >
                          Trainer
                        </SelectItem>
                        <SelectItem
                          value="client"
                          className="hover:bg-blue-800/50"
                        >
                          Client
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
              <Button
                className="w-full font-semibold bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-lg relative z-10"
                type="submit"
                disabled={ispending}
                size="lg"
              >
                {ispending ? (
                  <div className="flex items-center space-x-2">
                    <span className="animate-spin">⚪</span>
                    <span>Registering...</span>
                  </div>
                ) : (
                  "Create Account"
                )}
              </Button>
            </form>
          </Form>
          {error && type ? (
            <FormError
              FormErrorProps={{
                message: error,
                type: type as "success" | "fail",
              }}
            />
          ) : null}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-blue-500/30" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-blue-900/20 px-2 text-gray-300">
                Or continue with
              </span>
            </div>
          </div>
          <GoogleButton handleSubmit={handleGoogleSubmit} />
          <div className="text-center text-sm text-gray-300">
            Already have an account?{" "}
            <a
              href="/signin"
              className="hover:underline font-medium text-blue-400"
            >
              Sign In
            </a>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
