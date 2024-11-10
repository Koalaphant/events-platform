import { Suspense } from "react";
import db from "@/db/db";
import { auth } from "@clerk/nextjs/server";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

interface Order {
  id: string;
  pricePaidInPence: number;
  createdAt: string;
  eventName: string;
}

async function getUserOrders(userId: string): Promise<Order[]> {
  const orders = await db.order.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    include: {
      event: {
        select: {
          name: true,
        },
      },
    },
  });

  return orders.map((order) => ({
    ...order,
    createdAt: order.createdAt.toISOString(),
    eventName: order.event.name,
  }));
}

export default async function MyOrdersPage() {
  const { userId } = await auth();

  return (
    <div className="max-2-xl mx-auto px-4 mt-12 sm:mx-6 max-w-7xl lg:mx-auto">
      <h1 className="text-2xl font-semibold mb-4">My Orders</h1>

      <Suspense fallback={<OrdersSkeleton />}>
        {userId ? (
          <OrdersSuspense userId={userId} />
        ) : (
          <p>User not authenticated.</p>
        )}
      </Suspense>
    </div>
  );
}

async function OrdersSuspense({ userId }: { userId: string }) {
  const orders = await getUserOrders(userId);
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {orders.length > 0 ? (
        orders.map((order) => <OrderCard key={order.id} {...order} />)
      ) : (
        <p>No orders found.</p>
      )}
    </div>
  );
}

function OrdersSkeleton() {
  return (
    <div>
      <p>Loading your orders...</p>
    </div>
  );
}

function OrderCard({ id, pricePaidInPence, createdAt, eventName }: Order) {
  return (
    <Card className="shadow-lg border border-gray-200 rounded-lg">
      <CardHeader>
        <h3 className="text-xl font-semibold">{eventName}</h3>
      </CardHeader>
      <CardContent>
        <p>Order ID: {id}</p>
        <p>Amount Paid: £{(pricePaidInPence / 100).toFixed(2)}</p>
        <p>Order Date: {new Date(createdAt).toLocaleDateString()}</p>
      </CardContent>
    </Card>
  );
}
