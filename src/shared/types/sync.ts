/**
 * A learning event packaged for server sync.
 *
 * Mirrors the field structure documented in database-design.md:
 * client_event_id, user_id, event_type, timestamp, payload, schema_version.
 */
export type SyncEvent = {
  clientEventId: string;
  userId: string;
  eventType: string;
  timestamp: number;
  payload: Record<string, unknown>;
  schemaVersion: number;
};

export type SyncResult = {
  synced: number;
  failed: number;
  errors?: Array<{ clientEventId: string; error: string }>;
};

/**
 * Contract for a future server sync adapter.
 *
 * Not implemented in V1 — this interface defines the boundary so
 * the client persistence layer can be wired to a server sync
 * endpoint without refactoring later.
 */
export interface SyncAdapter {
  /** Push unsynced events to the server. Must be idempotent. */
  syncEvents(events: SyncEvent[]): Promise<SyncResult>;

  /** Get the last server-confirmed sync timestamp. */
  getLastSyncTimestamp(): Promise<number | null>;
}
