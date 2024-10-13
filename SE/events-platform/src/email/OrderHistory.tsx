import {
    Html,
    Preview,
    Tailwind,
    Head,
    Container,
    Heading,
    Hr,
  } from "@react-email/components";
  import { OrderInformation } from "./components/OrderInformation";
  import React from "react";
  
  type OrderHistoryEmailProps = {
    orders: {
      id: string;
      pricePaidInPence: number;
      createdAt: Date;
      event: {
        name: string;
        imagePath: string;
        description: string;
      };
    }[];
  };
  
  OrderHistoryEmail.PreviewProps = {
    orders: [
      {
        id: crypto.randomUUID(),
        createdAt: new Date(),
        pricePaidInPence: 1000,
        event: {
          name: "Event Name",
          imagePath: "/images/andrew.JPG",
          description: "A description of the event",
        },
      },
      {
        id: crypto.randomUUID(),
        createdAt: new Date(),
        pricePaidInPence: 3000,
        event: {
          name: "Event Name 2",
          imagePath: "/images/andrew.JPG",
          description: "A description of the event 2",
        },
      },
    ],
  } satisfies OrderHistoryEmailProps;
  
  export default function OrderHistoryEmail({ orders }: OrderHistoryEmailProps) {
    return (
      <Html>
        <Preview>Order History</Preview>
        <Tailwind>
          <Head />
          <body className="font-sans bg-white">
            <Container className="max-w-xl">
              <Heading>Order History</Heading>
              {orders.map((order, index) => (
                <React.Fragment key={order.id}>
                  <OrderInformation order={order} event={order.event} />
                  {index < orders.length - 1 && <Hr />}
                </React.Fragment>
              ))}
            </Container>
          </body>
        </Tailwind>
      </Html>
    );
  }