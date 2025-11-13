'use client';
    
import {
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  writeBatch,
  CollectionReference,
  DocumentReference,
  SetOptions,
  Firestore,
} from 'firebase/firestore';
import { errorEmitter } from '@/firebase/error-emitter';
import {FirestorePermissionError} from '@/firebase/errors';

/**
 * Initiates a setDoc operation for a document reference.
 * Does NOT await the write operation internally.
 */
export function setDocumentNonBlocking(docRef: DocumentReference, data: any, options: SetOptions) {
  setDoc(docRef, data, options).catch(error => {
    errorEmitter.emit(
      'permission-error',
      new FirestorePermissionError({
        path: docRef.path,
        operation: 'write', // or 'create'/'update' based on options
        requestResourceData: data,
      })
    )
  })
  // Execution continues immediately
}


/**
 * Initiates an addDoc operation. For traceability, it performs a batch write
 * to create both a private (user-owned) and public (read-only) copy of the log.
 * Does NOT await the write operation internally.
 */
export function addDocumentNonBlocking(colRef: CollectionReference, data: any) {
  // If this is a 'traces' collection, perform a batch write
  if (colRef.path.endsWith('/traces')) {
    const firestore = colRef.firestore;
    const privateDocRef = doc(colRef); // Creates a ref with a new auto-generated ID
    const publicDocRef = doc(firestore, 'traces', privateDocRef.id);

    const batch = writeBatch(firestore);
    batch.set(privateDocRef, data); // Set the private, user-owned document
    batch.set(publicDocRef, data);  // Set the public, read-only document with the same ID and data

    batch.commit().catch(error => {
       errorEmitter.emit(
        'permission-error',
        new FirestorePermissionError({
          path: colRef.path, // Path of the collection being added to
          operation: 'create',
          requestResourceData: data,
        })
      )
    });

  } else {
    // For all other collections, perform a standard addDoc
    addDoc(colRef, data)
      .catch(error => {
        errorEmitter.emit(
          'permission-error',
          new FirestorePermissionError({
            path: colRef.path,
            operation: 'create',
            requestResourceData: data,
          })
        )
      });
  }
}


/**
 * Initiates an updateDoc operation for a document reference.
 * Does NOT await the write operation internally.
 */
export function updateDocumentNonBlocking(docRef: DocumentReference, data: any) {
  updateDoc(docRef, data)
    .catch(error => {
      errorEmitter.emit(
        'permission-error',
        new FirestorePermissionError({
          path: docRef.path,
          operation: 'update',
          requestResourceData: data,
        })
      )
    });
}


/**
 * Initiates a deleteDoc operation for a document reference.
 * Does NOT await the write operation internally.
 */
export function deleteDocumentNonBlocking(docRef: DocumentReference) {
  deleteDoc(docRef)
    .catch(error => {
      errorEmitter.emit(
        'permission-error',
        new FirestorePermissionError({
          path: docRef.path,
          operation: 'delete',
        })
      )
    });
}
