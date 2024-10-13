import { Client, Account } from 'appwrite';

export const client = new Client();

client
    .setEndpoint('https://cloud.appwrite.io/v1')
    .setProject('670b5bbe0005f8a425f8'); 

export const account = new Account(client);
export { ID } from 'appwrite';
