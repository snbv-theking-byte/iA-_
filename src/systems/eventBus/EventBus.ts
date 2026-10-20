type EventCallback<T> = (payload: T) => void;

export class TypedEventBus<TEvents extends object> {
  private listeners = new Map<string, Set<Function>>();

  /**
   * Subscribe to a typed event.
   * Returns an unsubscribe function for easy cleanup in useEffect hooks.
   */
  public on<K extends keyof TEvents>(
    event: K,
    callback: EventCallback<TEvents[K]>
  ): () => void {
    const eventName = event as string;

    if (!this.listeners.has(eventName)) {
      this.listeners.set(eventName, new Set());
    }

    this.listeners.get(eventName)!.add(callback);

    return () => this.off(event, callback);
  }

  /**
   * Unsubscribe a specific callback from an event.
   */
  public off<K extends keyof TEvents>(
    event: K,
    callback: EventCallback<TEvents[K]>
  ): void {
    const eventName = event as string;
    const callbacks = this.listeners.get(eventName);

    if (callbacks) {
      callbacks.delete(callback);
      if (callbacks.size === 0) {
        this.listeners.delete(eventName);
      }
    }
  }

  /**
   * Emit an event with a strictly typed payload.
   */
  public emit<K extends keyof TEvents>(
    event: K,
    payload: TEvents[K]
  ): void {
    const eventName = event as string;
    const callbacks = this.listeners.get(eventName);

    if (callbacks) {
      callbacks.forEach((listener) => {
        try {
          (listener as EventCallback<TEvents[K]>)(payload);
        } catch (error) {
          console.error(`Error executing listener for event "${eventName}":`, error);
        }
      });
    }
  }

  /**
   * Remove all listeners across all events (useful for testing/resetting).
   */
  public clear(): void {
    this.listeners.clear();
  }
}
