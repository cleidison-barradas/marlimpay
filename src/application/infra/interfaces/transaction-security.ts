export interface ITransactionSecurity {
  _id?: string;
  security_hash: string;
  status: "active" | "completed";
  generated_at: Date;
}
