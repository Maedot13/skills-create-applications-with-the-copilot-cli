#!/usr/bin/env node

/**
 * Supported operations:
 * - addition (add, +)
 * - subtraction (sub, subtract, -)
 * - multiplication (mul, multiply, x, *)
 * - division (div, divide, /)
 */

function add(a, b) {
  return a + b;
}

function sub(a, b) {
  return a - b;
}

function mul(a, b) {
  return a * b;
}

function div(a, b) {
  if (b === 0) {
    throw new Error("Division by zero is not allowed.");
  }
  return a / b;
}

const operationMap = {
  add,
  "+": add,
  sub,
  subtract: sub,
  "-": sub,
  mul,
  multiply: mul,
  x: mul,
  "*": mul,
  div,
  divide: div,
  "/": div,
};

function printUsage() {
  console.log("Usage: node src/calculator.js <operation> <number1> <number2>");
  console.log("Operations: add|sub|mul|div (also +, -, *, /)");
}

function parseNumber(value, label) {
  const parsed = Number(value);
  if (Number.isNaN(parsed)) {
    throw new Error(`Invalid ${label}: "${value}". Please provide a valid number.`);
  }
  return parsed;
}

function calculate(operation, left, right) {
  const op = String(operation || "").toLowerCase();
  const fn = operationMap[op];
  if (!fn) {
    throw new Error(`Unsupported operation: "${operation}".`);
  }
  return fn(left, right);
}

function runCli(argv = process.argv.slice(2)) {
  if (argv.length === 0 || argv.includes("--help") || argv.includes("-h")) {
    printUsage();
    return 0;
  }

  if (argv.length !== 3) {
    console.error("Error: expected exactly 3 arguments.");
    printUsage();
    return 1;
  }

  const [operation, rawLeft, rawRight] = argv;

  try {
    const left = parseNumber(rawLeft, "number1");
    const right = parseNumber(rawRight, "number2");
    const result = calculate(operation, left, right);
    console.log(result);
    return 0;
  } catch (error) {
    console.error(`Error: ${error.message}`);
    printUsage();
    return 1;
  }
}

if (require.main === module) {
  process.exitCode = runCli();
}

module.exports = {
  add,
  sub,
  mul,
  div,
  calculate,
  runCli,
};
