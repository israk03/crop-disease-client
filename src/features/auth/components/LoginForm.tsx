"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Leaf, Loader2 } from "lucide-react";

import {
  loginSchema,
  type LoginFormValues,
} from "@/schemas/auth.schema";

import { useAuth } from "@/features/auth/hooks/use-auth";
import { ROUTES } from "@/constants/routes";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

export function LoginForm() {
  const { login, isLoggingIn } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (values: LoginFormValues) => {
  console.log("FORM SUBMITTED");
  console.log(values);

  login(values);
};

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.35,
        ease: "easeOut",
      }}
      className="w-full max-w-md"
    >
      <div className="rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 space-y-6">
        {/* Header (Branding & Context alignment) */}
        <div className="space-y-2 text-center lg:text-left">
          <div className="flex lg:hidden justify-center mb-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-100 dark:bg-emerald-950/30">
              <Leaf className="h-5 w-5 text-emerald-600" />
            </div>
          </div>

          <h1 className="font-display text-2xl font-bold text-zinc-900 dark:text-zinc-50 tracking-tight">
            Welcome Back
          </h1>

          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Sign in to your AgriSense account to manage fields and diagnostics.
          </p>
        </div>

        {/* Form Body */}
        <Form {...form}>
          <form
            noValidate
            autoComplete="on"
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4"
          >
            {/* Email Address */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                    Email Address
                  </FormLabel>

                  <FormControl>
                    <Input
                      type="email"
                      placeholder="farmer@agrisense.com"
                      autoComplete="email"
                      autoCapitalize="none"
                      autoCorrect="off"
                      spellCheck={false}
                      disabled={isLoggingIn}
                      className="bg-zinc-50/50 focus-visible:ring-emerald-600 dark:bg-zinc-950/40"
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Password */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <div className="flex items-center justify-between">
                    <FormLabel className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                      Password
                    </FormLabel>

                    <Link
                      href="/forgot-password"
                      className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 hover:underline underline-offset-2 transition-colors"
                    >
                      Forgot password?
                    </Link>
                  </div>

                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        autoComplete="current-password"
                        disabled={isLoggingIn}
                        className="pr-10 bg-zinc-50/50 focus-visible:ring-emerald-600 dark:bg-zinc-950/40"
                        {...field}
                      />

                      <button
                        type="button"
                        aria-label={showPassword ? "Hide password" : "Show password"}
                        onClick={() => setShowPassword((prev) => !prev)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors"
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Submit Action */}
            <Button
              type="submit"
              className="w-full mt-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium shadow-sm transition-colors duration-200"
              disabled={isLoggingIn || !form.formState.isValid}
            >
              {isLoggingIn ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Authenticating Credentials...
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>
        </Form>

        {/* Form Switcher */}
        <p className="text-center text-sm text-zinc-500 dark:text-zinc-400 pt-2 border-t border-zinc-100 dark:border-zinc-800">
          Don&apos;t have an account?{" "}
          <Link
            href={ROUTES.REGISTER}
            className="font-semibold text-emerald-600 hover:text-emerald-700 hover:underline underline-offset-4 transition-colors"
          >
            Create account here
          </Link>
        </p>
      </div>
    </motion.div>
  );
}