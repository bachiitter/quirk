import { zodResolver } from "@hookform/resolvers/zod";
import { Navigate, Route } from "@tanstack/router";
import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { trpc } from "~/lib/utils";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components/ui/accordion";
import { Button } from "~/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Separator } from "~/components/ui/separator";
import { useAuth } from "~/context/auth";
import { toast } from "~/hooks/use-toast";

import { DashboardRoute } from "../layout";

export const SettingsRoute = new Route({
  getParentRoute: () => DashboardRoute,
  path: "/settings",
  component: Settings,
});

const profileFormSchema = z.object({
  name: z.string().min(3, {
    message: "Name must be at least 3 characters.",
  }),
  email: z.string().email({ message: "Invalid email address." }),
});

const passwordFormSchema = z.object({
  password: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
  newPassword: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;
type PasswordFormValues = z.infer<typeof passwordFormSchema>;

function Settings() {
  const { session, isLoading, refreshSession } = useAuth();

  if (!isLoading && !session) {
    return <Navigate to="/" />;
  }

  const profileForm = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    mode: "onChange",
    defaultValues: {
      name: session?.user.name!,
      email: session?.user.email!,
    },
  });

  const profileMutation = trpc.user.profile.useMutation({
    onSuccess: async () => {
      await refreshSession();
      toast({ description: "Your profile has been updated." });
      // window.location.reload();
    },
  });

  const passwordForm = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordFormSchema),
    mode: "onChange",
    defaultValues: {
      password: "",
      newPassword: "",
    },
  });

  const passwordMutation = trpc.user.password.useMutation({
    onSuccess: async () => {
      await refreshSession();
      toast({ description: "Your password has been updated." });
      // window.location.reload();
    },
  });

  return (
    <>
      <Helmet title="Settings" />
      <div className="space-y-6">
        <div className="space-y-0.5">
          <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
          <p className="text-muted-foreground">
            Manage your personal information and account settings.
          </p>
        </div>
        <Separator className="my-6" />
        <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
          <div className="flex-1 lg:max-w-2xl">
            <Accordion type="single" collapsible defaultValue="profile">
              <AccordionItem value="profile">
                <AccordionTrigger>
                  <h3 className="text-lg font-medium">Profile</h3>
                </AccordionTrigger>
                <AccordionContent>
                  <Form {...profileForm}>
                    <form
                      onSubmit={profileForm.handleSubmit((data) => {
                        profileMutation.mutate({
                          name: data.name,
                          email: data.email,
                        });
                      })}
                      className="space-y-8">
                      <FormField
                        control={profileForm.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={profileForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email Address</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button type="submit">Update profile</Button>
                    </form>
                  </Form>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="password">
                <AccordionTrigger>
                  <h3 className="text-lg font-medium">Password</h3>
                </AccordionTrigger>
                <AccordionContent>
                  <Form {...passwordForm}>
                    <form
                      onSubmit={passwordForm.handleSubmit((data) => {
                        passwordMutation.mutate({
                          oldPassword: data.password,
                          newPassword: data.newPassword,
                        });
                      })}
                      className="space-y-8">
                      <FormField
                        control={passwordForm.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Current Password</FormLabel>
                            <FormControl>
                              <Input {...field} type="password" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={passwordForm.control}
                        name="newPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>New Password</FormLabel>
                            <FormControl>
                              <Input {...field} type="password" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button type="submit">Update Password</Button>
                    </form>
                  </Form>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </div>
    </>
  );
}
