import { createContext,useContext,useEffect,useMemo,useRef,useState,type ReactNode } from 'react';
import { doc,onSnapshot,setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { defaultCms } from './defaults'; import type { CmsState } from './types';
const KEY='barcode-cms-v2'; const ref=doc(db,'cms','barcode');
const clone=()=>structuredClone(defaultCms);
function merge(base:any, saved:any):any { if(Array.isArray(base)) return Array.isArray(saved)?saved:base; if(base&&typeof base==='object'){const out={...base}; for(const k of Object.keys(saved||{})) out[k]=k in base?merge(base[k],saved[k]):saved[k]; return out;} return saved===undefined?base:saved; }
function load():CmsState{try{const raw=localStorage.getItem(KEY);return raw?merge(clone(),JSON.parse(raw)):clone()}catch{return clone()}}
const C=createContext<{cms:CmsState;updateCms:(fn:(s:CmsState)=>CmsState)=>void;resetCms:()=>void}|null>(null);
export function CmsProvider({children}:{children:ReactNode}){const[cms,setCms]=useState<CmsState>(load);const timer=useRef<number|null>(null);const fromCloud=useRef(false);
 useEffect(()=>onSnapshot(ref,s=>{if(!s.exists())return;fromCloud.current=true;const next=merge(clone(),s.data());localStorage.setItem(KEY,JSON.stringify(next));setCms(next)},e=>console.warn('CMS cloud sync unavailable',e)),[]);
 const persist=(next:CmsState)=>{localStorage.setItem(KEY,JSON.stringify(next));if(timer.current)clearTimeout(timer.current);timer.current=window.setTimeout(()=>{void setDoc(ref,next,{merge:false}).catch(e=>console.error('CMS save failed',e))},500)};
 const value=useMemo(()=>({cms,updateCms(fn:(s:CmsState)=>CmsState){setCms(cur=>{const next=fn(structuredClone(cur));next.updatedAt=new Date().toISOString();persist(next);return next})},resetCms(){const next=clone();localStorage.setItem(KEY,JSON.stringify(next));setCms(next);void setDoc(ref,next,{merge:false})}}),[cms]);return <C.Provider value={value}>{children}</C.Provider>}
export function useCms(){const v=useContext(C);if(!v)throw new Error('useCms must be used inside CmsProvider');return v}
