export type Result<T, E = Error> = {
  ok: boolean;
  value?: T;
  error?: E;
  isOk(): this is Result<T, E> & { ok: true; value: T };
  isErr(): this is Result<T, E> & { ok: false; error: E };
};

export const Ok = <T>(value: T): Result<T, never> => ({
  ok: true,
  value,
  isOk() {
    return true;
  },
  isErr() {
    return false;
  }
});

export const Err = <E>(error: E): Result<never, E> => ({
  ok: false,
  error,
  isOk() {
    return false;
  },
  isErr() {
    return true;
  }
});

export function isOk<T, E>(result: Result<T, E>): result is Result<T, E> & { ok: true; value: T } {
  return result.ok === true;
}

export function isErr<T, E>(result: Result<T, E>): result is Result<T, E> & { ok: false; error: E } {
  return result.ok === false;
}
