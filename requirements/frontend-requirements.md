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
    #1. How to use Next Auth

    Add API route
To add NextAuth.js to a project create a file called [...nextauth].js in pages/api/auth. This contains the dynamic route handler for NextAuth.js which will also contain all of your global NextAuth.js configurations.

If you're using Next.js 13.2 or above with the new App Router (app/), you can initialize the configuration using the new Route Handlers by following our guide.

pages/api/auth/[...nextauth].js
import NextAuth from "next-auth"
import GithubProvider from "next-auth/providers/github"
export const authOptions = {
  // Configure one or more authentication providers
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
    // ...add more providers here
  ],
}
export default NextAuth(authOptions)

All requests to /api/auth/* (signIn, callback, signOut, etc.) will automatically be handled by NextAuth.js.

Further Reading:

See the options documentation for more details on how to configure providers, databases and other options.
Read more about how to add authentication providers here.
Configure Shared session state
To be able to use useSession first you'll need to expose the session context, <SessionProvider />, at the top level of your application:

pages/_app.jsx
import { SessionProvider } from "next-auth/react"
export default function App({
  Component,
  pageProps: { session, ...pageProps },
}) {
  return (
    <SessionProvider session={session}>
      <Component {...pageProps} />
    </SessionProvider>
  )
}

Instances of useSession will then have access to the session data and status. The <SessionProvider /> also takes care of keeping the session updated and synced between browser tabs and windows.

tip
Check out the client documentation to see how you can improve the user experience and page performance by using the NextAuth.js client. If you are using the Next.js App Router, please note that <SessionProvider /> requires a client component and therefore cannot be put inside the root layout. For more details, check out the Next.js documentation.

Frontend - Add React Hook
The useSession() React Hook in the NextAuth.js client is the easiest way to check if someone is signed in.

components/login-btn.jsx
import { useSession, signIn, signOut } from "next-auth/react"
export default function Component() {
  const { data: session } = useSession()
  if (session) {
    return (
      <>
        Signed in as {session.user.email} <br />
        <button onClick={() => signOut()}>Sign out</button>
      </>
    )
  }
  return (
    <>
      Not signed in <br />
      <button onClick={() => signIn()}>Sign in</button>
    </>
  )
}

You can use the useSession hook from anywhere in your application (e.g. in a header component).

Backend - API Route
To protect an API Route, you can use the getServerSession() method.

pages/api/restricted.js
import { getServerSession } from "next-auth/next"
import { authOptions } from "./auth/[...nextauth]"
export default async (req, res) => {
  const session = await getServerSession(req, res, authOptions)
  if (session) {
    res.send({
      content:
        "This is protected content. You can access this content because you are signed in.",
    })
  } else {
    res.send({
      error: "You must be signed in to view the protected content on this page.",
    })
  }
}

Extensibility
Using NextAuth.js Callbacks
NextAuth.js allows you to hook into various parts of the authentication flow via our built-in callbacks.

For example, to pass a value from the sign-in to the frontend, client-side, you can use a combination of the session and jwt callback like so:

pages/api/auth/[...nextauth].js
...
callbacks: {
  async jwt({ token, account }) {
    // Persist the OAuth access_token to the token right after signin
    if (account) {
      token.accessToken = account.access_token
    }
    return token
  },
  async session({ session, token, user }) {
    // Send properties to the client, like an access_token from a provider.
    session.accessToken = token.accessToken
    return session
  }
}
...

Now whenever you call getSession or useSession, the data object which is returned will include the accessToken value.

components/accessToken.jsx
import { useSession, signIn, signOut } from "next-auth/react"
export default function Component() {
  const { data } = useSession()
  const { accessToken } = data
  return <div>Access Token: {accessToken}</div>
}

Configuring callback URL (OAuth only)
If you are using an OAuth provider either through one of our built-in providers or through a custom provider, you'll need to configure a callback URL in your provider's settings. Each provider has a "Configuration" section that should give you pointers on how to do that.

Follow these steps to learn how to integrate with an OAuth provider.

Google
Documentation
https://developers.google.com/identity/protocols/oauth2

Configuration
https://console.developers.google.com/apis/credentials

The "Authorized redirect URIs" used when creating the credentials must include your full domain and end in the callback path. For example;

For production: https://{YOUR_DOMAIN}/api/auth/callback/google
For development: http://localhost:3000/api/auth/callback/google
Options
The Google Provider comes with a set of default options:

Google Provider options
You can override any of the options to suit your own use case.

Example
import GoogleProvider from "next-auth/providers/google";
...
providers: [
  GoogleProvider({
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET
  })
]
...

danger
Google only provides Refresh Token to an application the first time a user signs in.

To force Google to re-issue a Refresh Token, the user needs to remove the application from their account and sign in again: https://myaccount.google.com/permissions

Alternatively, you can also pass options in the params object of authorization which will force the Refresh Token to always be provided on sign in, however this will ask all users to confirm if they wish to grant your application access every time they sign in.

If you need access to the RefreshToken or AccessToken for a Google account and you are not using a database to persist user accounts, this may be something you need to do.

const options = {
  ...
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code"
        }
      }
    })
  ],
  ...
}

tip
Google also returns a email_verified boolean property in the OAuth profile.

You can use this property to restrict access to people with verified accounts at a particular domain.

const options = {
  ...
  callbacks: {
    async signIn({ account, profile }) {
      if (account.provider === "google") {
        return profile.email_verified && profile.email.endsWith("@example.com")
      }
      return true // Do different verification for other providers that don't have `email_verified`
    },
  }
  ...
}



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
