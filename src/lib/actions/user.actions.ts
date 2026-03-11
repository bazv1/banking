"use server";

import { ID, Query, Databases, Account } from "node-appwrite";
import { createAdminClient, createSessionClient } from "../appwrite";
import { cookies } from "next/headers";
import { extractCustomerIdFromUrl, parseStringify } from "../utils";
import { revalidatePath } from "next/cache";
import { createDwollaCustomer } from "./dwolla.actions";

// Environment variables
const {
  APPWRITE_DATABASE_ID: DATABASE_ID,
  APPWRITE_USER_COLLECTION_ID: USER_COLLECTION_ID,
  APPWRITE_BANK_COLLECTION_ID: BANK_COLLECTION_ID,
} = process.env;

// Interfaces
export interface User {
  $id: string;
  firstName: string;
  lastName: string;
  email: string;
  dwollaCustomerId?: string;
  dwollaCustomerUrl?: string;
}

export interface Bank {
  $id: string;
  userId: string;
  accessToken: string;
  shareableId: string;
  [key: string]: any; // allow extra fields from Appwrite
}

interface getUserInfoProps {
  userId: string;
}

interface signInProps {
  email: string;
  password: string;
}

interface SignUpParams {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
}

interface getBanksProps {
  userId: string;
}

interface getBankProps {
  documentId: string;
}

// -------------------- USER ACTIONS --------------------

export const getUserInfo = async ({ userId }: getUserInfoProps) => {
  try {
    const { database }: { database: Databases } = await createAdminClient();

    const user = await database.listDocuments(
      DATABASE_ID!,
      USER_COLLECTION_ID!,
      [Query.equal("userId", [userId])]
    );

    return parseStringify(user.documents[0]);
  } catch (error) {
    console.error("Error fetching user info:", error);
  }
};

export const signIn = async ({ email, password }: signInProps) => {
  try {
    const { account }: { account: Account } = await createAdminClient();
    const session = await account.createEmailPasswordSession(email, password);

    const cookieStore = await cookies();
    cookieStore.set("appwrite-session", session.secret, {
      path: "/",
      httpOnly: true,
      sameSite: "strict",
      secure: true,
    });

    const user = await getUserInfo({ userId: session.userId });
    return parseStringify(user);
  } catch (error) {
    console.error("Error signing in:", error);
  }
};

export const signUp = async ({ password, ...userData }: SignUpParams) => {
  const { email, firstName, lastName } = userData;
  let newUserAccount;

  try {
    const { account, database } = await createAdminClient();

    newUserAccount = await account.create(
      ID.unique(),
      email,
      password,
      `${firstName} ${lastName}`
    );

    if (!newUserAccount) throw new Error("Error creating user");

    const dwollaCustomerUrl = await createDwollaCustomer({
      ...userData,
      type: "personal",
      address1: "",
      city: "",
      state: "",
      postalCode: "",
      dateOfBirth: "",
      ssn: "",
    });

    if (!dwollaCustomerUrl) throw new Error("Error creating Dwolla customer");

    const dwollaCustomerId = extractCustomerIdFromUrl(dwollaCustomerUrl);

    const newUser = await database.createDocument(
      DATABASE_ID!,
      USER_COLLECTION_ID!,
      ID.unique(),
      {
        ...userData,
        userId: newUserAccount.$id,
        dwollaCustomerId,
        dwollaCustomerUrl,
      }
    );

    const session = await account.createEmailPasswordSession(email, password);

    const cookieStore = await cookies();
    cookieStore.set("appwrite-session", session.secret, {
      path: "/",
      httpOnly: true,
      sameSite: "strict",
      secure: true,
    });

    return parseStringify(newUser);
  } catch (error) {
    console.error("Error signing up:", error);
  }
};

export async function getLoggedInUser() {
  try {
    const { account }: { account: Account } = await createSessionClient();
    const result = await account.get();

    const user = await getUserInfo({ userId: result.$id });
    return parseStringify(user);
  } catch (error) {
    console.error("Error fetching logged-in user:", error);
    return null;
  }
}

export const logoutAccount = async () => {
  try {
    const { account }: { account: Account } = await createSessionClient();

    const cookieStore = await cookies();
    cookieStore.delete("appwrite-session");

    await account.deleteSession("current");
  } catch (error) {
    console.error("Error logging out:", error);
    return null;
  }
};


export const getBanks = async ({ userId }: getBanksProps): Promise<Bank[]> => {
  try {
    const { database }: { database: Databases } = await createAdminClient();

    const response = await database.listDocuments(
      DATABASE_ID!,
      BANK_COLLECTION_ID!,
      [Query.equal("userId", [userId])]
    );

    // Cast documents to Bank[]
    return response.documents as unknown as Bank[];
  } catch (error) {
    console.error("Error fetching banks:", error);
    throw error;
  }
};

// Get one bank by documentId
export const getBank = async ({ documentId }: getBankProps): Promise<Bank> => {
  try {
    const { database }: { database: Databases } = await createAdminClient();

    const response = await database.getDocument(
      DATABASE_ID!,
      BANK_COLLECTION_ID!,
      documentId
    );

    return response as unknown as Bank;
  } catch (error) {
    console.error("Error fetching bank:", error);
    throw error;
  }
};