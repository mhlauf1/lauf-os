# Creative Library

The Creative Library is a simple pipeline for collecting, curating, and building from design assets and code.

## Overview

The library organizes creative assets into two categories with a simple active/archived status.

**Core Value:**
- Centralize creative assets (designs and developed code)
- Store actual code with one-click copy
- Simple two-category organization
- Link items to goals for progress tracking
- Organize items into collections

---

## Data Model

### LibraryItem

| Field | Type | Description |
|-------|------|-------------|
| `id` | UUID | Primary key |
| `userId` | UUID | Owner |
| `type` | LibraryItemType | DESIGN or DEVELOPED |
| `status` | LibraryItemStatus | ACTIVE or ARCHIVED |
| `title` | String | Item name |
| `description` | String? | Details about the item |
| `sourceUrl` | String? | Original source link |
| `figmaUrl` | String? | Figma file link |
| `githubUrl` | String? | GitHub repo link |
| `code` | String? | Actual code content |
| `language` | String? | Code language (tsx, css, etc.) |
| `thumbnailUrl` | String? | Preview image URL |
| `tags` | String[] | Searchable tags |
| `techStack` | String[] | Technologies used |
| `goalId` | UUID? | Linked goal for progress tracking |

### Collection

| Field | Type | Description |
|-------|------|-------------|
| `id` | UUID | Primary key |
| `userId` | UUID | Owner |
| `name` | String | Collection name |
| `description` | String? | What's in this collection |
| `color` | String? | Hex color for UI |
| `icon` | String? | Lucide icon name |
| `sortOrder` | Int | Display order |

### CollectionItem

| Field | Type | Description |
|-------|------|-------------|
| `id` | UUID | Primary key |
| `collectionId` | UUID | Parent collection |
| `libraryItemId` | UUID | Library item |
| `sortOrder` | Int | Order within collection |
| `addedAt` | DateTime | When added |

### LibraryItemType

| Type | Description |
|------|-------------|
| `DESIGN` | Screenshots, videos, Figma files, visual references |
| `DEVELOPED` | Components, sections, pages, templates - built code |

### LibraryItemStatus

| Status | Description |
|--------|-------------|
| `ACTIVE` | Current, visible items |
| `ARCHIVED` | Hidden from main view |

---

## Features

### Gallery View Toggle

Toggle between grid and list views on `/library`. View preference persists in localStorage.

- **Grid view**: Card layout with thumbnails and hover previews
- **List view**: Table layout with columns for type, status, tags, code, dates

### Type Filtering

Filter by category using the type buttons:
- **Design**: Visual references, screenshots, Figma files
- **Developed**: Built code - components, sections, templates

### Status Filtering

Filter by status using tabs:
- **All**: Show all items
- **Active**: Current items (default)
- **Archived**: Hidden items

### Code Storage

Store actual code in library items:
- Choose language (TypeScript, CSS, JavaScript, etc.)
- Syntax-highlighted code display
- One-click copy to clipboard
- Code fields only shown for DEVELOPED type

### Collections

Organize items into collections at `/library/collections`:
- Create collections with custom name, color, and icon
- Add items to collections from the card menu
- View collection contents
- Items can belong to multiple collections

### Image Uploads

Upload thumbnails directly to Supabase Storage:
- Drag & drop images onto the upload zone
- Or paste a URL in the URL tab
- Supported formats: PNG, JPG, WebP, GIF (max 5MB)
- Files stored at `library/{user_id}/{filename}`

### Goal Linking

Link library items to goals:
- Creating an item increments linked goal progress
- Deleting an item decrements goal progress
- Track creation output toward monthly goals

---

## API Endpoints

### Library Items

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/library` | List items with filters |
| POST | `/api/library` | Create item |
| GET | `/api/library/[id]` | Get single item |
| PATCH | `/api/library/[id]` | Update item |
| DELETE | `/api/library/[id]` | Delete item |

### Collections

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/collections` | List collections |
| POST | `/api/collections` | Create collection |
| GET | `/api/collections/[id]` | Get collection with items |
| PATCH | `/api/collections/[id]` | Update collection |
| DELETE | `/api/collections/[id]` | Delete collection |
| POST | `/api/collections/[id]/items` | Add item to collection |
| DELETE | `/api/collections/[id]/items` | Remove item from collection |

### Uploads

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/upload/library` | Upload image file |

---

## React Query Hooks

### Library Hooks

```typescript
import {
  useLibrary,
  useLibraryItem,
  useCreateLibraryItem,
  useUpdateLibraryItem,
  useDeleteLibraryItem,
  useUploadLibraryImage,
} from '@/hooks/use-library'
```

### Collection Hooks

```typescript
import {
  useCollections,
  useCollection,
  useCreateCollection,
  useUpdateCollection,
  useDeleteCollection,
  useAddCollectionItem,
  useRemoveCollectionItem,
} from '@/hooks/use-collections'
```

---

## UI Components

### Library Components

| Component | Description |
|-----------|-------------|
| `LibraryItemCard` | Card with hover preview, badges, quick copy |
| `LibraryItemForm` | Create/edit dialog with 2-button type selector |
| `LibraryGrid` | Responsive grid of cards |
| `LibraryListView` | Table view with sortable columns |
| `ImageUpload` | Drag-drop upload with URL fallback |

### Collection Components

| Component | Description |
|-----------|-------------|
| `CollectionCard` | Collection in grid with icon/color |
| `CollectionForm` | Create/edit with icon/color pickers |
| `AddToCollectionDialog` | Add item to collections |

### Shared Components

| Component | Description |
|-----------|-------------|
| `ViewToggle` | Grid/list view switcher |

---

## Pages

| Route | Description |
|-------|-------------|
| `/library` | Main library with filters, search, view toggle |
| `/library/[id]` | Item detail with edit/delete |
| `/library/collections` | Collections list |
| `/library/collections/[id]` | Collection detail with items |

---

## Config Files

| File | Exports |
|------|---------
| `src/config/library.ts` | Type/status/language configs |
| `src/config/collection.ts` | Collection colors and icons |

---

## Supabase Setup

### Storage Bucket

Create a `library` bucket in Supabase Storage with these policies:

| Operation | Policy |
|-----------|--------|
| SELECT | Users can read their own folder |
| INSERT | Users can upload to their own folder |
| DELETE | Users can delete from their own folder |

Policy uses `auth.uid()` to match folder name.

### Next.js Config

Allow Supabase images in `next.config.ts`:

```typescript
images: {
  remotePatterns: [
    {
      protocol: 'https',
      hostname: '*.supabase.co',
      pathname: '/storage/v1/object/public/**',
    },
  ],
}
```

---

## Migration Note

When migrating from the old 9-type/5-status model:
- `INSPIRATION`, `AI_IMAGE`, `DESIGN_FILE` → `DESIGN`
- `COMPONENT`, `SECTION`, `PAGE`, `SNIPPET`, `TEMPLATE`, `IDEA` → `DEVELOPED`
- `INBOX`, `CURATED`, `QUEUED`, `IN_PROGRESS` → `ACTIVE`
- `COMPLETED` → `ARCHIVED`
