# Victor's Cloudflare Pages migration guide

Prepared August 28, 2026. This guide moves the finished portfolio to Cloudflare Pages while keeping Netlify DNS
and the existing ChatGPT Sites publication available as rollback options. It does not move domain registration,
change nameservers, or delete an existing site in the confirmed subdomain path.

## 1. Confirm the one name people will type

The confirmed production hostname is **`victor.she.energy`**, a subdomain of `she.energy`. Victor confirmed this
choice on August 28, 2026, and the portfolio and PDF already use it.

If that decision ever changes to `she.energy` without `victor.`, stop after Step 8 and use the separate apex-domain
path in Step 14. The apex currently serves another site, and Cloudflare requires a nameserver change for an apex
Pages domain. Do not replace `she.energy` by following the subdomain instructions.

Current public DNS evidence, checked August 28, 2026:

- `she.energy` uses Netlify's authoritative DNS servers and already has live A and AAAA records.
- `victor.she.energy` has no public DNS record yet, so the recommended subdomain can be added without replacing
  the apex website.
- `vic-portfolio.pages.dev` already belongs to an unrelated site. Cloudflare may therefore assign this project a
  suffixed address. Always copy the actual Pages address from Victor's Cloudflare dashboard.

## 2. Know which service does what

These are three separate jobs:

1. **Site hosting** stores and serves the portfolio files. Cloudflare Pages will take over this job.
2. **Authoritative DNS** is the address book that points `victor.she.energy` to the host. Netlify DNS can keep this
   job for the recommended migration.
3. **Domain registration** is the ownership, renewal, and billing for `she.energy`. The registrar may or may not
   be Netlify. This migration does not transfer the registration.

Cloudflare's subdomain instructions permit this split: Cloudflare can host the site while a third-party DNS
provider supplies the CNAME record. See [Cloudflare Pages custom domains][cloudflare-custom-domains] and
[Netlify's domain glossary][netlify-domain-glossary].

## 3. Save a rollback record before changing anything

1. Keep this working ChatGPT Sites URL bookmarked and untouched:
   <https://victor-ginelli-portfolio-demo.victor52668.chatgpt.site>.
2. Sign in to Netlify and open the Team dashboard.
3. Choose **DNS** in the left sidebar, then choose **`she.energy`**.
4. Select **Download records** and save the CSV somewhere private.
5. Take a screenshot of every record whose hostname is `victor.she.energy`, if any appears in the dashboard.
6. Check the account's Domains or registration panel separately. Write down the registrar's name, but do not
   transfer the domain or change its nameservers.

Netlify documents the dashboard path and record download in [Manage DNS records][netlify-manage-dns]. Public DNS
currently shows no `victor.she.energy` record, but the Netlify dashboard is the final check before cutover.

## 4. Create the empty Cloudflare Pages project

The repository already has a GitHub Actions deployment. Do **not** connect a second Cloudflare Git integration.
Create a **Direct Upload** project so the existing workflow remains the only deployment system.

1. Sign in to the Cloudflare account that will own the portfolio.
2. Open Terminal on the Mac that has the repository.
3. Run:

   ```sh
   cd "/Users/vict0xr/Documents/Shenanigan/vic-web"
   npx wrangler login
   npx wrangler pages project create
   ```

4. The browser will ask Victor to approve Wrangler for Cloudflare. Confirm that the correct Cloudflare account is
   selected.
5. When Terminal asks for a project name, enter **`vic-portfolio`**.
6. When it asks for the production branch, enter **`main`**.
7. Stop when the empty project has been created. Do not upload a folder manually and do not add a custom domain
   yet.

Cloudflare documents this empty-project flow in [Direct Upload][cloudflare-direct-upload]. The project name used by
GitHub Actions remains `vic-portfolio`, even if Cloudflare assigns a different public `*.pages.dev` address.

## 5. Create the least-privilege Cloudflare credential

The GitHub workflow needs permission to upload to Pages. It does not need permission to edit DNS, billing, or any
other Cloudflare product.

1. In Cloudflare, open the user menu and choose **My Profile > API Tokens**.
2. Select **Create Token**.
3. Under **Custom Token**, select **Get started**.
4. Name it something recognizable, such as `GitHub Actions - vic-portfolio`.
5. Add exactly this permission:

   | Scope | Product | Access |
   | --- | --- | --- |
   | Account | Cloudflare Pages | Edit |

6. Under account resources, include only the Cloudflare account that owns `vic-portfolio`.
7. Do not add a Zone DNS permission.
8. Select **Continue to summary**, verify the single permission and account, then select **Create Token**.
9. Copy the token once into a password manager or directly into the GitHub secret in Step 7. Never paste it into
   chat, a source file, a Git remote, a pull-request comment, or a workflow log.

Cloudflare's current CI instructions specify **Account > Cloudflare Pages > Edit**. Its general token guide explains
how to restrict a token to one account. See [Direct Upload with continuous integration][cloudflare-ci] and
[Create an API token][cloudflare-api-token].

## 6. Copy the Cloudflare account ID

1. In Cloudflare, open **Workers & Pages**.
2. Find **Account Details**.
3. Select the copy button beside **Account ID**.
4. Keep it ready for the next step. It is an identifier, not the API token, but this repository deliberately stores
   it in a GitHub Actions secret alongside the token.

Cloudflare also supports searching the dashboard for **Copy account ID**. See
[Find account and zone IDs][cloudflare-account-id].

## 7. Add the two hosting-critical GitHub secrets

Open <https://github.com/youngkidwarrior/vic-portfolio>, then repeat the following flow for each secret:

1. Select **Settings** under the repository name. If Settings is hidden, open the repository tab menu first.
2. In the left sidebar's **Security** section, select **Secrets and variables**, then **Actions**.
3. Select the **Secrets** tab.
4. Select **New repository secret**.
5. Enter the exact secret name and its matching value, then select **Add secret**.

Create these two repository secrets:

| Secret name | Value to enter |
| --- | --- |
| `CLOUDFLARE_API_TOKEN` | The token created in Step 5 |
| `CLOUDFLARE_ACCOUNT_ID` | The account ID copied in Step 6 |

The names must match exactly. Do not use the Variables tab. GitHub documents this path in
[Using secrets in GitHub Actions][github-secrets]. After saving, GitHub shows the secret name but never reveals its
value again.

`CLOUDFLARE_WEB_ANALYTICS_TOKEN` is not required for hosting. Leave it absent for the first deployment and see the
optional Step 15 later.

## 8. Verify the finished branch before publishing it

The finished branch is `codex/campaign-7-founder-identity`, at the top of the portfolio's Graphite stack. Submitting
or pushing feature branches does not deploy the site, but each later merge into `main` does.

1. In Terminal, run:

   ```sh
   cd "/Users/vict0xr/Documents/Shenanigan/vic-web"
   git switch codex/campaign-7-founder-identity
   git status --short --branch
   bun install --frozen-lockfile
   bun run check
   bunx playwright install chromium
   bun run test:e2e
   ```

2. Stop if `git status` shows unexpected file changes.
3. Stop if either verification command reports a failure. `bun run check` must finish type checking, unit tests,
   the production build, and prerendering. `bun run test:e2e` must pass its desktop and mobile browser checks.
4. Confirm that the resulting deployable folder is `build/client`.

Do not merge to work around a failed check. Fix or investigate the failure first.

## 9. Submit the stack and prepare the pull requests

Graphite tracks the portfolio as a causal stack. The submission command pushes every branch and opens or updates its
pull request without deploying `main`.

1. Run:

   ```sh
   gt submit --stack
   ```

2. Review the resulting pull requests from the bottom of the stack to the top:

   1. `codex/campaign-3-color-texture`
   2. `codex/campaign-4-simplicity`
   3. `codex/campaign-5-contribution-scope`
   4. `codex/campaign-6-resume-foundation`
   5. `codex/campaign-7-founder-identity`

3. Wait for the **Test and deploy / verify** check to pass on every pull request. Pull-request checks verify the site
   but do not run the deployment job.
4. Resolve any review comments and verify that GitHub shows no merge conflicts.

## 10. Confirm the public deployment, then merge

This is the publishing boundary. **Clicking the final merge confirmation sends the portfolio to public Cloudflare
Pages after the workflow checks pass.** It does not change custom-domain DNS yet.

Before proceeding, Victor should explicitly confirm:

> I reviewed the pull request and authorize this public Cloudflare Pages deployment.

Then:

1. Open the pull request's **Conversation** tab.
2. Confirm that all required checks are green and all review threads are resolved.
3. Select the repository's permitted merge method. If there is no repository-specific policy, **Squash and merge**
   keeps the release as one commit.
4. Select **Confirm merge** or **Confirm squash and merge**.
5. Open the repository's **Actions** tab, select the **Test and deploy** run for the new `main` commit, and wait for
   both **verify** and **deploy** to succeed.

GitHub's current button sequence is documented in [Merging a pull request][github-merge]. Do not bypass a failing
or required check.

## 11. Verify the real `*.pages.dev` deployment before touching DNS

1. In Cloudflare, open **Workers & Pages > vic-portfolio**.
2. Open the production deployment for the merged `main` commit.
3. Copy the exact production address Cloudflare displays. Record it here:

   ```text
   Actual Pages URL: https://________________________________.pages.dev
   ```

4. Do not assume it is `vic-portfolio.pages.dev`; that address is already occupied by an unrelated site.
5. Open the actual Pages URL in a private or incognito browser window.
6. Check all of the following before moving on:

   - The browser shows HTTPS with no certificate warning.
   - The homepage loads and all visible images appear.
   - `/resume` loads and **Download PDF** downloads and opens `victor-ginelli-resume.pdf`.
   - `/work/send` loads directly and survives a browser refresh.
   - `/work/shenanigan` loads directly and survives a browser refresh.
   - `/work/brightid` loads directly and survives a browser refresh.
   - `/work/open-source` loads directly and survives a browser refresh.
   - The **All work** links return to the homepage's work section.
   - Typing the same URL with `http://` ends at the secure `https://` address.
   - In a narrow browser window or on a phone, the menu opens, shows Work, Resume, and Contact, closes with Escape,
     and does not hide or overflow the page.

If any item fails, stop. The custom domain must not be added until the Pages address passes every check.

## 12. Associate the subdomain in Cloudflare before adding the Netlify record

This order matters. Cloudflare warns that adding only the CNAME, without first associating the custom domain with
the Pages project, can produce a `522` error.

1. In Cloudflare, open **Workers & Pages > vic-portfolio > Custom domains**.
2. Select **Set up a domain**.
3. Enter the confirmed hostname, `victor.she.energy`, and select **Continue**.
4. Cloudflare will show the DNS record it expects. Keep this page open and copy its exact target.
5. Confirm that the target is the actual project address from Step 11 and ends in `.pages.dev`.
6. Do not enter `https://`, a slash, or any page path in the DNS target.

See [Cloudflare Pages custom domains][cloudflare-custom-domains].

## 13. Add the exact CNAME in Netlify and wait for activation

1. In a second tab, open Netlify's Team dashboard.
2. Choose **DNS > she.energy**.
3. Scroll to **DNS records** and select **Add new record**.
4. Enter the values below, replacing the target with the exact address copied from Cloudflare:

   | Field | Value |
   | --- | --- |
   | Type | `CNAME` |
   | Host/name | `victor` (or `victor.she.energy` if Netlify asks for the full hostname) |
   | Target/value | `<actual-project-address>.pages.dev` |
   | TTL | Netlify's default |

5. Before selecting **Save**, compare every character with Cloudflare's custom-domain screen.
6. If Netlify shows an existing record for this exact hostname, do not touch any apex, `www`, email, NETLIFY, or
   NETLIFYv6 record. Preserve the existing record's type and value for rollback. If Netlify does not allow the new
   CNAME to coexist, stop and schedule the exact-host replacement rather than deleting unrelated records.
7. Select **Save**. This is the DNS cutover for `victor.she.energy`.
8. Return to Cloudflare's custom-domain page. Wait for the domain and its certificate to become **Active**.
9. Open `https://victor.she.energy` in a private window and repeat the complete Step 11 checklist.

Netlify says DNS changes may take up to 48 hours to reach every resolver, though most take effect within a few
hours. During that window, different people may see the old answer, the new site, or a temporary not-found error.
Do not keep flipping the record while caches expire. Use [Netlify's DNS propagation check][netlify-propagation] to
compare locations.

Cloudflare certificates normally progress from **Pending Validation** to **Active**. If HTTPS remains pending after
DNS has propagated, re-check the CNAME and inspect any CAA records; restrictive CAA records can prevent Cloudflare
from issuing the certificate. See [Cloudflare certificate statuses][cloudflare-cert-status] and the CAA section of
[Cloudflare Pages custom domains][cloudflare-custom-domains].

## 14. Separate alternative: only if the final hostname is `she.energy`

Do not mix this path with Steps 12-13. Cloudflare requires an apex Pages domain such as `she.energy` to be a
Cloudflare zone using Cloudflare nameservers. This changes authoritative DNS for the entire domain, including every
website, subdomain, email record, and verification record. It still does not require transferring the registration.

Because `she.energy` currently has live A and AAAA records, treat an apex move as its own reviewed migration:

1. Identify and gain access to the actual domain registrar.
2. Download Netlify's full DNS record CSV and inventory every A, AAAA, CNAME, MX, TXT, CAA, NS, and SRV record.
3. In Cloudflare, choose **Domains > Onboard a domain**, enter `she.energy`, and allow the initial DNS scan.
4. Compare Cloudflare's imported records against the Netlify export. Add anything the scan missed, especially mail
   and ownership-verification records. Do not continue until the two inventories are complete.
5. If DNSSEC is active at the registrar, follow Cloudflare's instructions to disable it before changing
   nameservers.
6. At the registrar, replace the Netlify nameservers with the two exact nameservers assigned by Cloudflare.
7. Wait for the Cloudflare zone to show **Active**, then re-enable DNSSEC through Cloudflare if it was disabled.
8. Only after the zone and all existing services work, open **Workers & Pages > vic-portfolio > Custom domains >
   Set up a domain** and enter `she.energy`.
9. Repeat the full Pages and HTTPS checks from Step 11.

The authoritative source for this higher-risk path is [Cloudflare's full nameserver setup][cloudflare-full-setup].
Cloudflare Pages' [custom-domain guide][cloudflare-custom-domains] confirms that the apex requires this setup.

## 15. Optional: enable Cloudflare Web Analytics later

Analytics is not required to build, deploy, serve HTTPS, or use the custom domain. The application safely omits its
analytics script when `CLOUDFLARE_WEB_ANALYTICS_TOKEN` is absent.

After hosting and DNS are stable, Victor can either leave analytics off or use Cloudflare's Pages integration:

1. Open **Workers & Pages > vic-portfolio > Metrics**.
2. Under **Web Analytics**, select **Enable**.
3. Allow the next deployment to add the analytics beacon.

See [Enable Web Analytics on Pages][cloudflare-web-analytics]. If Victor instead chooses to use the repository's
token-based script, add `CLOUDFLARE_WEB_ANALYTICS_TOKEN` through the same GitHub repository-secret path in Step 7.
Never place the token in source code or chat.

## 16. Roll back if the custom domain is not acceptable

The fastest safe fallback is always the unchanged ChatGPT Sites URL from Step 3. The Cloudflare Pages URL also
continues to work independently of custom DNS.

To undo only the custom-domain cutover:

1. Open Netlify **DNS > she.energy**.
2. If Step 3 recorded an old record for the exact chosen hostname, restore that exact type, name, and value. Add the
   saved record first if Netlify permits it, then delete only the Cloudflare CNAME. If Netlify rejects coexistence,
   delete only the Cloudflare CNAME and immediately recreate the saved record.
3. If there was no previous `victor.she.energy` record, delete only the new Cloudflare CNAME. Public DNS currently
   indicates this is the expected case.
4. Wait for DNS caches to expire and verify the restored destination.
5. Leave the Cloudflare project, Netlify site, domain registration, nameservers, and ChatGPT Sites publication
   untouched. Cloudflare may mark the Pages custom domain inactive after DNS points away; that is expected.

Cloudflare warns that pointing a custom domain away and later back to Pages requires reactivation, so do not toggle
it repeatedly. Netlify's add/delete behavior is documented in [Manage DNS records][netlify-manage-dns].

Keep the ChatGPT Sites URL available until Cloudflare has been correct over HTTPS, from multiple networks and
devices, for at least the full 48-hour propagation window and until Victor personally accepts the cutover.

## 17. Completion checklist

- [x] Victor confirmed the final hostname as `victor.she.energy`.
- [ ] The Netlify DNS records were exported and the registrar was identified separately.
- [ ] The Direct Upload Pages project is named `vic-portfolio` with production branch `main`.
- [ ] The API token has only **Account > Cloudflare Pages > Edit** for the intended account.
- [ ] `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` are GitHub repository secrets.
- [ ] `bun run check` passed on `codex/campaign-7-founder-identity`.
- [ ] `bun run test:e2e` passed on `codex/campaign-7-founder-identity`.
- [ ] Victor explicitly authorized the merge that publishes from `main`.
- [ ] The GitHub Actions **verify** and **deploy** jobs passed.
- [ ] The actual Cloudflare `*.pages.dev` URL passed every route, image, PDF, HTTPS, refresh, and mobile check.
- [ ] Cloudflare associated the custom domain before Netlify received the CNAME.
- [ ] The exact Netlify CNAME points to the actual assigned Pages address.
- [ ] The custom domain and certificate show Active and pass the complete browser checklist.
- [ ] The rollback record and ChatGPT Sites URL remain available through the acceptance period.
- [ ] Web Analytics is either intentionally off or enabled later as a separate optional choice.

## Official references used

- [Cloudflare Pages: Direct Upload][cloudflare-direct-upload]
- [Cloudflare Pages: Direct Upload with continuous integration][cloudflare-ci]
- [Cloudflare: Create an API token][cloudflare-api-token]
- [Cloudflare: Find account and zone IDs][cloudflare-account-id]
- [Cloudflare Pages: Custom domains][cloudflare-custom-domains]
- [Cloudflare: Certificate statuses][cloudflare-cert-status]
- [Cloudflare DNS: Full nameserver setup][cloudflare-full-setup]
- [Cloudflare Pages: Enable Web Analytics][cloudflare-web-analytics]
- [GitHub: Using secrets in GitHub Actions][github-secrets]
- [GitHub: Merging a pull request][github-merge]
- [Netlify: Domains glossary][netlify-domain-glossary]
- [Netlify: Manage DNS records][netlify-manage-dns]
- [Netlify: Check DNS propagation][netlify-propagation]

[cloudflare-direct-upload]: https://developers.cloudflare.com/pages/get-started/direct-upload/
[cloudflare-ci]: https://developers.cloudflare.com/pages/how-to/use-direct-upload-with-continuous-integration/
[cloudflare-api-token]: https://developers.cloudflare.com/fundamentals/api/get-started/create-token/
[cloudflare-account-id]: https://developers.cloudflare.com/fundamentals/account/find-account-and-zone-ids/
[cloudflare-custom-domains]: https://developers.cloudflare.com/pages/configuration/custom-domains/
[cloudflare-cert-status]: https://developers.cloudflare.com/ssl/reference/certificate-statuses/
[cloudflare-full-setup]: https://developers.cloudflare.com/dns/zone-setups/full-setup/setup/
[cloudflare-web-analytics]: https://developers.cloudflare.com/pages/how-to/web-analytics/
[github-secrets]: https://docs.github.com/en/actions/how-tos/write-workflows/choose-what-workflows-do/use-secrets?tool=webui
[github-merge]: https://docs.github.com/en/pull-requests/how-tos/merge-and-close-pull-requests/merging-a-pull-request?tool=webui
[netlify-domain-glossary]: https://docs.netlify.com/manage/domains/domains-fundamentals/domains-glossary/
[netlify-manage-dns]: https://docs.netlify.com/manage/domains/manage-domains/manage-dns-records/
[netlify-propagation]: https://docs.netlify.com/manage/domains/troubleshooting/check-dns-propagation/
