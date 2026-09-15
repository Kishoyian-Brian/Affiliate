import { createHmac, timingSafeEqual } from 'node:crypto';

export function hmacSha256(secret: string | Buffer, payload: string) {
  return createHmac('sha256', secret).update(payload).digest();
}

export function timingSafeEqualHex(left: string, right: string) {
  const a = Buffer.from(left, 'hex');
  const b = Buffer.from(right, 'hex');
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}
