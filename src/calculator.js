#!/usr/bin/env node

/**
 * Supported operations:
 * - addition (add, +)
 * - subtraction (sub, subtract, -)
 * - multiplication (mul, multiply, x, *)
 * - division (div, divide, /)
 * - modulo (mod, modulo, %)
 * - exponentiation (pow, power)
 * - square root (sqrt, squareroot)
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

function modulo(a, b) {
  if (b === 0) {
    throw new Error("Modulo by zero is not allowed.");
  }
  return a % b;
}

function power(base, exponent) {
  return base ** exponent;
}

function squareRoot(n) {
  if (n < 0) {
    throw new Error("Square root of a negative number is not allowed.");
  }
  return Math.sqrt(n);
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
  mod: modulo,
  modulo,
  "%": modulo,
  pow: power,
  power,
  sqrt: squareRoot,
  squareroot: squareRoot,
};

function printUsage() {
  console.log("Usage: node src/calculator.js <operation> <number1> [number2]");
  console.log("Operations: add|sub|mul|div|mod|pow|sqrt (also +, -, *, /, %)");
  console.log("Note: sqrt uses only <number1>.");
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
  if (op === "sqrt" || op === "squareroot") {
    return fn(left);
  }
  return fn(left, right);
}

function runCli(argv = process.argv.slice(2)) {
  if (argv.length === 0 || argv.includes("--help") || argv.includes("-h")) {
    printUsage();
    return 0;
  }

  const [operation, ...operands] = argv;
  const op = String(operation || "").toLowerCase();
  const fn = operationMap[op];
  if (!fn) {
    console.error(`Error: Unsupported operation: "${operation}".`);
    printUsage();
    return 1;
  }
  const unaryOperation = op === "sqrt" || op === "squareroot";
  const expectedOperandCount = unaryOperation ? 1 : 2;
  if (operands.length !== expectedOperandCount) {
    console.error(`Error: expected exactly ${expectedOperandCount} operand(s) for "${operation}".`);
    printUsage();
    return 1;
  }

  try {
    const left = parseNumber(operands[0], "number1");
    const right = unaryOperation ? undefined : parseNumber(operands[1], "number2");
    const result = calculate(op, left, right);
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
  modulo,
  power,
  squareRoot,
  calculate,
  runCli,
};
