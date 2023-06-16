import type { FormEvent } from "react";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Navigate, Route } from "@tanstack/router";
import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { formatDate, trpc } from "~/lib/utils";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components/ui/accordion";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Icons } from "~/components/ui/icons";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
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
      name: session?.user.name as string | undefined,
      email: session?.user.email as string | undefined,
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

  const { data: subscriptionPlan } = trpc.user.subscription.useQuery();

  const accountDeleteMutation = trpc.user.delete.useMutation({
    onSuccess: () => {
      toast({
        description: "Your account has been deleted.",
      });

      setTimeout(() => (window.location.href = "/"), 1000);
    },
  });

  const [deleteDisabled, setDeleteDisabled] = useState(true);

  const [isLoadingStripeSession, setIsLoading] = useState<boolean>(false);

  // @ts-expect-error no reponse
  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setIsLoading(!isLoading);

    // Get a Stripe session URL.
    const response = await fetch("/api/stripe");

    if (!response.ok) {
      return toast({
        title: "Something went wrong.",
        description: "Please refresh the page and try again.",
        variant: "destructive",
      });
    }

    // Redirect to the Stripe session.
    // This could be a checkout page for initial upgrade.
    // Or portal to manage existing subscription.
    const session = (await response.json()) as any;

    if (session) {
      window.location.href = session.url;
    }
  }

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
                              <Input
                                {...field}
                                disabled={session?.user.provider !== "email"}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button
                        disabled={session?.user.provider !== "email"}
                        type="submit">
                        Update profile
                      </Button>
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
                              <Input
                                {...field}
                                disabled={session?.user.provider !== "email"}
                                type="password"
                              />
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
                              <Input
                                {...field}
                                disabled={session?.user.provider !== "email"}
                                type="password"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button
                        disabled={session?.user.provider !== "email"}
                        type="submit">
                        Update Password
                      </Button>
                    </form>
                  </Form>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="billing">
                <AccordionTrigger>
                  <h3 className="text-lg font-medium">Billing</h3>
                </AccordionTrigger>
                <AccordionContent>
                  <p className="pb-2">
                    You are currently on the{" "}
                    <strong>{subscriptionPlan?.plan.name}</strong> plan.
                  </p>
                  <form onSubmit={onSubmit}>
                    <Button type="submit" disabled={isLoadingStripeSession}>
                      {isLoadingStripeSession && (
                        <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                      )}
                      {subscriptionPlan?.isPro
                        ? "Manage Subscription"
                        : "Upgrade to PRO"}
                    </Button>
                    {subscriptionPlan?.isPro ? (
                      <p className="mt-2 rounded-full text-xs font-medium">
                        {subscriptionPlan.isCanceled
                          ? "Your plan will be canceled on "
                          : "Your plan renews on "}
                        {formatDate(subscriptionPlan.stripeCurrentPeriodEnd)}.
                      </p>
                    ) : null}
                  </form>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
            <section>
              <h3 className="py-4 text-lg font-medium">
                Delete Personal Account
              </h3>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="destructive">Delete Account</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Delete Account</DialogTitle>
                    <DialogDescription>
                      This action cannot be undone. This will permanently delete
                      your account and remove your data from our servers.
                    </DialogDescription>
                  </DialogHeader>
                  <div>
                    <Label>
                      Enter <strong>delete my account</strong> to continue:
                    </Label>
                    <Input
                      className="mt-2"
                      onChange={(e) => {
                        e.preventDefault();
                        if (e.target.value === "delete my account") {
                          setDeleteDisabled(false);
                        }
                      }}
                      type="text"
                    />
                  </div>
                  <DialogFooter>
                    <Button
                      variant="destructive"
                      onClick={() => accountDeleteMutation.mutate()}
                      disabled={deleteDisabled}>
                      Delete Account
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </section>
          </div>
        </div>
      </div>
    </>
  );
}
