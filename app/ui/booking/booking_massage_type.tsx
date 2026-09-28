import { getMassageTypes } from "@/app/lib/data/massage_types";

export default async function BookingMassageType({
  massage_type,
}: {
  massage_type: string;
}) {
  const massageTypes = await getMassageTypes();
  const massageType = massageTypes.find((type) => type.id === massage_type);
  return <span>{massageType ? massageType.name : null}</span>;
}
