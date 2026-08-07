# JUMPFIRST-Web

This repository now uses the Next.js application in `next-app/` as the primary app.

## Active Application

- `next-app/`: main application built with Next.js App Router

Key capabilities already moved into the framework app:

- route-based pages for home, login, register, courses, contact, and member dashboard
- API routes for auth, contact, courses, and member metrics
- service adapter architecture for mock/api switching
- bilingual i18n support
- form validation, field-level errors, and shared API response envelope
- unit tests, integration tests, coverage gate, and CI workflow

## Legacy Static Site

- `legacy-static/`: archived pre-framework implementation kept for reference during migration cleanup

This folder contains the old static HTML/CSS/JS version that existed before the framework migration.

## Working Directory

Use `next-app/` for active development.

~~~bash
cd next-app
npm install
npm run dev
~~~

## Validation Commands

~~~bash
cd next-app
npm run test:coverage
npm run lint
npm run build
~~~