/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { auth, db } from '../firebase';
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    updateProfile
} from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Initial Auth Listener
    useEffect(() => {
        console.log("AuthProvider: Initializing Auth Listener...");
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                console.log("AuthProvider: Firebase Auth detected user", firebaseUser.uid);
                const userDocRef = doc(db, 'users', firebaseUser.uid);
                try {
                    const userDoc = await getDoc(userDocRef);

                    if (userDoc.exists()) {
                        console.log("AuthProvider: Firestore data found", userDoc.data());
                        setUser({
                            uid: firebaseUser.uid,
                            email: firebaseUser.email,
                            ...userDoc.data()
                        });
                    } else {
                        console.warn("AuthProvider: No Firestore document found. Creating one now...");
                        const newUser = {
                            name: firebaseUser.displayName || 'New Elf',
                            email: firebaseUser.email,
                            coins: 50,
                            niceMeter: 10,
                            stickersUnlocked: [],
                            avatar: 'santa',
                            streak: 0,
                            lastMissionDate: null,
                            completedMissions: [],
                            letters: [],
                            decorations: [],
                            createdAt: serverTimestamp()
                        };
                        await setDoc(userDocRef, newUser);
                        setUser({ uid: firebaseUser.uid, ...newUser });
                        console.log("AuthProvider: Missing document created successfully.");
                    }
                } catch (error) {
                    console.error("AuthProvider: Error fetching Firestore doc", error);
                    setUser(firebaseUser); // Minimal state
                }
            } else {
                console.log("AuthProvider: No user logged in");
                setUser(null);
            }
            setLoading(false);
        });

        return unsubscribe;
    }, []);

    const login = async (email, password) => {
        console.log("AuthProvider: Attempting login...");
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        return userCredential.user;
    };

    const register = async (name, email, password) => {
        console.log("AuthProvider: Attempting registration...");
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);

        await updateProfile(userCredential.user, {
            displayName: name
        });

        const newUser = {
            name,
            email,
            coins: 50, // Starting bonus
            niceMeter: 10,
            stickersUnlocked: [],
            avatar: 'santa',
            streak: 0,
            lastMissionDate: null,
            completedMissions: [],
            letters: [],
            decorations: [],
            createdAt: serverTimestamp()
        };

        const userDocRef = doc(db, 'users', userCredential.user.uid);
        await setDoc(userDocRef, newUser);

        console.log("AuthProvider: Registered and created Firestore doc");
        setUser({
            uid: userCredential.user.uid,
            ...newUser
        });

        return userCredential.user;
    };

    const logout = async () => {
        console.log("AuthProvider: Logging out...");
        await signOut(auth);
        setUser(null);
    };

    const updateUser = useCallback(async (data) => {
        // Use a functional update to get the LATEST user state from the component
        // But since we need UID, we'll check it first
        if (!auth.currentUser) {
            console.error("AuthProvider: Cannot update, no auth.currentUser!");
            return;
        }

        const uid = auth.currentUser.uid;
        console.log("AuthProvider: Updating Firestore for", uid, data);

        try {
            const userRef = doc(db, 'users', uid);
            // setDoc with merge: true is safer than updateDoc
            await setDoc(userRef, data, { merge: true });

            console.log("AuthProvider: Firestore write success");

            // Now update the local state
            setUser(prev => {
                if (!prev) return null;
                const updated = { ...prev, ...data };
                console.log("AuthProvider: Local state updated", updated);
                return updated;
            });
        } catch (error) {
            console.error("AuthProvider: UPDATE FAILED", error);
            toast.error("Santa's list couldn't be updated. Check your internet!");
            throw error;
        }
    }, []);

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading, updateUser }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
