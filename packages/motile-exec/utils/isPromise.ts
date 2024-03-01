export type MaybePromise<T> = Promise<T> | T;

export function isPromise<T>(value: MaybePromise<T>): value is Promise<T> {
  return typeof (value as Promise<T>).then === "function";
}
