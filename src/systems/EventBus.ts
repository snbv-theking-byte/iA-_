/**
 * Decoupled High-Performance Type-Safe Event Bus for Audio, Three.js, Canvas, and UI
 */

import { eventBus, TypedEventBus } from './eventBus';
import type { EventMap } from './eventBus/eventBus.types';

export const EventBus = eventBus;
export { eventBus, TypedEventBus };
export type { EventMap };
