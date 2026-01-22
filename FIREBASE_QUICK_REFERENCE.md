# Firebase Quick Reference

This file provides quick copy-paste examples for using Firebase Auth and Firestore in the project.

---

## Import Firebase Services

```typescript
// Import Firebase instances
import { auth, db, analytics } from '@/lib/firebase/client';
```

---

## Firebase Authentication Examples

### Sign Up with Email/Password

```typescript
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase/client';

async function signUp(email: string, password: string) {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    console.log('User created:', user.uid);
    return user;
  } catch (error: any) {
    console.error('Sign up error:', error.message);
    throw error;
  }
}
```

### Sign In with Email/Password

```typescript
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase/client';

async function signIn(email: string, password: string) {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    console.log('User signed in:', user.uid);
    return user;
  } catch (error: any) {
    console.error('Sign in error:', error.message);
    throw error;
  }
}
```

### Sign Out

```typescript
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase/client';

async function logout() {
  try {
    await signOut(auth);
    console.log('User signed out');
  } catch (error: any) {
    console.error('Sign out error:', error.message);
    throw error;
  }
}
```

### Get Current User

```typescript
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase/client';

// Listen to auth state changes
onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log('User is signed in:', user.uid);
    // User is signed in
  } else {
    console.log('User is signed out');
    // User is signed out
  }
});

// Get current user synchronously (may be null on initial load)
const currentUser = auth.currentUser;
```

### Password Reset

```typescript
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '@/lib/firebase/client';

async function resetPassword(email: string) {
  try {
    await sendPasswordResetEmail(auth, email);
    console.log('Password reset email sent');
  } catch (error: any) {
    console.error('Password reset error:', error.message);
    throw error;
  }
}
```

---

## Firestore Database Examples

### Add Document (Auto-Generated ID)

```typescript
import { collection, addDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/client';

async function addGalleryImage(title: string, url: string, category: string) {
  try {
    const docRef = await addDoc(collection(db, 'gallery'), {
      title,
      url,
      category,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    console.log('Document added with ID:', docRef.id);
    return docRef.id;
  } catch (error: any) {
    console.error('Error adding document:', error.message);
    throw error;
  }
}
```

### Set Document (Custom ID)

```typescript
import { doc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/client';

async function setSiteSettings(settings: any) {
  try {
    await setDoc(doc(db, 'settings', 'site'), settings, { merge: true });
    console.log('Settings updated');
  } catch (error: any) {
    console.error('Error setting document:', error.message);
    throw error;
  }
}
```

### Get Single Document

```typescript
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/client';

async function getSiteSettings() {
  try {
    const docRef = doc(db, 'settings', 'site');
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      console.log('Document data:', docSnap.data());
      return docSnap.data();
    } else {
      console.log('No such document!');
      return null;
    }
  } catch (error: any) {
    console.error('Error getting document:', error.message);
    throw error;
  }
}
```

### Get All Documents in Collection

```typescript
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase/client';

async function getAllGalleryImages() {
  try {
    const querySnapshot = await getDocs(collection(db, 'gallery'));
    const images = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    console.log('Found', images.length, 'images');
    return images;
  } catch (error: any) {
    console.error('Error getting documents:', error.message);
    throw error;
  }
}
```

### Query with Filters

```typescript
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase/client';

async function getGalleryImagesByCategory(category: string) {
  try {
    const q = query(
      collection(db, 'gallery'),
      where('category', '==', category)
    );
    const querySnapshot = await getDocs(q);
    const images = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    return images;
  } catch (error: any) {
    console.error('Error querying documents:', error.message);
    throw error;
  }
}
```

### Query with Ordering and Limit

```typescript
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase/client';

async function getLatestMessages(count: number) {
  try {
    const q = query(
      collection(db, 'messages'),
      orderBy('createdAt', 'desc'),
      limit(count)
    );
    const querySnapshot = await getDocs(q);
    const messages = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    return messages;
  } catch (error: any) {
    console.error('Error querying documents:', error.message);
    throw error;
  }
}
```

### Update Document

```typescript
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/client';

async function updateGalleryImage(id: string, updates: any) {
  try {
    const docRef = doc(db, 'gallery', id);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: new Date()
    });
    console.log('Document updated');
  } catch (error: any) {
    console.error('Error updating document:', error.message);
    throw error;
  }
}
```

### Delete Document

```typescript
import { doc, deleteDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/client';

async function deleteGalleryImage(id: string) {
  try {
    await deleteDoc(doc(db, 'gallery', id));
    console.log('Document deleted');
  } catch (error: any) {
    console.error('Error deleting document:', error.message);
    throw error;
  }
}
```

### Real-time Listener

```typescript
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase/client';

function listenToGallery(callback: (images: any[]) => void) {
  const unsubscribe = onSnapshot(
    collection(db, 'gallery'),
    (snapshot) => {
      const images = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      callback(images);
    },
    (error) => {
      console.error('Error listening to gallery:', error.message);
    }
  );
  
  // Return unsubscribe function to stop listening
  return unsubscribe;
}

// Usage
const unsubscribe = listenToGallery((images) => {
  console.log('Gallery updated:', images);
});

// Stop listening when component unmounts
// unsubscribe();
```

---

## React Hook Example

### useAuth Hook

```typescript
'use client';

import { useState, useEffect } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '@/lib/firebase/client';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  return { user, loading };
}
```

### useFirestoreCollection Hook

```typescript
'use client';

import { useState, useEffect } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase/client';

export function useFirestoreCollection(collectionName: string) {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, collectionName),
      (snapshot) => {
        const items = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setData(items);
        setLoading(false);
      },
      (error) => {
        setError(error.message);
        setLoading(false);
      }
    );

    return unsubscribe;
  }, [collectionName]);

  return { data, loading, error };
}
```

---

## Server-Side Usage (Server Components / API Routes)

For server-side operations, you'll need Firebase Admin SDK (not included yet):

```bash
npm install firebase-admin
```

Then create `lib/firebase/admin.ts` with server-side Firebase Admin initialization.

---

## Analytics Example

```typescript
import { logEvent } from 'firebase/analytics';
import { analytics } from '@/lib/firebase/client';

// Track page view
if (analytics) {
  logEvent(analytics, 'page_view', {
    page_title: 'Home',
    page_path: '/'
  });
}

// Track custom event
if (analytics) {
  logEvent(analytics, 'gallery_image_viewed', {
    image_id: 'abc123',
    category: 'programs'
  });
}
```

**Note**: Analytics only works in the browser. Always check if `analytics` is not null before using.

---

## Important Notes

1. **Client-Side Only**: The current Firebase setup (`lib/firebase/client.ts`) is for client-side use only.
2. **Server-Side**: For server-side operations (Server Components, API Routes), you'll need Firebase Admin SDK.
3. **Security Rules**: Configure Firestore Security Rules in Firebase Console to protect your data.
4. **No Storage**: Firebase Storage is NOT initialized. Continue using Supabase Storage for now.
5. **Analytics Browser Only**: Analytics will return null on the server, always check before use.

---

## TypeScript Types

```typescript
import type { User } from 'firebase/auth';
import type { DocumentData, QueryDocumentSnapshot } from 'firebase/firestore';

// User type
let user: User | null = null;

// Document type
let doc: QueryDocumentSnapshot<DocumentData>;

// Custom typed document
interface GalleryImage {
  id: string;
  title: string;
  url: string;
  category: string;
  createdAt: Date;
  updatedAt: Date;
}
```

---

## Resources

- [Firebase Auth Docs](https://firebase.google.com/docs/auth/web/start)
- [Firestore Docs](https://firebase.google.com/docs/firestore/quickstart)
- [Firebase Analytics Docs](https://firebase.google.com/docs/analytics/get-started?platform=web)
