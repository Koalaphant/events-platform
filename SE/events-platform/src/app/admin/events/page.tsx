import { Button } from "@/components/ui/button";
import { PageHeader } from "../_components/PageHeader";
import Link from "next/link";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import db from "@/db/db";
import { CheckCircle2, MoreVertical, XCircleIcon } from "lucide-react";
import { formatCurrency } from "@/lib/formatters";
import { DropdownMenu, DropdownMenuItem } from "@radix-ui/react-dropdown-menu";
import {
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ActiveToggleDropdownItem,
  DeleteDropdownItem,
} from "./_components/EventsActions";

export default function AdminEventsPage() {
  return (
    <>
      <div className="flex justify-between items-center gap-4">
        <PageHeader>Events</PageHeader>
        <Button asChild>
          <Link href="/admin/events/new">Add Event</Link>
        </Button>
      </div>
      <EventsTable />
    </>
  );
}

async function EventsTable() {
  const events = await db.event.findMany({
    select: {
      id: true,
      name: true,
      priceInPence: true,
      isAvailable: true,
      startTime: true,
      endTime: true,
      _count: { select: { orders: true } },
    },
    orderBy: { name: "asc" },
  });

  if (events.length === 0) {
    return (
      <div>
        <p>No events found</p>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-0">
            <span className="sr-only">Available For Purchase</span>
          </TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Price</TableHead>
          <TableHead>Orders</TableHead>
          <TableHead>Start Time</TableHead>
          <TableHead>End Time</TableHead>
          <TableHead className="w-0">
            <span className="sr-only">Actions</span>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {events.map((event) => (
          <TableRow key={event.id}>
            <TableCell>
              {event.isAvailable ? (
                <>
                  <CheckCircle2 />
                  <span className="sr-only">Available</span>
                </>
              ) : (
                <>
                  <XCircleIcon className="stroke-destructive" />
                  <span className="sr-only">Unavailable</span>
                </>
              )}
            </TableCell>
            <TableCell>{event.name}</TableCell>
            <TableCell>
              {event.priceInPence === 0
                ? "Free"
                : formatCurrency(event.priceInPence / 100)}
            </TableCell>
            <TableCell>{event._count?.orders}</TableCell>
            <TableCell>{new Date(event.startTime).toLocaleString()}</TableCell>
            <TableCell>{new Date(event.endTime).toLocaleString()}</TableCell>
            <TableCell>
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <MoreVertical />
                  <span className="sr-only">Actions</span>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem asChild>
                    <Link href={`/admin/events/${event.id}/edit`}>Edit</Link>
                  </DropdownMenuItem>
                  <ActiveToggleDropdownItem
                    id={event.id}
                    isAvailable={event.isAvailable}
                  />
                  <DropdownMenuSeparator />
                  <DeleteDropdownItem
                    id={event.id}
                    disabled={event._count?.orders > 0}
                  />
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
