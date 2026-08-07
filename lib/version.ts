import pkg from "@/package.json";

/**
 * Single source of truth for the deployed version: `package.json#version`.
 * Bumped as part of the release PR (see README "Release checklist"); the
 * `release.yml` workflow tags and publishes a GitHub Release from whatever
 * value lands here once it reaches `main` — nothing here needs to change
 * in lockstep with that workflow.
 */
export const APP_VERSION: string = pkg.version;
