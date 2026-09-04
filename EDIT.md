# Edit jpcarpenter.com yourself

No CMS. Posts are Markdown files. Four commands cover almost everything.

## First time this machine

```bash
cd ~/Desktop/Current/jpcarpenter
npm install
```

## Add a Writing post

```bash
cd ~/Desktop/Current/jpcarpenter
npm run new -- writing "Your title here"
```

That creates `src/content/writing/<slug>.md` with `draft: true`.

1. Open the new file — fill `description`, write the body.
2. Preview: `npm run dev` → open the localhost URL → `/writing/<slug>`
3. When ready: set `draft: false`
4. Ship:

```bash
npm run build && npm run deploy
```

`deploy` asks for confirmation, then uploads `dist/` to Njalla over SSH.

## Add a Lab or Project

```bash
npm run new -- lab "Lab title" --discipline grc
# discipline: grc | networking | security | instruments

npm run new -- project "Project title"
```

Same preview / build / deploy path. Labs are live as soon as they exist (no draft flag).

## Add a Tutorial

```bash
npm run new -- tutorial "Tutorial title" --discipline grc
# discipline: grc | networking | security | instruments
```

That creates `src/content/tutorials/<slug>.md` with `draft: true`. Same preview / ship
path as Writing. Recording workflow: `src/content/tutorials/01-README.md`.

## Edit something that already exists

Open the `.md` file under:

| Kind | Folder | Live URL |
|------|--------|----------|
| Writing | `src/content/writing/` | `/writing/<slug>` |
| Labs | `src/content/labs/` | `/labs/<slug>` |
| Projects | `src/content/projects/` | `/projects/<slug>` (listed on `/bench`) |
| Tutorials | `src/content/tutorials/` | `/tutorials/<slug>` |
| Resources | `src/content/resources/` | `/resources/<slug>` |

Save → `npm run build && npm run deploy`.

For a substantial rewrite of a published Writing post, bump `revision` by 1.

## Do not

- Paste remote image URLs (CSP blocks them — put images under `public/…`)
- Add `<script>`, `<style>`, or `<iframe>` in Markdown
- Publish claims that aren’t true

Field-by-field docs (only when you need them):

- Writing → `src/content/writing/01-README.md`
- Labs → `src/content/labs/01-README.md`
- Projects → `src/content/projects/01-README.md`
- Tutorials → `src/content/tutorials/01-README.md`
- Resources → `src/content/resources/01-README.md`

## If deploy fails

You need SSH to `root@80.78.27.111` working from this machine. Test with:

```bash
ssh root@80.78.27.111 'hostname'
```

Override host/path if needed:

```bash
DEPLOY_HOST=root@80.78.27.111 DEPLOY_ROOT=/var/www/jpcarpenter.com npm run deploy
```
