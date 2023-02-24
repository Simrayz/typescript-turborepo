export function classNames(...classes: (string | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

if (import.meta.vitest) {
  const { it, expect } = import.meta.vitest;
  const testClasses = ["test", undefined, "completed"];

  it("add", () => {
    expect(classNames(...testClasses)).toBe("test completed");
  });
}
