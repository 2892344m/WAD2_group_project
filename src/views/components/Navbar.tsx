import type { User } from '@/models/schema';
import type { Admin } from '@/models/schema';
import { getCookie } from 'hono/cookie';

type Route = {
  path: string;
  name: string;
  focus: RegExp;
};

export default function NavbarComponent({
  className,
  pathname,
  user,
  admin,
}: {
  className: string;
  pathname: string;
  user?: User;
  admin?: Admin;
}) {
  const libraryPath = admin ? '/dashboard/items' : '/library';

  // Base routes (always visible)
  const baseRoutes: Route[] = [
    { path: '/', name: 'Home', focus: /^\/$/ },
    { path: libraryPath, name: 'Library', focus: /^\/(library|dashboard\/items)(\/.*)?$/ },
  ];

  // Auth routes (optional)
  const authRoutes: Route[] = user
    ? [
        { path: '/dashboard/profile', name: 'Profile', focus: /^\/dashboard\/profile(\/.*)?$/ },
        { path: '/logout', name: 'Logout', focus: /^\/logout(\/.*)?$/ },
      ]
    : [{ path: '/login', name: 'Login', focus: /^\/login(\/.*)?$/ }];

  const adminRoutes: Route[] = admin
    ? [
        { path: '/dashboard', name: 'Dashboard', focus: /^\/dashboard(\/(?!items($|\/)).*)?$/ },
      ]
    : [];

  const routes = [...baseRoutes, ...adminRoutes, ...authRoutes];

  return (
    <header class={`${className} bg-[#003865]`}>
      <div class="max-w-[1100px] mx-auto px-5 py-3 flex items-center justify-between gap-4">
        {/* Brand */}
        <a href="/" class="flex items-center no-underline">
          <img src="/statics/UoGLogo.jpg" alt="University of Glasgow" class="h-[100px] w-auto rounded-2xl" />
        </a>

        {/* Links (always visible, no dropdown) */}
        <nav class="flex gap-2 flex-wrap justify-end">
          {routes.map((route) => {
            const isSelected = !!pathname.match(route.focus);

            return (
              <a
                href={route.path}
                class={`text-white no-underline font-semibold text-sm px-2.5 py-2 rounded-[10px] transition-colors ${
                  isSelected ? 'bg-white/16' : 'bg-transparent hover:bg-white/10'
                }`}
              >
                {route.name}
              </a>
            );
          })}
        </nav>
      </div>
    </header>
  );
}