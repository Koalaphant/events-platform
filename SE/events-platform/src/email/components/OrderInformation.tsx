import { formatCurrency, formatEventDate } from "@/lib/formatters";
import { Section, Row, Column, Text, Img } from "@react-email/components";

type OrderInformationProps = {
  order: { id: string; createdAt: Date; pricePaidInPence: number };
  event: {
    imagePath: string;
    name: string;
    description: string;
    startTime: Date;
    location: string;
  };
};

const dateFormatter = new Intl.DateTimeFormat("en-GB", {
  dateStyle: "medium",
});

export function OrderInformation({ order, event }: OrderInformationProps) {
  return (
    <>
      <Section>
        <Row>
          <Column>
            <Text className="mb-0 text-gray-500 whitespace-nowrap text-nowrap mr-4">
              Order ID
            </Text>
            <Text className="mt-0 mr-4">{order.id}</Text>
          </Column>
          <Column>
            <Text className="mb-0 text-gray-500 whitespace-nowrap text-nowrap mr-4">
              Purchased On
            </Text>
            <Text className="mt-0 mr-4">
              {dateFormatter.format(order.createdAt)}
            </Text>
          </Column>
          <Column>
            <Text className="mb-0 text-gray-500 whitespace-nowrap text-nowrap mr-4">
              Price Paid
            </Text>
            <Text className="mt-0 mr-4">
              {formatCurrency(order.pricePaidInPence / 100)}
            </Text>
          </Column>
        </Row>
      </Section>
      <Section className="border border-solid border-gray-500 rounded-lg p-4 md:p-6 my-4">
        <Img width="100%" alt={event.name} src={event.imagePath} />
        <Row className="mt-8">
          <Column className="align-bottom">
            <Text className="text-lg font-bold m-0 mr-4">{event.name}</Text>
            <Text className="m-0 mr-4 font-bold">{event.location}</Text>
            <Text className="m-0 mr-4">
              {formatEventDate(event.startTime.toString())}
            </Text>
            <Text className="m-0 mr-4">{event.description}</Text>
          </Column>
        </Row>
      </Section>
    </>
  );
}
