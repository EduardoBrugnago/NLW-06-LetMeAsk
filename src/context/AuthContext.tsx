import { createContext, ReactNode, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { auth, firebase } from "../services/firebase";

type User = {
    id: string;
    name: string;
    avatar: string;
}
  
type AuthContextType = {
    user: User | undefined;
    signInWithGoogle: () => Promise<void>;
    signOutFromGoogle: () => Promise<void>;
}

type AuthContextProviderProps = {   
    children: ReactNode;
}
  
export const AuthContext = createContext({} as AuthContextType);

export function AuthContextProvider(props: AuthContextProviderProps) {
    const [user, setUser] = useState<User>();

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(user => {
            if (user)
            {
                const { displayName, photoURL, uid } = user;

                if (!displayName || !photoURL ) {
                    throw toast.error('Missing information from Google Account');
                }
        
                setUser({
                    id: uid,
                    name: displayName,
                    avatar: photoURL
                })
            }
        })

        return () => {
            unsubscribe();
        }
    }, []);

    async function signInWithGoogle ()
    {
        const provider = new firebase.auth.GoogleAuthProvider();

        const result = await auth.signInWithPopup(provider);

        if (result.user) {
            const { displayName, photoURL, uid } = result.user;

            if (!displayName || !photoURL ) {
                throw toast.error('Missing information from Google Account');
            }

            setUser({
                id: uid,
                name: displayName,
                avatar: photoURL
            })
        }
    }

    async function signOutFromGoogle () {

        if (user) {
            setUser(undefined);
            toast.success('Logged out!');
            auth.signOut();
        }
        
    }

    return (
        <AuthContext.Provider value={{ user, signInWithGoogle, signOutFromGoogle }}>
            {props.children}
        </AuthContext.Provider>
    );
}