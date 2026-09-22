import { getDownloadURL,ref,uploadBytes } from 'firebase/storage'; import { storage } from '../lib/firebase';
export async function uploadCmsFile(file:File){const safe=file.name.replace(/[^a-zA-Z0-9._-]/g,'-');const r=ref(storage,`barcode-cms/${Date.now()}-${safe}`);await uploadBytes(r,file);return getDownloadURL(r)}
