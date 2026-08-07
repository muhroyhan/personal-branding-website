import pkg from "@/package.json";

/**
 * Single source of truth for the deployed version: `package.json#version`.
 * Bumped automatically by `release.yml` (semantic-release, driven by
 * Conventional Commits on `main`) — never edited by hand. See README
 * "Versioning".
 */
export const APP_VERSION: string = pkg.version;
