import { render } from "vitest-browser-vue";
import TestCardRenderer from "../src/sgs-card/__test__.vue";

describe("sgs-card/__test__.vue", () => {
  test("mounted", async () => {
    render(TestCardRenderer);
  });
});
