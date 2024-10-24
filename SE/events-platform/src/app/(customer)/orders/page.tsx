"use client";

import { emailOrderHistory } from "@/actions/orders";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useFormState, useFormStatus } from "react-dom";

export default function MyOrdersPage() {
  const [data, action] = useFormState(emailOrderHistory, {});

  return (
    <div>
      <form
        action={action}
        className="max-2-xl mx-auto px-4 mt-12 sm:mx-6 max-w-7xl lg:mx-auto"
      >
        <Card>
          <CardHeader>
            <CardTitle>My Orders</CardTitle>
            <CardDescription>
              Enter your email below and we will view your order history
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input type="email" required name="email" id="email" />
              {data.error && (
                <div className="text-destructive">{data.error}</div>
              )}
            </div>
          </CardContent>
          <CardFooter>
            {data.message ? <p>{data.message}</p> : <SubmitButton />}
          </CardFooter>
        </Card>
      </form>
    </div>
  );

  function SubmitButton() {
    const { pending } = useFormStatus();

    return (
      <Button className="w-full" size="lg" disabled={pending} type="submit">
        {pending ? "Sending" : "Send"}
      </Button>
    );
  }
}
