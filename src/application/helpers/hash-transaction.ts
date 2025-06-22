import { sha1 } from "js-sha1";

type Transaction = {
  payer_id: string;
  receiver_id: string;
  amount: number;
};

export function hashTransaction({
  payer_id,
  receiver_id,
  amount,
}: Transaction): string {
  const dataToHash = sha1(
    payer_id + sha1(receiver_id + sha1(amount.toString())),
  );

  return dataToHash;
}
