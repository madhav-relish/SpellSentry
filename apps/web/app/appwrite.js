import { Client, Account } from "appwrite";

const client = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_API_ENDPOINT)
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID);

const account = new Account(client);

const loginWithGoogle = () => {
  account.createOAuth2Session(
    'google',
    'http://localhost:3000/dashboard',  // Replace with your production URL when ready
    'http://localhost:3000/failed'
  );
};

export { client, account, loginWithGoogle };
