export type HttpConfig = {
  port: number;
  host: string;
};

export const httpConfig: HttpConfig = {
  port: Number(process.env.HTTP_SERVER_PORT || process.env.PORT || 3000),
  host: process.env.HTTP_SERVER_HOST || "0.0.0.0",
};
