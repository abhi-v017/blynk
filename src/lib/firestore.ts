import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  collection,
  getDocs,
  query,
  orderBy,
  runTransaction,
} from "firebase/firestore";
import { db } from "./firebase";
import { UserProfile, LinkItem, ThemeConfig } from "./types";
import { DEFAULT_THEME } from "./presets";

const usernameRef = (username: string) => doc(db, "usernames", username.toLowerCase());
const userRef = (userId: string) => doc(db, "users", userId);
const themeRef = (userId: string) => doc(db, "themes", userId);
const linksCol = (userId: string) => collection(db, "users", userId, "links");

/** Atomically claim a username and create the user profile. Throws if taken. */
export async function claimUsernameAndCreateProfile(
  userId: string,
  username: string,
  displayName: string
) {
  const uname = username.toLowerCase().trim();
  await runTransaction(db, async (tx) => {
    const existing = await tx.get(usernameRef(uname));
    if (existing.exists()) {
      throw new Error("USERNAME_TAKEN");
    }
    tx.set(usernameRef(uname), { userId });
    tx.set(userRef(userId), {
      userId,
      username: uname,
      displayName: displayName || uname,
      bio: "",
      profilePic: "",
      createdAt: Date.now(),
      published: true,
    } satisfies UserProfile);
    tx.set(themeRef(userId), {
      userId,
      presetId: "sage-minimal",
      ...DEFAULT_THEME,
    });
  });
}

export async function isUsernameAvailable(username: string) {
  const snap = await getDoc(usernameRef(username.toLowerCase().trim()));
  return !snap.exists();
}

export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  const snap = await getDoc(userRef(userId));
  return snap.exists() ? (snap.data() as UserProfile) : null;
}

export async function getUserByUsername(username: string): Promise<UserProfile | null> {
  const mapSnap = await getDoc(usernameRef(username));
  if (!mapSnap.exists()) return null;
  const { userId } = mapSnap.data() as { userId: string };
  return getUserProfile(userId);
}

export async function updateUserProfile(userId: string, data: Partial<UserProfile>) {
  await updateDoc(userRef(userId), data);
}

export async function getTheme(userId: string): Promise<ThemeConfig | null> {
  const snap = await getDoc(themeRef(userId));
  return snap.exists() ? (snap.data() as ThemeConfig) : null;
}

export async function saveTheme(userId: string, theme: ThemeConfig) {
  await setDoc(themeRef(userId), theme);
}

export async function getLinks(userId: string): Promise<LinkItem[]> {
  const q = query(linksCol(userId), orderBy("order", "asc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as LinkItem));
}

export async function createLink(userId: string, link: Omit<LinkItem, "id">) {
  const ref = doc(linksCol(userId));
  await setDoc(ref, link);
  return ref.id;
}

export async function updateLink(userId: string, linkId: string, data: Partial<LinkItem>) {
  await updateDoc(doc(linksCol(userId), linkId), data);
}

export async function deleteLink(userId: string, linkId: string) {
  await deleteDoc(doc(linksCol(userId), linkId));
}

export async function reorderLinks(userId: string, orderedIds: string[]) {
  await Promise.all(
    orderedIds.map((id, index) => updateDoc(doc(linksCol(userId), id), { order: index }))
  );
}
