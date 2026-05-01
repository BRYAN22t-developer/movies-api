import dotenv from "dotenv/config";
import { env } from "./config/env.js";
import { createServer } from "./server.js";
import { createDependencies } from "./depencencies.js";

const port = env.PORT;

const app = createServer(createDependencies());

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
