/**
 * A tiny, typed, in-process event bus (ADR 0007). Services publish domain
 * events; independent subscribers (XP, achievements, analytics, activity log)
 * react without coupling to the emitter. Synchronous dispatch with support for
 * async handlers (errors are isolated per handler).
 */

export type DomainEventMap = {
  "workspace.created": { workspaceId: string };
  "curriculum.created": { workspaceId: string; curriculumId: string };
  "curriculum.updated": { workspaceId: string; curriculumId: string };
  "curriculum.deleted": { workspaceId: string; curriculumId: string };
  "node.created": { curriculumId: string; nodeId: string };
  "node.completed": { curriculumId: string; nodeId: string; xp: number };
};

export type DomainEventName = keyof DomainEventMap;
export type EventHandler<K extends DomainEventName> = (
  payload: DomainEventMap[K],
) => void | Promise<void>;

class EventBus {
  private handlers = new Map<DomainEventName, Set<EventHandler<never>>>();

  on<K extends DomainEventName>(event: K, handler: EventHandler<K>): () => void {
    const set = this.handlers.get(event) ?? new Set();
    set.add(handler as EventHandler<never>);
    this.handlers.set(event, set);
    return () => this.off(event, handler);
  }

  off<K extends DomainEventName>(event: K, handler: EventHandler<K>): void {
    this.handlers.get(event)?.delete(handler as EventHandler<never>);
  }

  emit<K extends DomainEventName>(event: K, payload: DomainEventMap[K]): void {
    const set = this.handlers.get(event);
    if (!set) return;
    for (const handler of set) {
      try {
        void (handler as EventHandler<K>)(payload);
      } catch (err) {
        // Isolate subscriber failures so one bad handler can't break others.
        console.error(`[event-bus] handler for "${event}" failed`, err);
      }
    }
  }
}

/** App-wide singleton event bus. */
export const eventBus = new EventBus();
