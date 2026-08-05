# Graph Report - .  (2026-08-05)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 200 nodes · 306 edges · 16 communities (12 shown, 4 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 2 edges (avg confidence: 0.5)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `9973143c`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- layout.tsx
- auth.ts
- scripts
- seed/route.ts
- compilerOptions
- dependencies
- Game.tsx
- seed-commons.mjs
- db.ts
- include
- migrate.mjs
- vercel.json
- next.config.mjs
- next-env.d.ts

## God Nodes (most connected - your core abstractions)
1. `compilerOptions` - 17 edges
2. `getSessionUser()` - 12 edges
3. `useSession()` - 11 edges
4. `query()` - 10 edges
5. `GET()` - 9 edges
6. `queryOne()` - 9 edges
7. `isAdminEmail()` - 7 edges
8. `scripts` - 7 edges
9. `main()` - 7 edges
10. `POST()` - 6 edges

## Surprising Connections (you probably didn't know these)
- `AdminPage()` --calls--> `useSession()`  [EXTRACTED]
  app/admin/page.tsx → components/SessionProvider.tsx
- `GET()` --calls--> `query()`  [EXTRACTED]
  app/api/admin/images/route.ts → lib/db.ts
- `GET()` --calls--> `query()`  [EXTRACTED]
  app/api/admin/seed/route.ts → lib/db.ts
- `GET()` --calls--> `queryOne()`  [EXTRACTED]
  app/api/admin/seed/route.ts → lib/db.ts
- `GET()` --calls--> `getSessionUser()`  [EXTRACTED]
  app/api/images/mine/route.ts → lib/auth.ts

## Import Cycles
- None detected.

## Communities (16 total, 4 thin omitted)

### Community 0 - "layout.tsx"
Cohesion: 0.10
Nodes (22): AdminPage(), PendingImage, JSON_LD, metadata, LoginPage(), SignupPage(), MyImage, UploadPage() (+14 more)

### Community 1 - "auth.ts"
Cohesion: 0.20
Nodes (17): PATCH(), GET(), POST(), GET(), POST(), createSessionToken(), getSecretKey(), getSessionUser() (+9 more)

### Community 2 - "scripts"
Cohesion: 0.09
Nodes (21): devDependencies, @types/bcryptjs, @types/node, @types/pg, @types/react, typescript, name, private (+13 more)

### Community 3 - "seed/route.ts"
Cohesion: 0.18
Nodes (18): CATEGORIES, commonsApi(), downloadBuffer(), dynamic, fetchImageInfo(), GET(), ImageInfo, listCategoryFiles() (+10 more)

### Community 4 - "compilerOptions"
Cohesion: 0.10
Nodes (20): dom, dom.iterable, esnext, compilerOptions, allowJs, baseUrl, esModuleInterop, incremental (+12 more)

### Community 5 - "dependencies"
Cohesion: 0.12
Nodes (17): bcryptjs, jose, nanoid, next, dependencies, bcryptjs, jose, nanoid (+9 more)

### Community 6 - "Game.tsx"
Cohesion: 0.18
Nodes (11): burstConfetti(), FACTS, Game(), GameImage, loadScores(), Mode, pick(), playCorrectSound() (+3 more)

### Community 7 - "seed-commons.mjs"
Cohesion: 0.28
Nodes (12): CATEGORIES, commonsApi(), downloadBuffer(), fetchImageInfo(), listCategoryFiles(), looksLikePhoto(), main(), NOTE: this script needs outbound internet access to commons.wikimedia.org. (+4 more)

### Community 8 - "db.ts"
Cohesion: 0.36
Nodes (7): dynamic, GET(), shuffle(), GET(), createPool(), getPool(), query()

### Community 9 - "include"
Cohesion: 0.22
Nodes (8): .next/dev/types/**/*.ts, next-env.d.ts, .next/types/**/*.ts, node_modules, **/*.ts, **/*.tsx, exclude, include

## Knowledge Gaps
- **73 isolated node(s):** `PendingImage`, `dynamic`, `maxDuration`, `CATEGORIES`, `SKIP_WORDS` (+68 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **4 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `dependencies` connect `dependencies` to `scripts`?**
  _High betweenness centrality (0.024) - this node is a cross-community bridge._
- **Why does `compilerOptions` connect `compilerOptions` to `include`?**
  _High betweenness centrality (0.017) - this node is a cross-community bridge._
- **What connects `PendingImage`, `dynamic`, `maxDuration` to the rest of the system?**
  _73 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `layout.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.09848484848484848 - nodes in this community are weakly interconnected._
- **Should `scripts` be split into smaller, more focused modules?**
  _Cohesion score 0.09090909090909091 - nodes in this community are weakly interconnected._
- **Should `compilerOptions` be split into smaller, more focused modules?**
  _Cohesion score 0.1 - nodes in this community are weakly interconnected._
- **Should `dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.11764705882352941 - nodes in this community are weakly interconnected._