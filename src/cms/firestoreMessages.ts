import { addDoc, collection, deleteDoc, doc, onSnapshot, orderBy, query, serverTimestamp, updateDoc, type Unsubscribe } from "firebase/firestore";
import { db } from "../lib/firebase";
import type { CmsMessage } from "./types";

export type NewContactMessage = Omit<CmsMessage, "id" | "createdAt" | "status" | "priority">;

export async function saveContactMessage(message: NewContactMessage): Promise<void> {
  await addDoc(collection(db, "contactMessages"), {
    ...message,
    status: "new",
    priority: "normal",
    source: "website_contact_form",
    createdAt: serverTimestamp(),
  });
}

export function subscribeToMessages(onChange: (messages: CmsMessage[]) => void, onError?: (error: Error) => void): Unsubscribe {
  const messagesQuery = query(collection(db, "contactMessages"), orderBy("createdAt", "desc"));
  return onSnapshot(messagesQuery, (snapshot) => {
    onChange(snapshot.docs.map((item) => {
      const data = item.data();
      const createdAt = data.createdAt?.toDate?.()?.toISOString?.() ?? data.createdAt ?? new Date().toISOString();
      return {
        id: item.id,
        createdAt,
        name: String(data.name ?? ""),
        email: String(data.email ?? ""),
        phone: String(data.phone ?? ""),
        project: String(data.project ?? ""),
        service: String(data.service ?? ""),
        message: String(data.message ?? ""),
        status: (data.status ?? "new") as CmsMessage["status"],
        priority: (data.priority ?? "normal") as CmsMessage["priority"],
      };
    }));
  }, (error) => onError?.(error));
}

export async function updateMessage(id: string, patch: Partial<Pick<CmsMessage, "status" | "priority">>): Promise<void> {
  await updateDoc(doc(db, "contactMessages", id), patch);
}

export async function deleteMessage(id: string): Promise<void> {
  await deleteDoc(doc(db, "contactMessages", id));
}
