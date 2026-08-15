const {
  add,
  sub,
  mul,
  div,
  calculate,
  runCli,
} = require("../calculator");

describe("calculator basic operations", () => {
  test("adds numbers", () => {
    expect(add(2, 3)).toBe(5);
    expect(add(-4, 7)).toBe(3);
    expect(add(2.5, 1.5)).toBe(4);
  });

  test("subtracts numbers", () => {
    expect(sub(10, 4)).toBe(6);
    expect(sub(3, 8)).toBe(-5);
    expect(sub(5.5, 2.2)).toBeCloseTo(3.3);
  });

  test("multiplies numbers", () => {
    expect(mul(45, 2)).toBe(90);
    expect(mul(-3, 6)).toBe(-18);
    expect(mul(2.5, 4)).toBe(10);
  });

  test("divides numbers", () => {
    expect(div(20, 5)).toBe(4);
    expect(div(-12, 3)).toBe(-4);
    expect(div(7.5, 2.5)).toBe(3);
  });

  test("throws on division by zero", () => {
    expect(() => div(10, 0)).toThrow("Division by zero is not allowed.");
  });
});

describe("calculate dispatcher", () => {
  test("supports image examples and standard operation names", () => {
    expect(calculate("add", 2, 3)).toBe(5);
    expect(calculate("sub", 10, 4)).toBe(6);
    expect(calculate("mul", 45, 2)).toBe(90);
    expect(calculate("div", 20, 5)).toBe(4);
  });

  test("supports symbol and synonym aliases", () => {
    expect(calculate("+", 1, 2)).toBe(3);
    expect(calculate("subtract", 10, 2)).toBe(8);
    expect(calculate("*", 6, 7)).toBe(42);
    expect(calculate("x", 3, 4)).toBe(12);
    expect(calculate("/", 9, 3)).toBe(3);
    expect(calculate("divide", 8, 2)).toBe(4);
  });

  test("throws for unsupported operations", () => {
    expect(() => calculate("mod", 9, 2)).toThrow('Unsupported operation: "mod".');
  });
});

describe("CLI behavior", () => {
  let logSpy;
  let errorSpy;

  beforeEach(() => {
    logSpy = jest.spyOn(console, "log").mockImplementation(() => {});
    errorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    logSpy.mockRestore();
    errorSpy.mockRestore();
  });

  test("prints usage and exits 0 for help", () => {
    const code = runCli(["--help"]);
    expect(code).toBe(0);
    expect(logSpy).toHaveBeenCalled();
  });

  test("returns 0 and prints result for valid input", () => {
    const code = runCli(["add", "2", "3"]);
    expect(code).toBe(0);
    expect(logSpy).toHaveBeenCalledWith(5);
  });

  test("returns 1 for invalid argument count", () => {
    const code = runCli(["add", "2"]);
    expect(code).toBe(1);
    expect(errorSpy).toHaveBeenCalled();
  });

  test("returns 1 for invalid numbers", () => {
    const code = runCli(["mul", "abc", "3"]);
    expect(code).toBe(1);
    expect(errorSpy).toHaveBeenCalled();
  });

  test("returns 1 for division by zero", () => {
    const code = runCli(["div", "10", "0"]);
    expect(code).toBe(1);
    expect(errorSpy).toHaveBeenCalled();
  });
});
