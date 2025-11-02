import { register } from "tsconfig-paths";
import { resolve } from "path";
import { fileURLToPath } from "url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const baseUrl = resolve(__dirname, "..");
const { paths } = {
  paths: {
    "@/*": ["src/*"],
  },
};

register({
  baseUrl,
  paths,
});
