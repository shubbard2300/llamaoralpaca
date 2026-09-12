# Graph Report - llamaoralpaca  (2026-08-05)

## Corpus Check
- 48 files · ~38,367 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 265 nodes · 360 edges · 25 communities (16 shown, 9 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 2 edges (avg confidence: 0.5)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `9f0d9d56`
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
- What You Must Do When Invoked
- graphify reference: extra exports and benchmark
- migrate.mjs
- vercel.json
- next.config.mjs
- next-env.d.ts
- graphify reference: query, path, explain
- graphify reference: add a URL and watch a folder
- graphify reference: commit hook and native CLAUDE.md integration
- graphify reference: incremental update and cluster-only
- graphify
- graphify reference: GitHub clone and cross-repo merge
- graphify reference: transcribe video and audio
- .claude/CLAUDE.md
- extraction-spec.md

## God Nodes (most connected - your core abstractions)
1. `compilerOptions` - 17 edges
2. `What You Must Do When Invoked` - 12 edges
3. `getSessionUser()` - 12 edges
4. `useSession()` - 11 edges
5. `/graphify` - 10 edges
6. `query()` - 10 edges
7. `GET()` - 9 edges
8. `queryOne()` - 9 edges
9. `graphify reference: extra exports and benchmark` - 8 edges
10. `isAdminEmail()` - 7 edges

## Surprising Connections (you probably didn't know these)
- `AdminPage()` --calls--> `useSession()`  [EXTRACTED]
  app/admin/page.tsx → components/SessionProvider.tsx
- `GET()` --calls--> `query()`  [EXTRACTED]
  app/api/admin/seed/route.ts → lib/db.ts
- `GET()` --calls--> `queryOne()`  [EXTRACTED]
  app/api/admin/seed/route.ts → lib/db.ts
- `POST()` --calls--> `getSessionUser()`  [EXTRACTED]
  app/api/images/upload/route.ts → lib/auth.ts
- `LoginPage()` --calls--> `useSession()`  [EXTRACTED]
  app/login/page.tsx → components/SessionProvider.tsx

## Import Cycles
- None detected.

## Communities (25 total, 9 thin omitted)

### Community 0 - "layout.tsx"
Cohesion: 0.10
Nodes (22): AdminPage(), PendingImage, JSON_LD, metadata, LoginPage(), SignupPage(), MyImage, UploadPage() (+14 more)

### Community 1 - "auth.ts"
Cohesion: 0.14
Nodes (24): PATCH(), GET(), POST(), GET(), POST(), dynamic, GET(), shuffle() (+16 more)

### Community 2 - "scripts"
Cohesion: 0.09
Nodes (21): devDependencies, @types/bcryptjs, @types/node, @types/pg, @types/react, typescript, name, private (+13 more)

### Community 3 - "seed/route.ts"
Cohesion: 0.18
Nodes (18): CATEGORIES, commonsApi(), downloadBuffer(), dynamic, fetchImageInfo(), GET(), ImageInfo, listCategoryFiles() (+10 more)

### Community 4 - "compilerOptions"
Cohesion: 0.07
Nodes (28): dom, dom.iterable, esnext, .next/dev/types/**/*.ts, next-env.d.ts, .next/types/**/*.ts, node_modules, **/*.ts (+20 more)

### Community 5 - "dependencies"
Cohesion: 0.12
Nodes (17): bcryptjs, jose, nanoid, next, dependencies, bcryptjs, jose, nanoid (+9 more)

### Community 6 - "Game.tsx"
Cohesion: 0.18
Nodes (11): burstConfetti(), FACTS, Game(), GameImage, loadScores(), Mode, pick(), playCorrectSound() (+3 more)

### Community 7 - "seed-commons.mjs"
Cohesion: 0.28
Nodes (12): CATEGORIES, commonsApi(), downloadBuffer(), fetchImageInfo(), listCategoryFiles(), looksLikePhoto(), main(), NOTE: this script needs outbound internet access to commons.wikimedia.org. (+4 more)

### Community 8 - "What You Must Do When Invoked"
Cohesion: 0.08
Nodes (24): For /graphify add and --watch, For /graphify query, For the commit hook and native CLAUDE.md integration, For --update and --cluster-only, /graphify, Honesty Rules, Interpreter guard for subcommands, Part A - Structural extraction for code files (+16 more)

### Community 9 - "graphify reference: extra exports and benchmark"
Cohesion: 0.22
Nodes (8): graphify reference: extra exports and benchmark, Step 6b - Wiki (only if --wiki flag), Step 7 - Neo4j export (only if --neo4j or --neo4j-push flag), Step 7a - FalkorDB export (only if --falkordb or --falkordb-push flag), Step 7b - SVG export (only if --svg flag), Step 7c - GraphML export (only if --graphml flag), Step 7d - MCP server (only if --mcp flag), Step 8 - Token reduction benchmark (only if total_words > 5000)

### Community 16 - "graphify reference: query, path, explain"
Cohesion: 0.33
Nodes (5): For /graphify explain, For /graphify path, graphify reference: query, path, explain, Step 0 — Constrained query expansion (REQUIRED before traversal), Step 1 — Traversal

### Community 17 - "graphify reference: add a URL and watch a folder"
Cohesion: 0.50
Nodes (3): For /graphify add, For --watch, graphify reference: add a URL and watch a folder

### Community 18 - "graphify reference: commit hook and native CLAUDE.md integration"
Cohesion: 0.50
Nodes (3): For git commit hook, For native CLAUDE.md integration, graphify reference: commit hook and native CLAUDE.md integration

### Community 19 - "graphify reference: incremental update and cluster-only"
Cohesion: 0.50
Nodes (3): For --cluster-only, For --update (incremental re-extraction), graphify reference: incremental update and cluster-only

## Knowledge Gaps
- **116 isolated node(s):** `graphify`, `Usage`, `What graphify is for`, `Step 0 - GitHub repos and multi-path merge (only if a URL or several paths)`, `Step 1 - Ensure graphify is installed` (+111 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **9 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `dependencies` connect `dependencies` to `scripts`?**
  _High betweenness centrality (0.013) - this node is a cross-community bridge._
- **What connects `graphify`, `Usage`, `What graphify is for` to the rest of the system?**
  _116 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `layout.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.09848484848484848 - nodes in this community are weakly interconnected._
- **Should `auth.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.14453781512605043 - nodes in this community are weakly interconnected._
- **Should `scripts` be split into smaller, more focused modules?**
  _Cohesion score 0.09090909090909091 - nodes in this community are weakly interconnected._
- **Should `compilerOptions` be split into smaller, more focused modules?**
  _Cohesion score 0.06896551724137931 - nodes in this community are weakly interconnected._
- **Should `dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.11764705882352941 - nodes in this community are weakly interconnected._