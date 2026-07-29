# White Flash Fix on Super Admin Pages

## Root Cause Analysis
- SuperAdminLayout uses `<AnimatePresence>` with `initial={{ opacity: 0, y: 8 }}` causing opacity fade-in from transparent
- All admin pages are lazy-loaded, causing initial loading delay
- No background color on motion wrapper → white shows through during opacity transition

## Tasks

### [x] 1. Fix `SuperAdminLayout.tsx` ✅
- [x] Add `bg-gray-50 dark:bg-gray-900` to motion wrapper to prevent white flash during opacity animation
- [x] Add `initial={false}` to AnimatePresence to skip initial mount animation
- [x] Add `bg-gray-50 dark:bg-gray-900` class to `<main>` element for consistent background
- [x] Reduce animation duration from 0.15s to 0.12s for snappier transitions

### [x] 2. Fix `App.tsx` ✅
- [x] Eagerly import critical admin pages (DashboardPage, InstitutionsPage) to avoid lazy load delay
- [x] Keep remaining pages lazy-loaded but with proper Suspense handling

### [x] 3. Summary of Changes ✅
- **Root causes addressed:**
  1. `AnimatePresence` with `initial={{ opacity: 0 }}` on route mount → `/admin/dashboard` first load faded in from transparent, causing white flash. **Fix: `initial={false}` on AnimatePresence prevents initial mount animation**
  2. No background color on motion wrapper → during opacity fade, white background showed through. **Fix: added `bg-gray-50 dark:bg-gray-900` to both main container and motion wrapper**
  3. Lazy-loaded pages (Dashboard, Institutions) had to download chunks on first visit → slight delay with spinner on white background. **Fix: eagerly import Dashboard and Institutions as they're the most visited pages**

