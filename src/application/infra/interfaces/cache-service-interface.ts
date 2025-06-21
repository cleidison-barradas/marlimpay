export type Transaction = {
  amount: number;
  payer_id: string;
  receiver_id: string;
};

export interface ICacheService {
  cachePrefix: string;
  getKey(sulfix: string): string;
  setRateLimit(userId: string): Promise<void>;
  getRateLimit(userId: string): Promise<number>;
  getHashData(data: Transaction): Promise<string | null>;
  setHashData(data: Transaction): Promise<void>;
}
