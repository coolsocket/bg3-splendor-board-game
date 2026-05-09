# Asset Upload and Soundtrack List Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Upload game card assets to Google Cloud Storage and identify top 10 BG3 soundtrack titles.

**Architecture:** Use `gcloud storage` CLI for recursive upload with structure preservation. Soundtrack list will be provided based on popular rankings.

**Tech Stack:** `gcloud` CLI, bash.

---

### Task 1: Upload Assets to GCS

**Files:**
- Source: `bg3_splendor_game_2/src/assets/cards/`
- Destination: `gs://bg3-splendor-static-assets/cards/`

- [ ] **Step 1: Unset proxies and perform recursive upload**

Run:
```bash
unset http_proxy https_proxy all_proxy ftp_proxy CLOUDSDK_CONTEXT_AWARE_USE_ECP_HTTP_PROXY
gcloud storage cp -r /Users/yehao/Desktop/Code/Claude/bg3_splendor_game_2/src/assets/cards/* gs://bg3-splendor-static-assets/cards/
```

- [ ] **Step 2: Verify upload (optional check of a few files)**

Run:
```bash
gcloud storage ls gs://bg3-splendor-static-assets/cards/Tier1/
```

### Task 2: Identify Top 10 BG3 Soundtrack Titles

- [ ] **Step 1: Compile Top 10 list**
Based on popularity and length (3-6 mins):
1. Main Theme (Part 1)
2. Down by the River
3. I Want to Live
4. Borislav Slavov - Raphael's Final Act
5. The Power (Choral Version)
6. Nightsong
7. Song of Balduran
8. Twisted Force
9. Dream Visitor
10. Weeping Dawn

- [ ] **Step 2: Verify track lengths (approximate)**
- Main Theme: ~4:00
- Down by the River: ~2:20 (short, maybe replace)
- I Want to Live: ~4:00
- Raphael's Final Act: ~3:00
- The Power: ~4:00
- Nightsong: ~3:30
- Song of Balduran: ~3:00
- Twisted Force: ~3:30
- Dream Visitor: ~3:30
- Weeping Dawn: ~2:30

Revised List for 3-6 mins:
1. Main Theme
2. I Want to Live
3. The Power
4. Nightsong
5. Song of Balduran
6. Raphael's Final Act
7. Twisted Force
8. Dream Visitor
9. Harpie's Song (The Lure)
10. The Battle of Baldur's Gate

### Task 3: Final Report

- [ ] **Step 1: Report status of upload and the list**
Summary of successful upload and the final list.
