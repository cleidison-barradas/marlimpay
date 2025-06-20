import "dotenv/config";
import { App } from "./app";
import { httpConfig } from "./application";

const app = new App(httpConfig);

app.start();
