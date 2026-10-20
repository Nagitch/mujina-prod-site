# Publishing and supply-chain operations

## Production ownership and path

Owner: `Nagitch` / MUJINA. The canonical site is <https://www.mujina-prod.com>;
the apex domain redirects to it. Vercel project `mujina-prod-site`
(`prj_plZl6I2wOCrQQ8w9deriYm3kjxfC`, team `team_v1tCFsk0dHcDoIres7nH6mRs`)
connects directly to `Nagitch/mujina-prod-site`, production branch `main`,
repository root, SvelteKit, Node 24.x. The workbench only records the released
commit; it neither builds nor publishes this site.

`vercel.json` requires a frozen installation with the package manager pinned in
`package.json`. The pnpm policy and lockfile travel with this repository.
No new credentials or environment variables are needed for this change.

Before merging, require the Validate job to succeed and check the Vercel preview
for the exact PR commit. After merging, confirm a **production** deployment is
READY for the merge commit, with the custom domains assigned. A failed preview
or the project's generic “latest deployment” is not production status.
Check `/`, `/blog/`, `/portfolio/`, direct article routes, images and
`/feed.json`. PWA/offline acceptance is separate work in #53.

To roll back urgently, promote the previous known-good production deployment in
this Vercel project, then revert the problematic merge through a checked PR.
Verify aliases and routes again. Pause this project's Git deployments in Vercel
if publishing must stop. No database migration is involved.

## Redundant and legacy targets

- GitHub's repository API returned `has_pages: false` on 2026-10-20. The old
  workflow only wrote generated output to `gh-pages`, also causing failing
  Vercel previews of that output. Remove the workflow and its write token;
  preserve the historical branch. Do not re-enable Pages as a second publisher.
- `netlify.toml` is inherited configuration. The Netlify adapter was removed in
  #50. No authenticated Netlify account inventory is available in this task, so
  external site/build-hook usage remains **Unknown**. Retain the file until
  the owner checks Netlify's site inventory, repository linkage and build hooks;
  its install command now uses the same pinned pnpm and frozen lockfile.
  Retention does not make Netlify a supported or verified production target.
- Static and Node adapters remain for independent local validation and serving.
  They are not additional automatic publishers.

## Installation policy

Use pnpm **10.34.7** and Node **24.x**. The former `pnpm.allowedBuildScripts`
field did not enforce approvals under pnpm 9 and has been removed.
The product-local `pnpm-workspace.yaml` includes no sibling packages.

Following [pnpm's versioned build-policy reference](https://pnpm.io/10.x/settings#allowbuilds),
`allowBuilds` approves only esbuild 0.28.2 and Sharp 0.35.5 install hooks.
The optional macOS fsevents hook is explicitly denied; its packaged binary and
the normal watcher path are verified without running that hook.
`strictDepBuilds: true` makes unknown packages or unapproved versions fail
installation instead of silently continuing. Exact package-manager checking is
also enabled. This limits dependency lifecycle hooks; it does not sandbox
approved packages or application/build code.

For updates, inspect changed hook source and dependency provenance before
adjusting approvals. Never use `dangerouslyAllowAllBuilds` or blanket approvals
to make CI green. Run `pnpm verify:install-policy`: disposable local registry
fixtures prove approved hooks run, unknown packages and versions fail without
executing hooks, and explicitly denied hooks are skipped. Fresh stores prevent
cache reuse from masking execution. CI repeats this check. A clean frozen
installation and `pnpm verify:build` verify actual native tooling and AVIF output.

## GitHub controls

Settings below were changed and read back through GitHub's API on 2026-10-20:

| Control | Confirmed state |
| --- | --- |
| Dependabot vulnerability alerts | Enabled (check endpoint HTTP 204) |
| Dependabot security updates | Enabled, not paused |
| Secret scanning | Enabled |
| Secret scanning push protection | Enabled |
| Default Actions token | Read |
| Actions may approve pull requests | Disabled |
| Actions must use full commit SHA pins | Enabled |

`.github/dependabot.yml` requests weekly npm/pnpm and GitHub Actions updates on
Mondays at 09:00 Asia/Tokyo. Minor/patch version updates are grouped; major
updates remain separate. Security updates are enabled independently of this
weekly schedule. These PRs still require review and verification, not auto-merge.
See [Dependabot options](https://docs.github.com/en/code-security/reference/supply-chain-security/dependabot-options-reference).

The remaining validation workflow pins every action to a full commit SHA,
requests only `contents: read`, and does not persist checkout credentials.
It runs on ordinary pull requests, not `pull_request_target`; install/build
validation needs no deployment credentials.

These repository settings live on GitHub, not in a clone. Reapply and read back
them when moving the repository. Use Settings → Code security and Settings →
Actions → General. Do not infer a setting's status from absent configuration.
Push protection is preventive; rotate any credential found exposed.

Known dependency audit findings remain tracked in #56 and
[dependency maintenance](dependency-maintenance.md). Enabling safeguards does
not resolve those advisories or prove that every dependency is safe.
The first security-update jobs ran after enablement, but reported
`security_update_not_possible` for KaTeX and postcss-selector-parser because
their parent dependency constraints exclude the fixed versions. Those jobs
confirm execution, not successful remediation; continue handling them in #56.
