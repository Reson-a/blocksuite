import { uuidv4 as uuidv4IdGenerator } from 'lib0/random.js';

export type IdGenerator = () => string;

export function createAutoIncrementIdGenerator(): IdGenerator {
  let i = 0;
  return () => (i++).toString();
}

export function createAutoIncrementIdGeneratorByClientId(
  clientId: number
): IdGenerator {
  let i = 0;
  return () => `${clientId}:${i++}`;
}

export function uuidv4() {
  return uuidv4IdGenerator();
}
