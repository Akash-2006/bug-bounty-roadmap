/**
 * The current domain schema version. Every persisted database and every export
 * file is stamped with this value so we can run forward migrations later.
 * See ADR 0011.
 */
export const SCHEMA_VERSION = 1;

/** LocalStorage/DB namespace prefix for the app. */
export const APP_NAMESPACE = "bbu";
