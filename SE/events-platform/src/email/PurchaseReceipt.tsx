import {
  Html,
  Preview,
  Tailwind,
  Head,
  Container,
  Heading,
} from "@react-email/components";
import { OrderInformation } from "./components/OrderInformation";

type PurchaseReceiptEmailProps = {
  event: {
    name: string;
    imagePath: string;
    description: string;
  };
  order: { id: string; createdAt: Date; pricePaidInPence: number };
};

PurchaseReceiptEmail.PreviewProps = {
  event: {
    name: "Event Name",
    imagePath: "/images/andrew.JPG",
    description: "A description of the event",
  },
  order: {
    id: crypto.randomUUID(),
    createdAt: new Date(),
    pricePaidInPence: 1000,
  },
} satisfies PurchaseReceiptEmailProps;

export default function PurchaseReceiptEmail({
  event,
  order,
}: PurchaseReceiptEmailProps) {
  return (
    <Html>
      <Preview>Download {event.name} and view receipt</Preview>
      <Tailwind>
        <Head />
        <body className="font-sans bg-white">
          <Container className="max-w-xl">
            <Heading>Purchase Receipt</Heading>
            <OrderInformation order={order} event={event} />
          </Container>
        </body>
      </Tailwind>
    </Html>
  );
}
