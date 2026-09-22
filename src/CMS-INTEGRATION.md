# BARCODE + Qyasat CMS

This source keeps the DMCON/Qyasat CMS functionality (Firebase Authentication, Firestore content, messages, first-party analytics, pixels, media uploads and settings) while using BARCODE's visual language in the admin UI.

## Editable global/footer content
Website Content > Global contains the public logo/navigation plus the complete footer: description, section headings, phone/email, Instagram handle and URL, TikTok/LinkedIn URLs, copyright and bottom brand statement.

## Firebase
Set the VITE_FIREBASE_* values in the project root `.env`. Enable Email/Password Authentication, Firestore and Storage. Production Firestore/Storage rules must restrict CMS writes to authorized admin accounts.
