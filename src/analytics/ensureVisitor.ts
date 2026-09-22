import { onAuthStateChanged, signInAnonymously, type User } from "firebase/auth";
import { auth } from "../lib/firebase";

let visitorPromise: Promise<User | null> | null = null;

/**
 * Returns an anonymous Firebase user for public analytics.
 * If an email/password administrator is signed in, public tracking is skipped
 * so the analytics system never replaces or records the admin account.
 */
export function ensureAnonymousVisitor(): Promise<User | null> {
  const current = auth.currentUser;

  if (current?.isAnonymous) return Promise.resolve(current);
  if (current && !current.isAnonymous) return Promise.resolve(null);
  if (visitorPromise) return visitorPromise;

  visitorPromise = new Promise<User | null>((resolve, reject) => {
    const unsubscribe = onAuthStateChanged(
      auth,
      async (user) => {
        if (user) {
          unsubscribe();
          visitorPromise = null;
          resolve(user.isAnonymous ? user : null);
          return;
        }

        try {
          const credential = await signInAnonymously(auth);
          unsubscribe();
          visitorPromise = null;
          resolve(credential.user);
        } catch (error) {
          unsubscribe();
          visitorPromise = null;
          reject(error);
        }
      },
      (error) => {
        visitorPromise = null;
        reject(error);
      },
    );
  });

  return visitorPromise;
}
