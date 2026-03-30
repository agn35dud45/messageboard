# messageboard

Simple Next.js (App Router) + Supabase app.

## What it does
- Lets users type a text message and press **Save**
- Shows a list of saved messages
- Lets users delete messages

## Requirements (Supabase)
Your Supabase table must be named `message_items` with:
- `id` (uuid, primary key)
- `text` (text)
- `created_at` (timestamptz)

### Anonymous access (no Auth required)
This app is designed to work with the Supabase **anon key**, even if the visitor is not logged in.
So your table must allow `anon` to `select/insert/delete`.

Run this in Supabase SQL editor (adjust roles/policies if you already customized them):
```sql
alter table public.message_items enable row level security;

grant select, insert, delete on table public.message_items to anon, authenticated;

drop policy if exists message_items_select_anon on public.message_items;
create policy message_items_select_anon
on public.message_items for select
to anon
using (true);

drop policy if exists message_items_insert_anon on public.message_items;
create policy message_items_insert_anon
on public.message_items for insert
to anon
with check (true);

drop policy if exists message_items_delete_anon on public.message_items;
create policy message_items_delete_anon
on public.message_items for delete
to anon
using (true);
```

## Configure environment variables
Create `web/.env.local`:

`web/.env.local`
```env
NEXT_PUBLIC_SUPABASE_URL=PASTE_YOUR_SUPABASE_PROJECT_URL_HERE
NEXT_PUBLIC_SUPABASE_ANON_KEY=PASTE_YOUR_SUPABASE_ANON_PUBLIC_KEY_HERE
```

You can copy the template from:
- `web/.env.local.example`

## Run locally
From the repo root:
```powershell
cd "C:\Users\dud45\OneDrive\Dokumentumok\Asztali gép\messageboard"
cd web
npm install
npm run dev
```

Open: `http://localhost:3000`

## Deploy to Vercel
1. Push this repo to GitHub
2. In Vercel: **New Project** → **Import Git Repository** → select your repo
3. Project settings:
   - **Root Directory**: `web`
   - **Build Command**: `npm run build`
   - **Install Command**: `npm install`
4. Add environment variables in Vercel:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. Deploy and open the generated URL

Common issue: if Vercel can’t find `package.json`, set **Root Directory** to `web`.