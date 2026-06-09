export type FibResult = { value: number; calls: number };

export function fibNaive(n: number): FibResult {
  let calls = 0;

  function f(x: number): number {
    calls++;

    if (x === 0) return 0;
    if (x === 1) return 1;

    return f(x - 1) + f(x - 2);
  }

  const value = f(n);

  return { value, calls };
}