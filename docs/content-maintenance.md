# Content and draft maintenance

## Preserved unfinished article (#41)

PR [#41](https://github.com/Nagitch/mujina-prod-site/pull/41) was closed without
merging on 2026-10-20. Its 67-line unfinished article was not published.

- Original branch: `feature/blog-metrics-integration` (retained remotely).
- Preservation tag: `archive/pr-41-unfinished-2026-10-20`.
- Both point to `91d258156362c6c04a4dc0d4291b4802c7d41539`.
- Source: `urara/blog/web-app-metrics-fundamentals/+page.svelte.md`.

Inspect without changing the checkout:

```sh
git fetch origin tag archive/pr-41-unfinished-2026-10-20
git show archive/pr-41-unfinished-2026-10-20:urara/blog/web-app-metrics-fundamentals/+page.svelte.md
```

To resume, create a new branch from current `main` and explicitly restore only
the draft file from the tag. Review and complete the content before opening a
new publication PR. Do not merge the old branch wholesale into current `main`.
The tag preserves the original commit and its history even if the branch is
later removed. No draft file is included in this maintenance release.

## Public-link review (2026-10-20)

Checked 58 unique HTTP(S) anchor URLs in generated home, blog, portfolio, all five published articles and the public slide export using bounded HTTP GET requests with redirects. After the local link fixes, 56 returned HTTP 200 and two returned HTTP 403. Embedded services are outside this anchor audit.

- Primary local routes, article routes, feeds and sitemap returned HTTP 200.
- GitHub profile/repositories, Booth, SoundCloud, Rhai and cited documentation
  returned 200, sometimes after redirects. Twitter redirected to X. A 200
  response establishes reachability, not the accuracy or availability of every
  authenticated profile feature.
- Stack Overflow and VRChat returned 403. These are **access restricted / not
  verified**, not confirmed dead links. Their URLs and profile facts remain
  unchanged. Contact delivery/account ownership were not tested.
- Article tag links incorrectly targeted `/?tags=...`, where there is no blog
  filter. They now target `/blog/?tags=...`, encode spaces/Japanese/special
  characters, and preserve filter state on direct entry, selection and reload.
- A Docker tutorial linked its literal `YOUR_HOST_NAME_OR_IP` placeholder.
  It is now shown as code, preserving the example rather than presenting a
  non-resolvable host as a public link.
- Browser validation on Brave/macOS confirmed a direct `Mac Mini` filter, keyboard selection/removal, URL updates, and a `Rust` filter retained after reload with one matching article.
- No confirmed external 404/410 was found in this bounded set. No external URL
  or contact destination was replaced based on guesses.

## Deferred factual review (#54 remains open)

Biography, employment, client/project descriptions, ongoing-date claims and
profile facts were **not reviewed with the owner and were not changed**.
Technical documentation, metadata, link mechanics and draft preservation are
complete independently of this review. Keep [#54](https://github.com/Nagitch/mujina-prod-site/issues/54)
open until the owner supplies instructions for the factual content. Do not
interpret this record or older portfolio dates as authorization to rewrite it.
