import { render } from "vitest-browser-vue";
import TestCardRenderer from "../src/card/test-card-renderer.vue";

describe("test-card-renderer.vue", () => {
  test("mounted", async () => {
    render(TestCardRenderer);
  });
});
