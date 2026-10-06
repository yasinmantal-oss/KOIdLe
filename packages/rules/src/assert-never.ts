/** Birlik tipi genişleyip bir case unutulursa derleme hatası verir; çalışırken de fırlatır. */
export function assertNever(x: never): never {
  throw new Error(`Beklenmeyen değer: ${JSON.stringify(x)}`);
}
