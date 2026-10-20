import { TypedEventBus } from "./EventBus";
import type { EventMap } from "./eventBus.types";

export const eventBus = new TypedEventBus<EventMap>();
export { TypedEventBus };
export type { EventMap };
