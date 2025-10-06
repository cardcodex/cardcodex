// @ts-ignore
import { makeIdentifier } from "../scripts/utils";

describe("script/utils.js", () => {
  test("makeIdentifier", () => {
    expect(makeIdentifier("@cardcodex/card-render")).toBe("CardRender");
    expect(makeIdentifier("@my-scope/cool-package-name")).toBe("CoolPackageName");
    expect(makeIdentifier("another_great_package")).toBe("AnotherGreatPackage");
    expect(makeIdentifier("simple-lib")).toBe("SimpleLib");
    expect(makeIdentifier("library")).toBe("Library");
  });
});
