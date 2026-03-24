# SHW Equipment Library

A web-based equipment rental management system built for the School of Health 
and Wellbeing at the University of Glasgow. Staff and students can browse, 
request, and manage the rental of physical equipment through a modern, 
lightweight web application.

## Description

The SHW Equipment Library allows users to:
- Browse available equipment with images, descriptions, and availability status
- Submit borrow requests for equipment, with admin approval required

Admins can:
- Add, edit, and manage equipment inventory
- Approve or reject borrow requests
- View all current loans and overdue items
- View their borrowing history

Built with [Hono](https://hono.dev/) on the [Bun](https://bun.sh/) runtime, 
styled with TailwindCSS, and using Cloudflare R2 for image storage.

## Requirements

- [Bun](https://bun.sh/) v1.0 or higher
- A Cloudflare account (for R2 storage and Workers deployment)

## Installation

Clone the repository:
```bash
git clone https://stgit.dcs.gla.ac.uk/team-project-h/2025/sh17/sh17-main.git
cd sh17-main
```

Install dependencies:
```bash
bun install
```

## Configuration

This project uses Cloudflare Workers — there is no traditional `.env` file.

1. Fill in your Cloudflare D1 database ID and R2 bucket name in `wrangler.jsonc`
2. Set your email API secret:
```bash
wrangler secret put RESEND_API_KEY
```
3. Run database migrations:
```bash
bun run migrate-local   # for local development
bun run migrate         # for production
```
4. Optionally seed the database with sample data:
```bash
bun run populate
```

## Usage

Run the development server (requires two terminals):

Terminal 1 — start the app:
```bash
bun dev
```

Terminal 2 — compile Tailwind CSS:
```bash
bun tailwind
```

The application will be available on localhost.

## Deployment

To deploy to Cloudflare Workers:
```bash
bun run deploy
```

To generate/synchronise Cloudflare types based on your Worker configuration:
```bash
bun run cf-typegen
```

## Known Bugs

- Testing infrastructure is not yet in place
- R2 image storage falls back to local static assets in development 
  if `IMAGES_BUCKET` is not configured

## Authors

Gareth Edwards, Sam Lynch, McKenzie Morrison, Kyrylo Petrushka, Sean Findlay  
School of Computing Science, University of Glasgow — Team Project SH17, 2025

## License

SHW Equipment Library © 2025 by Gareth Edwards, Sam Lynch, McKenzie Morrison, 
Kyrylo Petrushka, Sean Findlay is licensed under 
[CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/)