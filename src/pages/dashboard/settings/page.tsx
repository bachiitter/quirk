import { zodResolver } from "@hookform/resolvers/zod";
import { Navigate, Route, useRouter } from "@tanstack/router";
import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { trpc } from "~/lib/utils";
import { Button } from "~/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Separator } from "~/components/ui/separator";
import { useAuth } from "~/context/auth";

import { DashboardRoute } from "../layout";

export const SettingsRoute = new Route({
  getParentRoute: () => DashboardRoute,
  path: "/settings",
  component: Settings,
});

const accountFormSchema = z.object({
  name: z.string().min(3, {
    message: "Name must be at least 3 characters.",
  }),
});

type AccountFormValues = z.infer<typeof accountFormSchema>;

function Settings() {
  const { session, isLoading, refreshSession } = useAuth();
  const router = useRouter();

  if (!isLoading && !session) {
    return <Navigate to="/" />;
  }

  const form = useForm<AccountFormValues>({
    resolver: zodResolver(accountFormSchema),
    mode: "onChange",
    defaultValues: {
      // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
      name: session?.user.name!,
    },
  });

  const nameMutation = trpc.user.name.useMutation({
    onSettled: async () => {
      alert("Your profile has been updated.");
      await refreshSession();
      router.reload();
    },
  });

  function onSubmit(data: AccountFormValues) {
    nameMutation.mutate({
      name: data.name,
    });
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
            <div className="space-y-6">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-8">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Your Name</FormLabel>

                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormDescription>
                          Please enter your full name or a display name you are
                          comfortable with.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="submit">Update profile</Button>
                </form>
              </Form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
