import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import db from "@/db/db";
import { formatNumber, formatCurrency } from "@/lib/formatters";

async function getSalesData() {
  const data = await db.order.aggregate({
    _sum: { pricePaidInPence: true },
    _count: true,
  });

  return {
    amount: (data._sum.pricePaidInPence || 0) / 100,
    numberOfSales: data._count,
  };
}

async function getUserData() {
  const [userCount, orderData] = await Promise.all([
    db.user.count(),
    db.order.aggregate({
      _sum: { pricePaidInPence: true },
    }),
  ]);

  return {
    userCount,
    averageValuePerUser:
      userCount === 0
        ? 0
        : (orderData._sum.pricePaidInPence || 0) / userCount / 100,
  };
}

async function getEventData() {
  const [activeCount, inactiveCount] = await Promise.all([
    db.event.count({ where: { isAvailable: true } }),
    db.event.count({ where: { isAvailable: false } }),
  ]);

  return {
    activeCount,
    inactiveCount,
  };
}

type DashboardCardProps = {
  title: string;
  subtitle: string;
  body: string;
};

export default async function AdminDashboard() {
  const [salesData, userData, eventData] = await Promise.all([
    getSalesData(),
    getUserData(),
    getEventData(),
  ]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <DashboardCard
        title="Sales"
        subtitle={`${formatNumber(salesData.numberOfSales)} Orders`}
        body={formatCurrency(salesData.amount)}
      ></DashboardCard>
      <DashboardCard
        title="Customers"
        subtitle={`${formatCurrency(
          userData.averageValuePerUser
        )} Average Value`}
        body={userData.userCount.toString()}
      ></DashboardCard>
      <DashboardCard
        title="Active Events"
        subtitle={`${formatNumber(eventData.inactiveCount)} Inactive`}
        body={formatNumber(eventData.activeCount)}
      ></DashboardCard>
    </div>
  );
}

function DashboardCard({ title, subtitle, body }: DashboardCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{subtitle}</CardDescription>
      </CardHeader>
      <CardContent>
        <p>{body}</p>
      </CardContent>
    </Card>
  );
}
