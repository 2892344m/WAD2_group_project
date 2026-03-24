// /** @jsxImportSource hono/jsx */
import { jsxRenderer, useRequestContext } from 'hono/jsx-renderer';
import Navbar from './views/components/Navbar';
import { getCurrentUser } from '@/auth';
// import x from './../assets/statics/js/'

export const RootHtml = jsxRenderer(async ({ children }) => {
  const c = useRequestContext();
  const { user, admin } = await getCurrentUser(c) ?? { user: null, admin: null };
  const url = new URL(c.req.url);

  return (
    <html>
      <head>
        <meta name="description" content="SHW Tool Library" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>SHW Equipment Booking</title>
        <script src="/statics/js/htmx.2.0.1.js"></script>
        <link rel='stylesheet' href='/statics/tailwind_generated.css'/>
      </head>
      <body class="bg-[#f6f7f9]">
        <Navbar className="basis-auto" pathname={url.pathname} user={user ?? undefined} admin={admin ?? undefined}/>
        <main class="w-full h-full flex flex-col">
          {children}
        </main>
      </body>
    </html>
  )
});

// type LayoutProps = {
//   title: string
//   children: any
// }

// export function Layout({ title, children }: LayoutProps) {
//   return (
//     <html>
//       <head>
//         <title>{title}</title>
//       </head>
//       <body>
//         <header>
//           <nav>
//             <a href="/">Home</a> | <a href="/about">About</a> | <a href="/admin">Admin</a>
//           </nav>
//         </header>
//         <main>{children}</main>
//       </body>
//     </html>
//   )
// }
