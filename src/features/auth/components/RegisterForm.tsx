"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Leaf, Loader2 } from "lucide-react";

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

function RoleCard({
  label,
  description,
  icon,
  selected,
  onClick,
}: {
  value: string;
  label: string;
  description: string;
  icon: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex-1 rounded-xl border-2 p-3 text-left transition-all duration-200",
        selected
          ? "border-primary bg-primary/5"
          : "border-border bg-card hover:border-primary/50"
      )}
    >
      <div className="mb-2 text-xl">{icon}</div>

      <div className="font-medium text-foreground">
        {label}
      </div>

      <div className="text-xs text-muted-foreground">
        {description}
      </div>
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
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="mx-auto w-full max-w-md"
    >
      <div className="rounded-2xl border bg-card p-6 shadow-card space-y-6">
        {/* Logo */}
        <div className="space-y-3 text-center">
          <div className="flex justify-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
              <Leaf className="h-6 w-6 text-primary" />
            </div>
          </div>

          <div className="space-y-1">
            <h1 className="font-display text-2xl font-bold text-foreground">
              Create your account
            </h1>

            <p className="text-sm text-muted-foreground">
              Join AgriSense and protect your crops with AI
            </p>
          </div>
        </div>

        {/* Form */}
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4"
          >
            {/* Role */}
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>I am a</FormLabel>

                  <div className="flex gap-3">
                    <RoleCard
                      value="FARMER"
                      label="Farmer"
                      description="Manage farms & detect diseases"
                      icon="🌾"
                      selected={field.value === "FARMER"}
                      onClick={() => field.onChange("FARMER")}
                    />

                    <RoleCard
                      value="EXPERT"
                      label="Expert"
                      description="Advise & consult farmers"
                      icon="👨‍🔬"
                      selected={field.value === "EXPERT"}
                      onClick={() => field.onChange("EXPERT")}
                    />
                  </div>

                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Name */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full name</FormLabel>

                  <FormControl>
                    <Input
                      placeholder="Israk Ahmed"
                      autoComplete="name"
                      disabled={isRegistering}
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Email */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email address</FormLabel>

                  <FormControl>
                    <Input
                      type="email"
                      placeholder="you@example.com"
                      autoComplete="email"
                      disabled={isRegistering}
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
                <FormItem>
                  <FormLabel>Password</FormLabel>

                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="At least 6 characters"
                        autoComplete="new-password"
                        disabled={isRegistering}
                        className="pr-10"
                        {...field}
                      />

                      <button
                        type="button"
                        onClick={() =>
                          setShowPassword((prev) => !prev)
                        }
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
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
                <FormItem>
                  <FormLabel>Confirm password</FormLabel>

                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showConfirm ? "text" : "password"}
                        placeholder="Repeat your password"
                        autoComplete="new-password"
                        disabled={isRegistering}
                        className="pr-10"
                        {...field}
                      />

                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirm((prev) => !prev)
                        }
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
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

            {/* Submit */}
            <Button
              type="submit"
              className="w-full"
              disabled={isRegistering}
            >
              {isRegistering ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating account...
                </>
              ) : (
                "Create account"
              )}
            </Button>
          </form>
        </Form>

        {/* Footer */}
        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link
            href={ROUTES.LOGIN}
            className="font-medium text-primary hover:underline"
          >
            Sign in
          </Link>
        </p>
      </div>
    </motion.div>
  );
}