"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const settingsFormSchema = z.object({
  emailNotifications: z.boolean(),
  pushNotifications: z.boolean(),
  weeklyDigest: z.boolean(),
  newReleases: z.boolean(),
  watchlistReminders: z.boolean(),
  marketingEmails: z.boolean(),
});

type SettingsFormValues = z.infer<typeof settingsFormSchema>;

const defaultValues: Partial<SettingsFormValues> = {
  emailNotifications: true,
  pushNotifications: false,
  weeklyDigest: true,
  newReleases: true,
  watchlistReminders: true,
  marketingEmails: false,
};

export function Settings() {
  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsFormSchema),
    defaultValues,
  });

  function onSubmit(data: SettingsFormValues) {
    toast.success("Settings updated successfully");
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
            <CardDescription>
              Configure how you want to receive notifications
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="emailNotifications"
              render={({ field }) => (
                <FormItem className="flex justify-between items-center">
                  <div>
                    <FormLabel>Email Notifications</FormLabel>
                    <FormDescription>
                      Receive email notifications about your account activity
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="pushNotifications"
              render={({ field }) => (
                <FormItem className="flex justify-between items-center">
                  <div>
                    <FormLabel>Push Notifications</FormLabel>
                    <FormDescription>
                      Get push notifications on your devices
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="weeklyDigest"
              render={({ field }) => (
                <FormItem className="flex justify-between items-center">
                  <div>
                    <FormLabel>Weekly Digest</FormLabel>
                    <FormDescription>
                      Get a weekly summary of your watching activity
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="newReleases"
              render={({ field }) => (
                <FormItem className="flex justify-between items-center">
                  <div>
                    <FormLabel>New Releases</FormLabel>
                    <FormDescription>
                      Get notified about new releases of your tracked shows
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="watchlistReminders"
              render={({ field }) => (
                <FormItem className="flex justify-between items-center">
                  <div>
                    <FormLabel>Watchlist Reminders</FormLabel>
                    <FormDescription>
                      Get reminders about shows in your watchlist
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="marketingEmails"
              render={({ field }) => (
                <FormItem className="flex justify-between items-center">
                  <div>
                    <FormLabel>Marketing Emails</FormLabel>
                    <FormDescription>
                      Receive marketing emails and special offers
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Button type="submit">Save Changes</Button>
      </form>
    </Form>
  );
}