import { MASSAGE_TYPES } from "@/app/constants/massage_types";

export default function BookingMassageType({
  massage_type,
}: {
  massage_type: string;
}) {
  const massageType = MASSAGE_TYPES.find((type) => type.id === massage_type);
  return <span>{massageType ? massageType.name : null}</span>;
}
