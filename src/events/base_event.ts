import { randomUUID } from "node:crypto";

export class BaseEvent {
  public readonly timestamp = new Date();
  constructor(public readonly idempotency_id: string = randomUUID()) {}

  print() {
    return JSON.stringify(this);
  }
}
