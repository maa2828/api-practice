import { buildApp } from "./app";
import { config } from "./lib/config";
import { seedUsers } from "./users/users.seed";

async function main() {
  await seedUsers();

  const app = buildApp();

  app.listen(config.port, () => {
    console.log(`listening on http://localhost:${config.port}`);
  });
}

main();