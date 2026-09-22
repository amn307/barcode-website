import { useState } from 'react';
import { useCms } from '../../cms/CmsContext';
import type { CmsState } from '../../cms/types';

type Path=(string|number)[];
const isAsset=(v:any)=>v && typeof v==='object' && typeof v.src==='string' && typeof v.alt==='string' && Object.keys(v).every(k=>k==='src'||k==='alt');
const title=(s:string)=>s.replace(/([A-Z])/g,' $1').replace(/^./,c=>c.toUpperCase());
function setAt(root:any,path:Path,value:any){let p=root;for(const k of path.slice(0,-1))p=p[k];p[path[path.length-1]]=value}
function getAt(root:any,path:Path){return path.reduce((a,k)=>a[k],root)}
function Editor({value,path,onChange}:{value:any;path:Path;onChange:(p:Path,v:any)=>void}){
 if(isAsset(value)) return <div className="cms-asset"><img src={value.src} alt={value.alt}/><label>Image / video URL<input value={value.src} onChange={e=>onChange([...path,'src'],e.target.value)}/></label><label>Alt text<input value={value.alt} onChange={e=>onChange([...path,'alt'],e.target.value)}/></label><label className="cms-upload">Upload file<input type="file" accept="image/*,video/*" onChange={e=>{const f=e.target.files?.[0];if(!f)return;const r=new FileReader();r.onload=()=>onChange([...path,'src'],String(r.result));r.readAsDataURL(f)}}/></label></div>;
 if(Array.isArray(value)) return <div className="cms-array">{value.map((v,i)=><div className="cms-array-item" key={i}><div className="cms-array-tools"><b>Item {i+1}</b><button onClick={()=>{const a=[...value];a.splice(i,1);onChange(path,a)}}>Remove</button></div><Editor value={v} path={[...path,i]} onChange={onChange}/></div>)}<button className="cms-add" onClick={()=>{const sample=value[0];let n:any='';if(sample&&typeof sample==='object') n=Array.isArray(sample)?[]:Object.fromEntries(Object.keys(sample).map(k=>[k,typeof sample[k]==='number'?0:typeof sample[k]==='object'?structuredClone(sample[k]):'']));onChange(path,[...value,n])}}>+ Add item</button></div>;
 if(value && typeof value==='object') return <div className="cms-object">{Object.entries(value).map(([k,v])=><section className="cms-field-group" key={k}><h3>{title(k)}</h3><Editor value={v} path={[...path,k]} onChange={onChange}/></section>)}</div>;
 if(typeof value==='number') return <input type="number" value={value} onChange={e=>onChange(path,Number(e.target.value))}/>;
 const multiline=String(value).length>70 || String(value).includes('\n');
 return <label>{multiline?<textarea rows={4} value={String(value)} onChange={e=>onChange(path,e.target.value)}/>:<input value={String(value)} onChange={e=>onChange(path,e.target.value)}/>}</label>
}
export function AdminPage(){const {cms,updateCms,resetCms}=useCms();const [tab,setTab]=useState<keyof CmsState>('home');const change=(path:Path,value:any)=>updateCms(cur=>{setAt(cur,path,value);return cur});const data=getAt(cms,[tab]);return <div className="barcode-cms"><aside><div className="cms-brand">BARCODE<small>QYASAT CMS</small></div>{(['global','home','about','franchise'] as (keyof CmsState)[]).map(x=><button className={tab===x?'active':''} onClick={()=>setTab(x)} key={x}>{title(x)}</button>)}<a href="/">View website</a><button className="danger" onClick={()=>confirm('Reset all CMS content?')&&resetCms()}>Reset content</button></aside><main><header><div><span>CONTENT MANAGEMENT</span><h1>{title(tab)}</h1></div><p>Changes save automatically in this browser.</p></header><div className="cms-panel"><Editor value={data} path={[tab]} onChange={change}/></div></main></div>}
