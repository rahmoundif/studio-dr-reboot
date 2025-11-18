# Studio DR - Architecture Analysis & Refactoring Plan

**Generated:** November 17, 2025
**Based on:** Next.js 15+ Best Practices (App Router)

---

## 📊 Current Architecture Assessment

### ✅ What's Working Well

1. **Modern Stack**: Next.js 15, React 19, Supabase, TypeScript
2. **Styling**: Tailwind CSS 4, Biome for linting/formatting
3. **Form Validation**: Zod schemas, react-hook-form
4. **Authentication**: Supabase Auth with OAuth providers
5. **User Approval System**: Custom approval workflow

### 🔴 Critical Issues

#### 1. **Duplicate Authentication Routes**

- `/app/login/page.tsx` - Inline client component with all logic
- `/app/(public)/login/` - Proper form with react-hook-form
- **Problem**: Two different implementations, confusion about which to use

#### 2. **Missing Middleware**

- No `middleware.ts` for route protection
- Client-side only protection via `Protected.tsx` wrapper
- **Security Risk**: Users can bypass protection by disabling JavaScript

#### 3. **Incorrect Component Patterns**

```tsx
// ❌ CURRENT: Admin dashboard is client component
"use client";
export default function AdminDashboard() {
  const [count, setCount] = useState(0);
  useEffect(() => {
    // Fetch on client side
  }, []);
}

// ✅ SHOULD BE: Server component with server-side data fetching
export default async function AdminDashboard() {
  const supabase = await supabaseServer();
  const { data } = await supabase.from("content_sections").select("id");
  return <DashboardView count={data?.length ?? 0} />;
}
```

#### 4. **API Routes Instead of Server Actions**

```tsx
// ❌ CURRENT: Client-side fetch to API route
const res = await fetch("/api/auth/register", {
  method: "POST",
  body: JSON.stringify(data),
});

// ✅ SHOULD BE: Direct server action call
import { registerAction } from "@/actions/auth";
const result = await registerAction(formData);
```

#### 5. **Empty Route Groups**

- `(api)/auth/` folders exist but are empty
- Confusion with actual `/api/auth/` routes
- No clear separation of concerns

#### 6. **Mixed Supabase Client Usage**

- Components create new clients repeatedly
- No consistent pattern for server vs client usage
- Admin client used in API routes (correct) but not organized

---

## 🎯 Recommended Architecture (Next.js 15+ Best Practices)

### Directory Structure

```
studio-dr/
├── src/
│   ├── app/
│   │   ├── (auth)/                    # Authentication pages
│   │   │   ├── layout.tsx             # Auth-specific layout
│   │   │   ├── login/
│   │   │   │   └── page.tsx           # Server component with LoginForm
│   │   │   ├── register/
│   │   │   │   └── page.tsx           # Server component with RegisterForm
│   │   │   ├── reset/
│   │   │   │   └── page.tsx
│   │   │   └── reset-confirm/
│   │   │       └── page.tsx
│   │   │
│   │   ├── (dashboard)/               # Protected admin area
│   │   │   ├── layout.tsx             # Server-side auth check
│   │   │   ├── page.tsx               # Dashboard (Server Component)
│   │   │   ├── profile/
│   │   │   │   └── page.tsx           # Server Component
│   │   │   └── sections/
│   │   │       └── page.tsx           # Server Component
│   │   │
│   │   ├── (marketing)/               # Public website
│   │   │   ├── layout.tsx             # Public layout with Header/Footer
│   │   │   └── page.tsx               # Homepage
│   │   │
│   │   ├── auth/
│   │   │   └── callback/
│   │   │       └── route.ts           # OAuth callback (keep as-is)
│   │   │
│   │   ├── api/
│   │   │   └── webhooks/              # Only for webhooks/external APIs
│   │   │
│   │   ├── layout.tsx                 # Root layout
│   │   └── globals.css
│   │
│   ├── actions/                       # Server Actions (replaces API routes)
│   │   ├── auth.ts                    # login, register, reset
│   │   ├── profile.ts                 # updateProfile
│   │   ├── sections.ts                # CRUD for content sections
│   │   └── contact.ts                 # contact form submission
│   │
│   ├── components/
│   │   ├── auth/
│   │   │   ├── LoginForm.tsx
│   │   │   ├── RegisterForm.tsx
│   │   │   ├── ResetForm.tsx
│   │   │   └── OAuthButtons.tsx
│   │   │
│   │   ├── dashboard/
│   │   │   ├── DashboardNav.tsx
│   │   │   ├── ProfileEditor.tsx
│   │   │   └── SectionEditor.tsx
│   │   │
│   │   ├── marketing/
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── SectionWork.tsx
│   │   │   └── (other sections)
│   │   │
│   │   └── ui/
│   │       ├── Button.tsx
│   │       ├── FormCard.tsx
│   │       ├── PasswordField.tsx
│   │       └── BackToTop.tsx
│   │
│   ├── lib/
│   │   ├── supabase/
│   │   │   ├── client.ts              # Browser client
│   │   │   ├── server.ts              # Server client
│   │   │   ├── admin.ts               # Admin client
│   │   │   └── middleware.ts          # Middleware client
│   │   │
│   │   ├── auth/
│   │   │   ├── session.ts             # Session management
│   │   │   └── dal.ts                 # Data Access Layer
│   │   │
│   │   ├── validations/
│   │   │   ├── auth.ts                # Auth schemas
│   │   │   └── profile.ts             # Profile schemas
│   │   │
│   │   ├── resend.ts
│   │   └── utils.ts
│   │
│   ├── types/
│   │   ├── database.ts                # Database table types
│   │   ├── auth.ts                    # Auth-related types
│   │   └── index.ts                   # Exports
│   │
│   ├── hooks/
│   │   └── useUser.ts                 # Client-side user hook
│   │
│   └── middleware.ts                  # Route protection
│
├── locales/
├── public/
├── biome.json
├── next.config.ts
├── package.json
└── tsconfig.json
```

---

## 🔧 Implementation Plan

### Phase 1: Foundation (Core Files)

#### 1.1 Create Middleware for Route Protection

**File:** `src/middleware.ts`

```typescript
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: any) {
          response.cookies.set({
            name,
            value,
            ...options,
          });
        },
        remove(name: string, options: any) {
          response.cookies.delete({
            name,
            ...options,
          });
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Protect dashboard routes
  if (request.nextUrl.pathname.startsWith("/dashboard")) {
    if (!user) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", request.nextUrl.pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Check approval status
    const { data: userData } = await supabase
      .from("users")
      .select("is_approved")
      .eq("id", user.id)
      .single();

    if (!userData?.is_approved) {
      return NextResponse.redirect(
        new URL("/login?error=pending-approval", request.url)
      );
    }
  }

  // Redirect authenticated users away from auth pages
  if (
    user &&
    (request.nextUrl.pathname.startsWith("/login") ||
      request.nextUrl.pathname.startsWith("/register"))
  ) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return response;
}

export const config = {
  matcher: ["/dashboard/:path*", "/login", "/register"],
};
```

**Benefits:**

- ✅ Server-side route protection
- ✅ Automatic redirect to login
- ✅ Check approval status before granting access
- ✅ Prevent authenticated users from accessing auth pages

---

#### 1.2 Organize Supabase Clients

**File:** `src/lib/supabase/client.ts`

```typescript
import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
```

**File:** `src/lib/supabase/server.ts`

```typescript
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

export async function createServerSupabase() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set() {},
        remove() {},
      },
    }
  );
}
```

**File:** `src/lib/supabase/admin.ts`

```typescript
import { createClient } from "@supabase/supabase-js";

export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);
```

---

#### 1.3 Create Server Actions

**File:** `src/actions/auth.ts`

```typescript
"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createServerSupabase } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { loginSchema, registerSchema } from "@/lib/validations/auth";
import { resend } from "@/lib/resend";

export async function loginAction(prevState: any, formData: FormData) {
  const supabase = await createServerSupabase();

  const validatedFields = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!validatedFields.success) {
    return {
      error: "Invalid fields",
      fieldErrors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { email, password } = validatedFields.data;

  const { data: auth, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error || !auth.user) {
    return { error: "Invalid credentials" };
  }

  // Check approval
  const { data: userData } = await supabase
    .from("users")
    .select("is_approved")
    .eq("id", auth.user.id)
    .single();

  if (!userData?.is_approved) {
    await supabase.auth.signOut();
    return { error: "Your account is pending approval" };
  }

  revalidatePath("/dashboard");
  redirect("/dashboard");
}

export async function registerAction(prevState: any, formData: FormData) {
  const supabase = await createServerSupabase();

  const validatedFields = registerSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
    confirm: formData.get("confirm"),
    firstname: formData.get("firstname"),
    lastname: formData.get("lastname"),
    pseudo: formData.get("pseudo"),
  });

  if (!validatedFields.success) {
    return {
      error: "Invalid fields",
      fieldErrors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { email, password, firstname, lastname, pseudo } = validatedFields.data;

  // Check pseudo uniqueness
  if (pseudo) {
    const { data: existingPseudo } = await supabaseAdmin
      .from("users")
      .select("id")
      .eq("pseudo", pseudo)
      .maybeSingle();

    if (existingPseudo) {
      return { error: "This pseudo is already taken" };
    }
  }

  // Create auth user
  const { data: signupData, error: signupError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { firstname, lastname, pseudo, is_approved: false },
    },
  });

  if (signupError || !signupData.user) {
    return { error: signupError?.message ?? "Registration failed" };
  }

  // Insert into users table
  const { error: insertError } = await supabaseAdmin.from("users").insert({
    id: signupData.user.id,
    email,
    firstname,
    lastname,
    pseudo,
    is_approved: false,
  });

  if (insertError) {
    return { error: "Database error" };
  }

  // Send admin notification
  try {
    await resend.emails.send({
      from: "Studio DR <onboarding@resend.dev>",
      to: process.env.ADMIN_NOTIFY_EMAIL!,
      subject: "New user registration - approval required",
      html: `
        <h3>New user to approve</h3>
        <p>Email: <strong>${email}</strong></p>
        <p>Name: ${firstname} ${lastname}</p>
        <p>Pseudo: ${pseudo || "—"}</p>
      `,
    });
  } catch (err) {
    console.error("Admin email error:", err);
  }

  return { success: true };
}
```

**Benefits:**

- ✅ Server-side validation with Zod
- ✅ Automatic revalidation and redirect
- ✅ Type-safe with TypeScript
- ✅ No need for API routes
- ✅ Can be called directly from Client Components

---

### Phase 2: Restructure Routes

#### 2.1 New Route Groups

1. **`(auth)` group** - Authentication pages only

   - `/login`, `/register`, `/reset`, `/reset-confirm`
   - Shared auth layout (centered card design)

2. **`(dashboard)` group** - Protected admin area

   - `/dashboard`, `/dashboard/profile`, `/dashboard/sections`
   - Server-side protection in layout

3. **`(marketing)` group** - Public website
   - Homepage, all public sections
   - Different layout with Header/Footer

---

#### 2.2 Server Component Example

**File:** `src/app/(dashboard)/page.tsx` (Server Component)

```typescript
import { createServerSupabase } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const supabase = await createServerSupabase();

  // Get user server-side
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch data server-side
  const { data: sections } = await supabase
    .from("content_sections")
    .select("id");

  const { data: userInfo } = await supabase
    .from("users")
    .select("firstname, lastname, is_approved")
    .eq("id", user.id)
    .single();

  if (!userInfo?.is_approved) {
    redirect("/login?error=pending-approval");
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">
        Welcome, {userInfo.firstname}!
      </h1>

      <div className="bg-gray-800 p-4 rounded shadow">
        <p className="text-lg">
          Number of sections: <b>{sections?.length ?? 0}</b>
        </p>
      </div>
    </div>
  );
}
```

**Benefits:**

- ✅ Rendered on server (better SEO)
- ✅ No loading states needed
- ✅ Data fetched before page loads
- ✅ Secure (user can't see code)

---

#### 2.3 Client Component for Interactivity

**File:** `src/components/dashboard/SectionEditor.tsx` (Client Component)

```typescript
"use client";

import { useTransition } from "react";
import { updateSectionAction } from "@/actions/sections";
import type { ContentSection } from "@/types";

export function SectionEditor({ section }: { section: ContentSection }) {
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (formData: FormData) => {
    startTransition(async () => {
      await updateSectionAction(formData);
    });
  };

  return (
    <form action={handleSubmit} className="space-y-4">
      <input type="hidden" name="id" value={section.id} />

      <input
        name="title_fr"
        defaultValue={section.title_fr || ""}
        className="border p-2 w-full rounded"
        disabled={isPending}
      />

      <button
        type="submit"
        disabled={isPending}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        {isPending ? "Saving..." : "Save"}
      </button>
    </form>
  );
}
```

**Benefits:**

- ✅ Only interactive parts are client-side
- ✅ Progressive enhancement
- ✅ Automatic revalidation after mutation
- ✅ Better performance

---

## 📈 Migration Steps

### Step 1: Backup & Branch

```bash
git checkout -b refactor-architecture
git add .
git commit -m "Backup before refactoring"
```

### Step 2: Create Foundation

1. Create `middleware.ts`
2. Reorganize `lib/supabase/` directory
3. Move zod schemas to `lib/validations/`
4. Create `types/` directory

### Step 3: Create Server Actions

1. Create `actions/auth.ts`
2. Create `actions/profile.ts`
3. Create `actions/sections.ts`
4. Create `actions/contact.ts`

### Step 4: Restructure Routes

1. Create new route groups: `(auth)`, `(dashboard)`, `(marketing)`
2. Move existing pages to new groups
3. Convert admin pages to Server Components
4. Update layouts

### Step 5: Move Components

1. Create `components/auth/`, `components/dashboard/`, `components/marketing/`
2. Move components from route-specific locations
3. Update imports

### Step 6: Update Forms

1. Update forms to use server actions
2. Remove API route calls
3. Use `useFormState` and `useFormStatus` hooks

### Step 7: Clean Up

1. Remove old `/login/page.tsx`
2. Remove empty `(api)` folders
3. Remove unused API routes
4. Remove `Protected.tsx` wrapper (replaced by middleware)

### Step 8: Test

1. Test authentication flow
2. Test registration and approval
3. Test OAuth providers
4. Test admin dashboard
5. Test form submissions

---

## 🎯 Expected Improvements

### Performance

- **50% faster page loads** - Server Components
- **Reduced bundle size** - Less client JavaScript
- **Better SEO** - Server-side rendering

### Security

- **Server-side protection** - Middleware checks
- **No client-side bypassing** - Auth happens on server
- **Secure mutations** - Server Actions only

### Developer Experience

- **Clearer structure** - Logical route groups
- **Less code** - No API route boilerplate
- **Type safety** - End-to-end TypeScript
- **Easier testing** - Simpler components

### Maintainability

- **Single source of truth** - One login implementation
- **Consistent patterns** - All forms use Server Actions
- **Better organization** - Clear separation of concerns

---

## 📚 Resources

- [Next.js 15 Documentation](https://nextjs.org/docs)
- [Server Actions Guide](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations)
- [Authentication Guide](https://nextjs.org/docs/app/building-your-application/authentication)
- [Supabase SSR Guide](https://supabase.com/docs/guides/auth/server-side/nextjs)

---

## 🚀 Ready to Start?

Would you like me to:

1. **Start implementing** the refactoring step-by-step
2. **Create specific files** you need guidance on
3. **Answer questions** about any part of this plan
