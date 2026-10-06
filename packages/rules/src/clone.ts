// State saf JSON olmak zorunda; JSON kopyası bunu aynı zamanda garanti eder.
export function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}
