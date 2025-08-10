import { motion } from "framer-motion";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Eye, EyeOff, User, Mail, Lock, Phone, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { USER_ROLES, INTERESTS } from "@/lib/constants";

const signupSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
    role: z.enum([USER_ROLES.USER, USER_ROLES.ORGANIZER]),
    phone: z.string().optional(),
    location: z.string().optional(),
    bio: z.string().optional(),
    interests: z.array(z.string()).optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export const SignupForm = ({ onSuccess, onSwitchToLogin }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [selectedInterests, setSelectedInterests] = useState([]);
  const { signup, loading } = useAuth();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    setValue,
  } = useForm({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      role: USER_ROLES.USER,
    },
  });

  const selectedRole = watch("role");

  const onSubmit = async (data) => {
    try {
      const userData = {
        ...data,
        interests: selectedRole === USER_ROLES.USER ? selectedInterests : [],
      };
      await signup(data.email, data.password, userData);
      onSuccess?.();
    } catch (error) {
      console.error("Signup failed:", error);
    }
  };

  const handleInterestToggle = (interest) => {
    setSelectedInterests((prev) => {
      const updated = prev.includes(interest)
        ? prev.filter((i) => i !== interest)
        : [...prev, interest];
      setValue("interests", updated);
      return updated;
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Create Account</CardTitle>
          <CardDescription>
            Join our event community and start discovering amazing events
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name *</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="name"
                    type="text"
                    placeholder="Enter your full name"
                    className="pl-10"
                    {...register("name")}
                  />
                </div>
                {errors.name && (
                  <p className="text-sm text-destructive">
                    {errors.name.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address *</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    className="pl-10"
                    {...register("email")}
                  />
                </div>
                {errors.email && (
                  <p className="text-sm text-destructive">
                    {errors.email.message}
                  </p>
                )}
              </div>
            </div>

            {/* Password Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="password">Password *</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter password"
                    className="pl-10 pr-10"
                    {...register("password")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-sm text-destructive">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password *</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm password"
                    className="pl-10 pr-10"
                    {...register("confirmPassword")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-sm text-destructive">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>
            </div>

            {/* Role Selection */}
            <div className="space-y-3">
              <Label>Account Type *</Label>
              <RadioGroup
                value={selectedRole}
                onValueChange={(value) => setValue("role", value)}
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
              >
                <div className="flex items-center space-x-2 border rounded-lg p-4 hover:bg-muted/50">
                  <RadioGroupItem value={USER_ROLES.USER} id="user" />
                  <div className="flex-1">
                    <Label htmlFor="user" className="font-medium">
                      Event Attendee
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Discover and attend amazing events
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2 border rounded-lg p-4 hover:bg-muted/50">
                  <RadioGroupItem value={USER_ROLES.ORGANIZER} id="organizer" />
                  <div className="flex-1">
                    <Label htmlFor="organizer" className="font-medium">
                      Event Organizer
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Create and manage your own events
                    </p>
                  </div>
                </div>
              </RadioGroup>
              {errors.role && (
                <p className="text-sm text-destructive">
                  {errors.role.message}
                </p>
              )}
            </div>

            {/* Interests Selection (only for users) */}
            {selectedRole === USER_ROLES.USER && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                transition={{ duration: 0.3 }}
                className="space-y-3"
              >
                <Label>Your Interests (Select at least 3)</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {INTERESTS.map((interest) => (
                    <div
                      key={interest}
                      className={`flex items-center space-x-2 border rounded-lg p-3 cursor-pointer transition-colors ${
                        selectedInterests.includes(interest)
                          ? "bg-primary/10 border-primary"
                          : "hover:bg-muted/50"
                      }`}
                      onClick={() => handleInterestToggle(interest)}
                    >
                      <Checkbox
                        checked={selectedInterests.includes(interest)}
                        onChange={() => handleInterestToggle(interest)}
                      />
                      <Label className="cursor-pointer text-sm">
                        {interest}
                      </Label>
                    </div>
                  ))}
                </div>
                {selectedInterests.length < 3 && (
                  <p className="text-sm text-muted-foreground">
                    Please select at least 3 interests to personalize your
                    experience
                  </p>
                )}
              </motion.div>
            )}

            {/* Optional Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="Enter phone number"
                    className="pl-10"
                    {...register("phone")}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="location"
                    type="text"
                    placeholder="City, Country"
                    className="pl-10"
                    {...register("location")}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                placeholder="Tell us a bit about yourself..."
                rows={3}
                {...register("bio")}
              />
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full"
              disabled={
                loading ||
                (selectedRole === USER_ROLES.USER &&
                  selectedInterests.length < 3)
              }
            >
              {loading ? "Creating Account..." : "Create Account"}
            </Button>

            {/* Switch to Login */}
            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={onSwitchToLogin}
                  className="text-primary hover:underline font-medium"
                >
                  Sign in here
                </button>
              </p>
            </div>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
};
