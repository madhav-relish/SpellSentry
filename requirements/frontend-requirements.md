# Project Overview
This app allows user to provide links of their web pages/ websites and identify the grammatical and spelling mistakes present in that page.


# Feature Requirements

- We will use Next.js, Shadcn, Lucide icons, next-auth, prisma, JINA.
- User should be able to add their website link in a input box, then firstly we will need to scrap the webpage and convert it to markdown. Then use AI to find grammatical and spelling mistakes.
- User should be able to schedule the operations to weekly or on some days and the app should do it's work of scanning and finding the mistaked in the page on those days and give results.
- Proper UI should be shown to the user, if AI is doing it;s work then the user should see some good UI
- Proper error handling should be done and user should see readable errors
- Debugging should be easier as well.


# Relevant Docs


# Current File Structure
SPELLSENTRY
├── .turbo
├── .vscode
├── apps
│   ├── sage
│   └── web
│       ├── .next
│       ├── .turbo
│       ├── app
│       ├── components
│       ├── hooks
│       ├── lib
│       ├── node_modules
│       ├── providers
│       ├── public
│       ├── .env
│       ├── .eslintrc.js
│       ├── .gitignore
│       ├── components.json
│       ├── next-env.d.ts
│       ├── next.config.mjs
│       ├── package.json
│       ├── postcss.config.js
│       ├── README.md
│       ├── tailwind.config.js
│       └── tsconfig.json
├── node_modules
├── packages
└── requirements
├── .gitignore
├── .npmrc
├── LICENSE
├── package.json
├── pnpm-lock.yaml
├── pnpm-workspace.yaml
├── README.md
└── turbo.json


# Rules