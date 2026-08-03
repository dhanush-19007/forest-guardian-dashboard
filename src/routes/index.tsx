import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { Loader2, LockKeyhole, ShieldCheck, User } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useApp } from "@/context/AppContext";
import forestBg from "@/assets/forest-login.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Login | Smart Forest Guardian" },
      {
        name: "description",
        content:
          "Secure sign-in for Forest Department officials to monitor footprint detections, poaching alerts and wildlife movement.",
      },
      { property: "og:title", content: "Login | Smart Forest Guardian" },
      {
        property: "og:description",
        content:
          "Forest Department portal for AI-powered footprint recognition and poaching detection.",
      },
    ],
  }),
  component: LoginPage,
});

interface LoginForm {
  username: string;
  password: string;
}

function LoginPage() {
  const { login } = useApp();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({ defaultValues: { username: "", password: "" } });

  const onSubmit = (data: LoginForm) => {
    setLoading(true);
    setTimeout(() => {
      login(data.username.trim());
      toast.success("Welcome back, Ranger");
      navigate({ to: "/dashboard" });
    }, 700);
  };

  return (
    <div className="relative grid min-h-screen place-items-center px-4 py-10">
      <img
        src={forestBg}
        alt=""
        aria-hidden
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-sidebar/85 backdrop-blur-sm" />

      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative w-full max-w-md rounded-3xl border border-border/40 bg-card p-6 shadow-soft sm:p-8"
      >
        <div className="flex flex-col items-center text-center">
          <span className="grid h-14 w-14 place-items-center rounded-2xl bg-primary text-primary-foreground">
            <ShieldCheck className="h-7 w-7" />
          </span>
          <h1 className="mt-4 text-xl font-bold text-foreground sm:text-2xl">
            Smart Forest Guardian
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            AI-Powered Footprint Recognition &amp; Poaching Detection
          </p>
          <p className="mt-3 rounded-full bg-muted px-3 py-1 text-xs font-medium text-primary">
            Forest Department Officials Only
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-7 space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="username">Username</Label>
            <div className="relative">
              <User className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="username"
                placeholder="ranger.kumar"
                className="h-11 pl-9"
                {...register("username", { required: "Username is required" })}
              />
            </div>
            {errors.username ? (
              <p className="text-xs text-destructive">
                {errors.username.message}
              </p>
            ) : null}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <LockKeyhole className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                className="h-11 pl-9"
                {...register("password", {
                  required: "Password is required",
                  minLength: { value: 4, message: "Minimum 4 characters" },
                })}
              />
            </div>
            {errors.password ? (
              <p className="text-xs text-destructive">
                {errors.password.message}
              </p>
            ) : null}
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="h-11 w-full rounded-xl text-sm font-semibold"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            {loading ? "Signing in..." : "Login"}
          </Button>
        </form>

        <p className="mt-5 text-center text-xs text-muted-foreground">
          Demo build — any username and password will sign you in.
        </p>
      </motion.div>
    </div>
  );
}
