import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  type User,
} from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../../lib/firebase";

type AdminRole = "admin" | "editor" | "marketing";

export type AdminProfile = {
  uid: string;
  email: string;
  role: AdminRole;
};

type AdminAuthContextValue = {
  admin: AdminProfile | null;
  firebaseUser: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AdminAuthContext = createContext<AdminAuthContextValue | null>(null);

async function getAuthorizedAdmin(user: User): Promise<AdminProfile | null> {
  if (user.isAnonymous) return null;

  const snapshot = await getDoc(doc(db, "admins", user.uid));
  if (!snapshot.exists()) return null;

  const data = snapshot.data();
  const role = String(data.role ?? "");

  if (
    data.active !== true ||
    !["admin", "editor", "marketing"].includes(role)
  ) {
    return null;
  }

  return {
    uid: user.uid,
    email: user.email || String(data.email ?? ""),
    role: role as AdminRole,
  };
}

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [admin, setAdmin] = useState<AdminProfile | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (cancelled) return;

      setLoading(true);
      setFirebaseUser(user);

      if (!user || user.isAnonymous) {
        setAdmin(null);
        setLoading(false);
        return;
      }

      try {
        const authorizedAdmin = await getAuthorizedAdmin(user);
        if (cancelled) return;

        if (!authorizedAdmin) {
          await signOut(auth);
          if (!cancelled) {
            setFirebaseUser(null);
            setAdmin(null);
          }
        } else {
          setAdmin(authorizedAdmin);
        }
      } catch (error) {
        console.error("Admin authorization check failed:", error);
        if (!cancelled) setAdmin(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    });

    return () => {
      cancelled = true;
      unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    setLoading(true);

    try {
      const credential = await signInWithEmailAndPassword(
        auth,
        email.trim(),
        password,
      );

      const authorizedAdmin = await getAuthorizedAdmin(credential.user);

      if (!authorizedAdmin) {
        await signOut(auth);
        throw new Error("This account is not authorized to access the CMS.");
      }

      setFirebaseUser(credential.user);
      setAdmin(authorizedAdmin);
    } finally {
      setLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    await signOut(auth);
    setFirebaseUser(null);
    setAdmin(null);
  };

  const value = useMemo(
    () => ({ admin, firebaseUser, loading, login, logout }),
    [admin, firebaseUser, loading],
  );

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth(): AdminAuthContextValue {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error("useAdminAuth must be used inside AdminAuthProvider.");
  }
  return context;
}
