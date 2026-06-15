"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Leaf, Loader2, Sprout, UserCheck } from "lucide-react";

import {
  registerSchema,
  RegisterFormValues,
} from "@/schemas/auth.schema";

import { useAuth } from "@/features/auth/hooks/use-auth";
import { ROUTES } from "@/constants/routes";

import { cn } from "@/lib/utils";

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

interface RoleCardProps {
  value: string;
  label: string;
  description: string;
  icon: React.ReactNode;
  selected: boolean;
  onClick: () => void;
}

function RoleCard({
  label,
  description,
  icon,
  selected,
  onClick,
}: RoleCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex-1 relative rounded-xl border p-4 text-left transition-all duration-300 outline-none select-none",
        selected
          ? "border-emerald-600 bg-emerald-50/40 dark:bg-emerald-950/10 ring-1 ring-emerald-600"
          : "border-zinc-200 bg-white hover:border-emerald-600/40 dark:border-zinc-800 dark:bg-zinc-900"
      )}
    >
      <div className={cn(
        "mb-3 flex h-9 w-9 items-center justify-center rounded-lg transition-colors duration-300",
        selected ? "bg-emerald-600 text-white" : "bg-zinc-100 text-zinc-500 dark:bg-zinc-800"
      )}>
        {icon}
      </div>

      <div className="font-semibold text-sm text-zinc-900 dark:text-zinc-50">
        {label}
      </div>

      <div className="mt-1 text-xs text-zinc-500 dark:text-zinc-400 leading-normal">
        {description}
      </div>
      
      {selected && (
        <span className="absolute top-3 right-3 flex h-2 w-2 rounded-full bg-emerald-600" />
      )}
    </button>
  );
}

export function RegisterForm() {
  const { register: registerUser, isRegistering } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: "FARMER",
    },
  });

  const onSubmit = (values: RegisterFormValues) => {
    registerUser({
      name: values.name,
      email: values.email,
      password: values.password,
      role: values.role,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="w-full max-w-md"
    >
      <div className="rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 space-y-6">
        {/* Header (Branding & Form context alignment) */}
        <div className="space-y-2 text-center lg:text-left">
          <div className="flex lg:hidden justify-center mb-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-100 dark:bg-emerald-950/30">
              <Leaf className="h-5 w-5 text-emerald-600" />
            </div>
          </div>

          <h1 className="font-display text-2xl font-bold text-zinc-900 dark:text-zinc-50 tracking-tight">
            Create an Account
          </h1>

          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Get automated disease diagnostic insights and treatment recommendations.
          </p>
        </div>

        {/* Form Body */}
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4"
          >
            {/* Role Radio Selection */}
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="text-zinc-700 dark:text-zinc-300 font-medium text-xs uppercase tracking-wider">
                    Select Identity
                  </FormLabel>

                  <div className="flex gap-3">
                    <RoleCard
                      value="FARMER"
                      label="Farmer"
                      description="Map holdings, crop logs, and upload diagnostics."
                      icon={<Sprout className="h-4 w-4" />}
                      selected={field.value === "FARMER"}
                      onClick={() => field.onChange("FARMER")}
                    />

                    <RoleCard
                      value="EXPERT"
                      label="Expert"
                      description="Authorize sessions, consult cases, and publish insights."
                      icon={<UserCheck className="h-4 w-4" />}
                      selected={field.value === "EXPERT"}
                      onClick={() => field.onChange("EXPERT")}
                    />
                  </div>

                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Full Name */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">Full Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g. Israk Ahmed"
                      autoComplete="name"
                      disabled={isRegistering}
                      className="bg-zinc-50/50 focus-visible:ring-emerald-600 dark:bg-zinc-950/40"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Email Address */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">Email Address</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="farmer@agrisense.com"
                      autoComplete="email"
                      disabled={isRegistering}
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
                  <FormLabel className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        autoComplete="new-password"
                        disabled={isRegistering}
                        className="pr-10 bg-zinc-50/50 focus-visible:ring-emerald-600 dark:bg-zinc-950/40"
                        {...field}
                      />

                      <button
                        type="button"
                        onClick={() => setShowPassword((prev) => !prev)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors"
                        tabIndex={-1}
                        aria-label="Toggle password visibility"
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

            {/* Confirm Password */}
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">Confirm Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showConfirm ? "text" : "password"}
                        placeholder="••••••••"
                        autoComplete="new-password"
                        disabled={isRegistering}
                        className="pr-10 bg-zinc-50/50 focus-visible:ring-emerald-600 dark:bg-zinc-950/40"
                        {...field}
                      />

                      <button
                        type="button"
                        onClick={() => setShowConfirm((prev) => !prev)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors"
                        tabIndex={-1}
                        aria-label="Toggle confirm password visibility"
                      >
                        {showConfirm ? (
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
              disabled={isRegistering}
            >
              {isRegistering ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Provisioning Account...
                </>
              ) : (
                "Register Platform Account"
              )}
            </Button>
          </form>
        </Form>

        {/* Form Switcher */}
        <p className="text-center text-sm text-zinc-500 dark:text-zinc-400 pt-2 border-t border-zinc-100 dark:border-zinc-800">
          Already have an account?{" "}
          <Link
            href={ROUTES.LOGIN}
            className="font-semibold text-emerald-600 hover:text-emerald-700 hover:underline underline-offset-4 transition-colors"
          >
            Sign in here
          </Link>
        </p>
      </div>
    </motion.div>
  );
}