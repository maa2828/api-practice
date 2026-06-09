function countdown(value: number): number[] {
  if (value < 0) {
    return [];
  }

  if (value === 0) {
    return [0];
  }

  return [value, ...countdown(value - 1)];
}

console.log(countdown(5));
