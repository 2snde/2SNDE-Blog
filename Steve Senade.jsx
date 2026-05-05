import { useState, useEffect, useRef, useCallback } from "react";

// ─── i18n ────────────────────────────────────────────────────────────────────
const T = {
  FR: {
    posts: "Posts", creations: "Créations", talks: "Talks", about: "About",
    heroEye: "Sales · Tech · Strategy",
    heroTitle: ["Mes ", "Posts"],
    heroSub: "Stratégies, retours terrain et outils pour les sales dans la tech B2B.",
    creationsEye: "Prototypes · Tools · Open Source",
    creationsTitle: ["Mes ", "Créations"],
    creationsSub: "Prototypes et outils — sales tech, frameworks, et plus.",
    talksEye: "Podcasts · Calls · Vlogs",
    talksTitle: ["Mes ", "Talks"],
    talksSub: "Interventions audio et vidéo — podcasts, calls enregistrés, vlogs terrain.",
    all: "Tous", featured: "À la une", read: "Lire", readMin: "min",
    pinned: "Épinglé", pin: "Épingler", unpin: "Désépingler",
    newPost: "Nouveau post", newProject: "Nouveau projet", newTalk: "Nouveau talk",
    cancel: "Annuler", publish: "Publier", update: "Mettre à jour",
    titleRequired: "Titre requis", articleUpdated: "Article mis à jour ✓", articlePublished: "Article publié ✓", articleDeleted: "Article supprimé",
    projectUpdated: "Projet mis à jour ✓", projectAdded: "Projet ajouté ✓", projectDeleted: "Projet supprimé",
    talkUpdated: "Talk mis à jour ✓", talkAdded: "Talk ajouté ✓", talkDeleted: "Talk supprimé",
    deleteTitle: "Supprimer ?", deleteDesc: "Cette action est irréversible.", delete: "Supprimer",
    edit: "Modifier", filter: "Filtrer",
    draft: "Brouillon", saving: "Sauvegarde...", saved: "Sauvegardé",
    words: "mots", markdown: "markdown", preview: "aperçu",
    write: "Écrire", split: "Split", previewTab: "Aperçu",
    contactLabel: "Contact", contactTitle: "Let's connect", contactSub: "Pour échanger, collaborer ou juste discuter.",
    contactCta: "Retrouvez-moi sur Linktree →",
    title: "Titre", category: "Catégorie", status: "Statut", description: "Description",
    techStack: "Tech stack (séparé par des virgules)", links: "Liens", images: "Images",
    addLink: "Ajouter un lien", addImage: "Ajouter",
    type: "Type", duration: "Durée", show: "Émission / Source",
    audioUrl: "Lien audio/vidéo (URL)", audioFile: "Ou importer un fichier audio",
    chooseFile: "Choisir un fichier", listen: "Écouter",
    noResults: "Aucun résultat", noArticles: "Aucun article",
    relatedArticles: "Articles liés", toc: "Sommaire", backToAll: "Tous les articles",
    newCreation: "Nouvelle création", newTalkForm: "Nouveau talk",
    editCreation: "Modifier", editTalk: "Modifier",
    lang: "Langue", langLabel: "FR",
    prototype: "Prototypes", tool: "Tools", app: "Applications",
    live: "Live", wip: "En cours",
    seeAll: "Voir tout →",
    heroMainTitle: "Steve Senade",
    heroMainSub: "Build & Sell.",
    heroIntro: "Je partage mon parcours en vente — observations, stratégies terrain, outils que je construis, et réflexions sur le métier de vendeur.",
  },
  EN: {
    posts: "Posts", creations: "Creations", talks: "Talks", about: "About",
    heroEye: "Sales · Tech · Strategy",
    heroTitle: ["My ", "Posts"],
    heroSub: "Strategies, field notes and tools for sales professionals in B2B tech.",
    creationsEye: "Prototypes · Tools · Open Source",
    creationsTitle: ["My ", "Creations"],
    creationsSub: "Prototypes and tools — sales tech, frameworks, and more.",
    talksEye: "Podcasts · Calls · Vlogs",
    talksTitle: ["My ", "Talks"],
    talksSub: "Audio and video content — podcasts, recorded calls, field vlogs.",
    all: "All", featured: "Featured", read: "Read", readMin: "min",
    pinned: "Pinned", pin: "Pin", unpin: "Unpin",
    newPost: "New post", newProject: "New project", newTalk: "New talk",
    cancel: "Cancel", publish: "Publish", update: "Update",
    titleRequired: "Title required", articleUpdated: "Article updated ✓", articlePublished: "Article published ✓", articleDeleted: "Article deleted",
    projectUpdated: "Project updated ✓", projectAdded: "Project added ✓", projectDeleted: "Project deleted",
    talkUpdated: "Talk updated ✓", talkAdded: "Talk added ✓", talkDeleted: "Talk deleted",
    deleteTitle: "Delete?", deleteDesc: "This action cannot be undone.", delete: "Delete",
    edit: "Edit", filter: "Filter",
    draft: "Draft", saving: "Saving...", saved: "Saved",
    words: "words", markdown: "markdown", preview: "preview",
    write: "Write", split: "Split", previewTab: "Preview",
    contactLabel: "Contact", contactTitle: "Let's connect", contactSub: "To chat, collaborate or just say hi.",
    contactCta: "Find me on Linktree →",
    title: "Title", category: "Category", status: "Status", description: "Description",
    techStack: "Tech stack (comma separated)", links: "Links", images: "Images",
    addLink: "Add a link", addImage: "Add",
    type: "Type", duration: "Duration", show: "Show / Source",
    audioUrl: "Audio/video link (URL)", audioFile: "Or upload an audio file",
    chooseFile: "Choose file", listen: "Listen",
    noResults: "No results", noArticles: "No articles",
    relatedArticles: "Related articles", toc: "Table of contents", backToAll: "All articles",
    newCreation: "New creation", newTalkForm: "New talk",
    editCreation: "Edit", editTalk: "Edit",
    lang: "Language", langLabel: "EN",
    prototype: "Prototypes", tool: "Tools", app: "Applications",
    live: "Live", wip: "In progress",
    seeAll: "See all →",
    heroMainTitle: "Steve Senade",
    heroMainSub: "Build & Sell.",
    heroIntro: "I share my journey in sales — observations, field strategies, tools I build, and thoughts on the craft of selling.",
  }
};

// ─── DATA ────────────────────────────────────────────────────────────────────
const DEF_ARTICLES = [
  { id: 1, pinned: true, lang: "FR", title: "Pourquoi vos clients achètent — et pourquoi ils partent", date: "2026-03-10", tags: ["Sales Strategy", "Customer Success"], images: [],
    content: `# Pourquoi vos clients achètent — et pourquoi ils partent\n\nLa plupart des équipes sales passent 80% de leur temps à acquérir, et 20% à retenir. C'est **l'inverse** qu'il faut faire.\n\n## Le vrai moteur d'achat\n\nLes clients n'achètent pas des features. Ils achètent une version future d'eux-mêmes.\n\n> "People don't buy products. They buy better versions of themselves." — Marty Neumeier\n\n## Les 3 raisons silencieuses du churn\n\n1. **L'adoption ne suit pas**\n2. **La valeur n'est pas visible**\n3. **Le champion part**\n\n## Ce que les meilleurs AEs font différemment\n\n- Ils cartographient le compte dès le discovery\n- Ils définissent des KPIs business mesurables *avant* le close\n- Ils restent présents après la signature\n\n\`\`\`\nValeur perçue > Prix payé = Renouvellement\nValeur perçue < Prix payé = Churn\n\`\`\`\n\n---\n\nLa rétention commence dans le cycle de vente.` },
  { id: 2, pinned: true, lang: "FR", title: "Comment utiliser l'IA pour doubler sa productivité en sales", date: "2026-03-05", tags: ["AI", "Productivity"], images: [],
    content: `# Comment utiliser l'IA pour doubler sa productivité en sales\n\nEn 2026, l'IA n'est plus un avantage compétitif — c'est une baseline.\n\n## Prospection et recherche compte\n\n- Synthétiser les dernières news de la boîte\n- Identifier les signaux d'achat\n- Préparer des questions de discovery contextualisées\n\n> L'IA génère. Vous validez. Toujours.\n\n---\n\nL'IA est un levier. Mais la relation, la confiance, le timing — ça reste 100% humain.` },
  { id: 3, pinned: false, lang: "EN", title: "The perfect discovery call: my 5-step method", date: "2026-02-28", tags: ["Discovery", "Sales Strategy"], images: [],
    content: `# The perfect discovery call: my 5-step method\n\nDiscovery is the most underestimated step in the sales cycle.\n\n## Why most discoveries fail\n\nWe talk about the solution too early. Good discovery is 70% listening, 30% asking.\n\n## The 5 steps\n\n### 1. Context (5 min)\nSet the frame.\n\n### 2. Current situation (10 min)\nUnderstand how they work *today*.\n\n### 3. Problem & impact (15 min)\n> The magic question: *"If we don't solve this in 6 months, what happens?"*\n\n### 4. Solution vision (5 min)\nWhat they imagine as the ideal solution.\n\n### 5. Clear next steps (5 min)\nNever leave a call without a dated next step.\n\n---\n\n*Discovery is not an interrogation. It's a conversation.*` }
];
const DEF_CREATIONS = [
  { id: 1, pinned: true, lang: "EN", category: "Prototype", title: "Sales Operating System", description: "Structured public knowledge base organizing my sales methodology across three tracks.", tech: ["GitHub", "Markdown", "Open Source"], status: "live", links: [{ label: "GitHub", url: "#" }], media: [] },
  { id: 2, pinned: false, lang: "FR", category: "Tool", title: "Sales Offer & Quota Math Analyzer", description: "Workbook Excel couvrant le funnel math, modélisation du cycle, structures draw/bonus, avec références fiscales par pays.", tech: ["Excel", "VBA", "Financial Modeling"], status: "live", links: [], media: [] },
  { id: 3, pinned: false, lang: "EN", category: "Prototype", title: "Framework Builder Agent", description: "React app that extracts reusable frameworks and templates from pasted content, with AI-driven dynamic selection.", tech: ["React", "Claude API", "NLP"], status: "live", links: [{ label: "Demo", url: "#" }], media: [] },
  { id: 4, pinned: false, lang: "EN", category: "App", title: "Voice-First Sales Coach", description: "Voice-based coaching app with five-dimension scoring and animated SVG feedback.", tech: ["React", "Web Speech API", "SVG"], status: "live", links: [], media: [] },
  { id: 5, pinned: false, lang: "FR", category: "Tool", title: "Quota Reverse-Engineering Tool", description: "Outil standalone avec étapes de funnel ajustables pour reverse-engineer les quotas.", tech: ["React", "Data Viz"], status: "wip", links: [], media: [] },
];
const DEF_TALKS = [
  { id: 1, pinned: true, lang: "FR", type: "podcast", title: "Cold Calling en 2026 : ce qui marche encore", show: "Sales Unplugged", date: "2026-03-15", duration: "42 min", description: "Retour sur les techniques de cold call qui fonctionnent en B2B tech.", audioUrl: "", media: [] },
  { id: 2, pinned: false, lang: "FR", type: "call", title: "Live Discovery Call — SaaS Cybersecurity", show: "Enregistrement terrain", date: "2026-02-20", duration: "28 min", description: "Un vrai discovery call enregistré (anonymisé) avec analyse post-call.", audioUrl: "", media: [] },
  { id: 3, pinned: false, lang: "EN", type: "vlog", title: "My morning prospecting routine", show: "Vlog", date: "2026-01-10", duration: "12 min", description: "Video walkthrough of my routine before 10am: research, sequences, calls.", audioUrl: "", media: [] },
];

// ─── HELPERS ─────────────────────────────────────────────────────────────────
function parseMd(md){if(!md)return"";let h=md.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/```[\w]*\n([\s\S]*?)```/gm,(_,c)=>`<pre><code>${c.trim()}</code></pre>`).replace(/!\[([^\]]*)\]\(([^)]+)\)/g,'<img src="$2" alt="$1" style="max-width:100%;border-radius:8px;margin:1.5rem 0"/>').replace(/^#{4} (.+)$/gm,"<h4>$1</h4>").replace(/^### (.+)$/gm,"<h3>$1</h3>").replace(/^## (.+)$/gm,"<h2>$1</h2>").replace(/^# (.+)$/gm,"<h1>$1</h1>").replace(/\*\*\*(.+?)\*\*\*/g,"<strong><em>$1</em></strong>").replace(/\*\*(.+?)\*\*/g,"<strong>$1</strong>").replace(/\*(.+?)\*/g,"<em>$1</em>").replace(/`([^`]+)`/g,"<code>$1</code>").replace(/^&gt; (.+)$/gm,"<blockquote>$1</blockquote>").replace(/^---$/gm,"<hr/>").replace(/^(\d+)\. (.+)$/gm,"<li class='oli'>$2</li>").replace(/^- (.+)$/gm,"<li>$2</li>").split("\n\n").map(b=>{const t=b.trim();if(!t)return"";if(/^<(h[1-6]|pre|blockquote|hr|li|img)/.test(t))return t;return`<p>${t.replace(/\n/g,"<br/>")}</p>`;}).join("\n");h=h.replace(/(<li[^>]*>[\s\S]*?<\/li>\n?)+/g,m=>m.includes("class='oli'")?`<ol>${m.replace(/ class='oli'/g,"")}</ol>`:`<ul>${m}</ul>`);return h;}
function addIds(h){return h.replace(/<h2>(.*?)<\/h2>/g,(_,t)=>`<h2 id="${t.toLowerCase().replace(/[^a-z0-9\s]/g,"").replace(/\s+/g,"-")}">${t}</h2>`).replace(/<h3>(.*?)<\/h3>/g,(_,t)=>`<h3 id="${t.toLowerCase().replace(/[^a-z0-9\s]/g,"").replace(/\s+/g,"-")}">${t}</h3>`);}
function extractTOC(c){return c.split("\n").filter(l=>/^#{2,3} /.test(l)).map(l=>{const lv=l.match(/^(#{2,3})/)[1].length;const t=l.replace(/^#{2,3} /,"").trim();return{level:lv,text:t,id:t.toLowerCase().replace(/[^a-z0-9\s]/g,"").replace(/\s+/g,"-")};});}
function rt(c){return Math.max(1,Math.round(c.replace(/[#*`>-]/g,"").split(/\s+/).filter(Boolean).length/200));}
function fDate(d,lang){return new Date(d).toLocaleDateString(lang==="FR"?"fr-FR":"en-US",{day:"numeric",month:"short",year:"numeric"});}
function exc(c){return c.replace(/^#+.+$/gm,"").replace(/[*_`#>![\]()]/g,"").replace(/\n+/g," ").trim().slice(0,150);}
const CC=[["rgba(180,83,9,0.08)","#92400e","rgba(180,83,9,0.2)"],["rgba(5,150,105,0.08)","#065f46","rgba(5,150,105,0.2)"],["rgba(124,58,237,0.08)","#5b21b6","rgba(124,58,237,0.2)"],["rgba(219,39,119,0.08)","#9d174d","rgba(219,39,119,0.2)"],["rgba(14,116,144,0.08)","#155e75","rgba(14,116,144,0.2)"]];
function cs(i){const[bg,fg,bd]=CC[i%CC.length];return{background:bg,color:fg,border:`1px solid ${bd}`};}
const TI={podcast:"🎙️",call:"📞",vlog:"🎬",interview:"💬"};
const SS={live:{bg:"rgba(52,211,153,0.1)",c:"#34d399",bd:"rgba(52,211,153,0.28)"},wip:{bg:"rgba(251,146,60,0.1)",c:"#fb923c",bd:"rgba(251,146,60,0.28)"}};
function useStore(k,d){const[v,s]=useState(()=>{try{const x=localStorage.getItem(k);return x?JSON.parse(x):d;}catch{return d;}});useEffect(()=>{try{localStorage.setItem(k,JSON.stringify(v));}catch{}},[v]);return[v,s];}
function f2b(f){return new Promise((r,j)=>{const x=new FileReader();x.onload=()=>r(x.result);x.onerror=j;x.readAsDataURL(f);});}
const LANG_CHIP={FR:{bg:"rgba(79,156,249,0.15)",c:"#82baff",bd:"rgba(79,156,249,0.3)"},EN:{bg:"rgba(52,211,153,0.12)",c:"#34d399",bd:"rgba(52,211,153,0.25)"}};

// ─── SCROLL ANIMATION ───────────────────────────────────────────────────────
function useScrollReveal() {
  const ref = useRef();
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.1, rootMargin: "0px 0px -30px 0px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return [ref, visible];
}
function Reveal({ children, delay = 0, direction = "up", className = "", style = {} }) {
  const [ref, visible] = useScrollReveal();
  const transforms = { up: "translateY(28px)", down: "translateY(-28px)", left: "translateX(-28px)", right: "translateX(28px)", none: "none" };
  return (
    <div ref={ref} className={className} style={{ ...style, opacity: visible ? 1 : 0, transform: visible ? "none" : transforms[direction], transition: `opacity 0.65s cubic-bezier(0.16,1,0.3,1) ${delay}s, transform 0.65s cubic-bezier(0.16,1,0.3,1) ${delay}s` }}>
      {children}
    </div>
  );
}

// ─── COMPONENTS ──────────────────────────────────────────────────────────────
function Modal({children,onClose}){return(<div className="mo" onClick={e=>{if(e.target===e.currentTarget)onClose();}}><div className="mo-box">{children}</div></div>);}
function LangChip({lang}){const s=LANG_CHIP[lang]||LANG_CHIP.EN;const flag=lang==="FR"?"🇫🇷":"🇬🇧";return <span className="chip" style={{background:s.bg,color:s.c,border:`1px solid ${s.bd}`,fontSize:"0.55rem",display:"inline-flex",alignItems:"center",gap:"3px"}}>{flag} {lang}</span>;}

function ShareButtons({title,slug,compact}){
  const baseUrl="https://2snde.pro";const url=`${baseUrl}/${slug||""}`;const encodedUrl=encodeURIComponent(url);const encodedTitle=encodeURIComponent(title);
  const liUrl=`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;const xUrl=`https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`;
  const copyLink=()=>{navigator.clipboard.writeText(url).then(()=>{const btn=document.activeElement;if(btn){btn.textContent="✓";setTimeout(()=>btn.textContent="🔗",2000);}});};
  if(compact)return(<div className="share-compact" onClick={e=>e.stopPropagation()}><a href={liUrl} target="_blank" rel="noopener noreferrer" className="share-btn" title="LinkedIn"><svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg></a><a href={xUrl} target="_blank" rel="noopener noreferrer" className="share-btn" title="X"><svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg></a><button className="share-btn" onClick={copyLink} title="Copy link">🔗</button></div>);
  return(<div className="share-row" onClick={e=>e.stopPropagation()}><a href={liUrl} target="_blank" rel="noopener noreferrer" className="share-btn-full"><svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg> LinkedIn</a><a href={xUrl} target="_blank" rel="noopener noreferrer" className="share-btn-full"><svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg> X</a><button className="share-btn-full" onClick={copyLink}>🔗 Link</button></div>);
}

function ImageUploader({images,setImages,t}){const ref=useRef();const add=async(e)=>{for(const f of Array.from(e.target.files)){if(!f.type.startsWith("image/"))continue;const b=await f2b(f);setImages(p=>[...p,{name:f.name,data:b}]);}e.target.value="";};return(<div><div className="field-label">{t.images}</div><div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:6}}>{images.map((img,i)=>(<div key={i} style={{position:"relative",width:56,height:56,borderRadius:6,overflow:"hidden",border:"1px solid var(--border2)"}}><img src={img.data} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}/><button onClick={()=>setImages(p=>p.filter((_,j)=>j!==i))} style={{position:"absolute",top:1,right:1,background:"rgba(0,0,0,0.7)",color:"#fff",border:"none",borderRadius:"50%",width:16,height:16,fontSize:"0.55rem",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>✕</button></div>))}<button onClick={()=>ref.current?.click()} className="upload-btn">{t.addImage}</button></div><input ref={ref} type="file" accept="image/png,image/jpeg,image/gif,image/webp" multiple hidden onChange={add}/></div>);}
function LinksEditor({links,setLinks,t}){return(<div><div className="field-label">{t.links}</div>{links.map((l,i)=>(<div key={i} style={{display:"flex",gap:6,marginBottom:6}}><input className="form-input" placeholder="Label" value={l.label} onChange={e=>{const v=e.target.value;setLinks(p=>p.map((x,j)=>j===i?{...x,label:v}:x));}} style={{width:110}}/><input className="form-input" placeholder="https://..." value={l.url} onChange={e=>{const v=e.target.value;setLinks(p=>p.map((x,j)=>j===i?{...x,url:v}:x));}} style={{flex:1}}/><button onClick={()=>setLinks(p=>p.filter((_,j)=>j!==i))} className="form-rm">✕</button></div>))}<button onClick={()=>setLinks(p=>[...p,{label:"",url:""}])} className="form-add-btn">+ {t.addLink}</button></div>);}

const TBA=[{i:"B",w:["**","**"],s:"texte"},{i:"I",w:["*","*"],s:"texte",it:1},{i:"H2",ln:"## "},{i:"H3",ln:"### "},{i:"❝",ln:"> "},{i:"</>",w:["`","`"],s:"code",mo:1},{i:"≡",ln:"- "},{i:"1.",ln:"1. "},{i:"—",ins:"\n\n---\n\n"},{i:"🖼️",ins:"\n\n![description](url)\n\n"}];
function Toolbar({taRef,draft,setDraft}){const ap=(a)=>{const ta=taRef.current;if(!ta)return;const{selectionStart:s,selectionEnd:e}=ta;const v=draft.content;const sel=v.slice(s,e);let nv,ns,ne;if(a.ins){nv=v.slice(0,s)+a.ins+v.slice(e);ns=ne=s+a.ins.length;}else if(a.w){const[o,c]=a.w;const t=sel||a.s;nv=v.slice(0,s)+o+t+c+v.slice(e);ns=s+o.length;ne=ns+t.length;}else if(a.ln){const ls=v.lastIndexOf("\n",s-1)+1;nv=v.slice(0,ls)+a.ln+v.slice(ls);ns=ne=s+a.ln.length;}setDraft(d=>({...d,content:nv}));requestAnimationFrame(()=>{ta.focus();ta.setSelectionRange(ns,ne);});};return(<div style={{display:"flex",gap:2,flexWrap:"wrap"}}>{TBA.map((a,i)=>(<button key={i} onClick={()=>ap(a)} className="tb-btn" style={{fontFamily:a.mo?"var(--fm)":a.it?"Georgia,serif":"var(--fd)",fontStyle:a.it?"italic":"normal",fontWeight:a.i==="B"?800:600,fontSize:a.i.length>2?"0.58rem":"0.7rem"}}>{a.i}</button>))}</div>);}

function ArtView({article,all,onBack,onEdit,onDelete,lang}){
  const t=T[lang];const[prog,setProg]=useState(0);const[actId,setActId]=useState("");const[cfm,setCfm]=useState(false);
  const toc=extractTOC(article.content);const html=addIds(parseMd(article.content));
  useEffect(()=>{window.scrollTo(0,0);const fn=()=>{const el=document.documentElement;setProg((el.scrollTop/(el.scrollHeight-el.clientHeight))*100||0);const hs=document.querySelectorAll(".md-body h2,.md-body h3");let c="";hs.forEach(h=>{if(h.getBoundingClientRect().top<120)c=h.id;});setActId(c);};window.addEventListener("scroll",fn);return()=>window.removeEventListener("scroll",fn);},[article]);
  useEffect(()=>{document.querySelectorAll(".md-body pre").forEach(pre=>{if(pre.querySelector(".copy-btn"))return;const btn=document.createElement("button");btn.className="copy-btn";btn.textContent="Copy";btn.onclick=()=>{navigator.clipboard.writeText(pre.querySelector("code")?.textContent||"").then(()=>{btn.textContent="✓";setTimeout(()=>btn.textContent="Copy",2000);});};pre.style.position="relative";pre.appendChild(btn);});},[article]);
  const rel=all.filter(a=>a.id!==article.id&&a.tags.some(x=>article.tags.includes(x))).slice(0,3);
  return(<div style={{background:"var(--bg)",minHeight:"100vh"}}><div className="read-progress" style={{width:`${prog}%`}}/><div className="art-hero"><div className="art-hero-inner"><button onClick={onBack} className="back-btn">← {t.backToAll}</button><div style={{display:"flex",gap:"0.4rem",marginBottom:"1rem",flexWrap:"wrap"}}>{article.tags.map((x,i)=><span key={x} className="chip" style={cs(i)}>{x}</span>)}<LangChip lang={article.lang}/></div><h1 className="art-title">{article.title}</h1><div className="art-info-row"><span className="art-info">{fDate(article.date,lang)}</span><span className="art-sep"/><span className="art-info">{rt(article.content)} {t.readMin}</span><div className="art-actions"><ShareButtons title={article.title} slug={article.slug||article.id}/><button className="btn-sm-ghost" onClick={onEdit}>{t.edit}</button><button className="btn-sm-danger" onClick={()=>setCfm(true)}>{t.delete}</button></div></div></div></div>
    <div className="art-layout" style={{gridTemplateColumns:toc.length>0?"1fr 200px":"1fr"}}><div><div className="md md-body" dangerouslySetInnerHTML={{__html:html}}/>{article.images?.length>0&&<div style={{display:"flex",gap:8,flexWrap:"wrap",margin:"2rem 0"}}>{article.images.map((img,i)=><img key={i} src={img.data} alt="" style={{maxWidth:"100%",borderRadius:8,border:"1px solid var(--border2)"}}/>)}</div>}{rel.length>0&&<div className="related-section"><div className="related-label">{t.relatedArticles}</div>{rel.map(a=><div key={a.id} className="related-card" onClick={()=>{window.scrollTo(0,0);onBack();}}><div style={{flex:1}}><div style={{fontFamily:"var(--fd)",fontSize:"0.68rem",color:"var(--text3)",marginBottom:"0.2rem"}}>{fDate(a.date,lang)}</div><div style={{fontFamily:"var(--fd)",fontSize:"0.88rem",fontWeight:700,color:"var(--text)",lineHeight:1.3}}>{a.title}</div></div><div style={{fontFamily:"var(--fd)",fontSize:"0.72rem",color:"var(--text3)",alignSelf:"center"}}>{rt(a.content)} {t.readMin} →</div></div>)}</div>}</div>
      {toc.length>0&&<aside className="toc"><div className="toc-label">{t.toc}</div><nav className="toc-nav">{toc.map(({level,text,id})=><a key={id} href={`#${id}`} className={`toc-link ${actId===id?"active":""}`} style={{paddingLeft:level===3?"1rem":0}}>{text}</a>)}</nav></aside>}
    </div>
    {cfm&&<Modal onClose={()=>setCfm(false)}><div style={{fontSize:"2rem",textAlign:"center",marginBottom:"1rem"}}>🗑️</div><h3 className="mo-title">{t.deleteTitle}</h3><p className="mo-desc">{t.deleteDesc}</p><div style={{display:"flex",gap:"0.75rem"}}><button className="mo-cancel" onClick={()=>setCfm(false)}>{t.cancel}</button><button className="mo-delete" onClick={()=>{setCfm(false);onDelete();}}>{t.delete}</button></div></Modal>}
  </div>);
}

function CreationForm({initial,onSave,onCancel,t}){
  const[f,setF]=useState(initial||{title:"",category:"Prototype",description:"",tech:"",status:"wip",lang:"EN"});
  const[media,setMedia]=useState(initial?.media||[]);const[links,setLinks]=useState(initial?.links||[]);
  return(<Modal onClose={onCancel}><h3 className="mo-title">{initial?t.editCreation:t.newCreation}</h3><div className="form-grid">
    <div><div className="field-label">{t.title}</div><input className="form-input" value={f.title} onChange={e=>setF(p=>({...p,title:e.target.value}))}/></div>
    <div style={{display:"flex",gap:8}}><div style={{flex:1}}><div className="field-label">{t.category}</div><select className="form-input" value={f.category} onChange={e=>setF(p=>({...p,category:e.target.value}))}><option>Prototype</option><option>Tool</option><option>App</option></select></div><div style={{flex:1}}><div className="field-label">{t.status}</div><select className="form-input" value={f.status} onChange={e=>setF(p=>({...p,status:e.target.value}))}><option value="live">{t.live}</option><option value="wip">{t.wip}</option></select></div><div style={{width:80}}><div className="field-label">{t.lang}</div><select className="form-input" value={f.lang||"EN"} onChange={e=>setF(p=>({...p,lang:e.target.value}))}><option value="FR">🇫🇷 FR</option><option value="EN">🇬🇧 EN</option></select></div></div>
    <div><div className="field-label">{t.description}</div><textarea className="form-input form-ta" value={f.description} onChange={e=>setF(p=>({...p,description:e.target.value}))} rows={3}/></div>
    <div><div className="field-label">{t.techStack}</div><input className="form-input" value={f.tech} onChange={e=>setF(p=>({...p,tech:e.target.value}))}/></div>
    <ImageUploader images={media} setImages={setMedia} t={t}/><LinksEditor links={links} setLinks={setLinks} t={t}/>
  </div><div style={{display:"flex",gap:"0.75rem",marginTop:"1.5rem"}}><button className="mo-cancel" onClick={onCancel}>{t.cancel}</button><button className="mo-save" onClick={()=>{if(!f.title.trim())return;onSave({...f,tech:typeof f.tech==="string"?f.tech.split(",").map(x=>x.trim()).filter(Boolean):f.tech,links,media});}}>{initial?t.update:t.publish}</button></div></Modal>);
}

function TalkForm({initial,onSave,onCancel,t}){
  const[f,setF]=useState(initial||{title:"",type:"podcast",show:"",description:"",duration:"",audioUrl:"",lang:"FR"});
  const[media,setMedia]=useState(initial?.media||[]);const aRef=useRef();
  const handleAudio=async(e)=>{const file=e.target.files?.[0];if(!file)return;const b=await f2b(file);setF(p=>({...p,audioUrl:b,audioName:file.name}));e.target.value="";};
  return(<Modal onClose={onCancel}><h3 className="mo-title">{initial?t.editTalk:t.newTalkForm}</h3><div className="form-grid">
    <div><div className="field-label">{t.title}</div><input className="form-input" value={f.title} onChange={e=>setF(p=>({...p,title:e.target.value}))}/></div>
    <div style={{display:"flex",gap:8}}><div style={{flex:1}}><div className="field-label">{t.type}</div><select className="form-input" value={f.type} onChange={e=>setF(p=>({...p,type:e.target.value}))}><option value="podcast">Podcast</option><option value="call">Call</option><option value="vlog">Vlog</option><option value="interview">Interview</option></select></div><div style={{flex:1}}><div className="field-label">{t.duration}</div><input className="form-input" value={f.duration} onChange={e=>setF(p=>({...p,duration:e.target.value}))} placeholder="42 min"/></div><div style={{width:80}}><div className="field-label">{t.lang}</div><select className="form-input" value={f.lang||"FR"} onChange={e=>setF(p=>({...p,lang:e.target.value}))}><option value="FR">🇫🇷 FR</option><option value="EN">🇬🇧 EN</option></select></div></div>
    <div><div className="field-label">{t.show}</div><input className="form-input" value={f.show} onChange={e=>setF(p=>({...p,show:e.target.value}))}/></div>
    <div><div className="field-label">{t.description}</div><textarea className="form-input form-ta" value={f.description} onChange={e=>setF(p=>({...p,description:e.target.value}))} rows={3}/></div>
    <div><div className="field-label">{t.audioUrl}</div><input className="form-input" value={typeof f.audioUrl==="string"&&!f.audioUrl.startsWith("data:")?f.audioUrl:""} onChange={e=>setF(p=>({...p,audioUrl:e.target.value}))} placeholder="https://youtube.com/... ou spotify.com/..."/></div>
    <div><div className="field-label">{t.audioFile}</div><button onClick={()=>aRef.current?.click()} className="upload-btn" style={{width:"auto",height:"auto",padding:"0.4rem 0.75rem"}}>📎 {t.chooseFile}</button>{f.audioName&&<div style={{fontFamily:"var(--fm)",fontSize:"0.65rem",color:"var(--green)",marginTop:4}}>✓ {f.audioName}</div>}<input ref={aRef} type="file" accept="audio/*,video/*" hidden onChange={handleAudio}/></div>
    <ImageUploader images={media} setImages={setMedia} t={t}/>
  </div><div style={{display:"flex",gap:"0.75rem",marginTop:"1.5rem"}}><button className="mo-cancel" onClick={onCancel}>{t.cancel}</button><button className="mo-save" onClick={()=>{if(!f.title.trim())return;onSave({...f,media});}}>{initial?t.update:t.publish}</button></div></Modal>);
}

function ContactFooter({t}){return(<Reveal><div className="contact-footer"><div className="contact-inner"><div className="contact-label">{t.contactLabel}</div><h2 className="contact-title">{t.contactTitle}</h2><p className="contact-sub">{t.contactSub}</p><a href="https://linktr.ee/stevesenade" target="_blank" rel="noopener noreferrer" className="contact-link"><span>🔗</span> {t.contactCta}</a></div></div></Reveal>);}

// ═════════════════════════════════════════════════════════════════════════════
export default function App(){
  const[lang,setLang]=useStore("2s_lang","FR");
  const t=T[lang];
  const[section,setSection]=useState("home");
  const[articles,setArticles]=useStore("2s_posts_v3",DEF_ARTICLES);
  const[creations,setCreations]=useStore("2s_crea_v3",DEF_CREATIONS);
  const[talks,setTalks]=useStore("2s_talks_v3",DEF_TALKS);
  const[view,setView]=useState("list");
  const[current,setCurrent]=useState(null);
  const[draft,setDraft]=useState({title:"",tags:"",content:"",lang:"FR"});
  const[editId,setEditId]=useState(null);
  const[tab,setTab]=useState("split");
  const[filterTag,setFilterTag]=useState(null);
  const[filterCat,setFilterCat]=useState(null);
  const[filterLang,setFilterLang]=useState(null);
  const[toast,setToast]=useState(null);
  const[scrolled,setScrolled]=useState(false);
  const[saveStatus,setSaveStatus]=useState("idle");
  const[showForm,setShowForm]=useState(null);
  const[editItem,setEditItem]=useState(null);
  const[images,setImages]=useState([]);
  const taRef=useRef();const asRef=useRef();const stRef=useRef();

  useEffect(()=>{const fn=()=>setScrolled(window.scrollY>20);window.addEventListener("scroll",fn);return()=>window.removeEventListener("scroll",fn);},[]);
  useEffect(()=>{if(view!=="editor")return;clearTimeout(asRef.current);setSaveStatus("saving");asRef.current=setTimeout(()=>{setSaveStatus("saved");clearTimeout(stRef.current);stRef.current=setTimeout(()=>setSaveStatus("idle"),2500);},900);},[draft]);
  useEffect(()=>{const fn=(e)=>{if((e.metaKey||e.ctrlKey)&&e.key==="s"&&view==="editor"){e.preventDefault();savePost();}};window.addEventListener("keydown",fn);return()=>window.removeEventListener("keydown",fn);},[view,draft,editId,images]);

  const notify=(m,type="success")=>{setToast({m,type});setTimeout(()=>setToast(null),2800);};
  const navTo=(s)=>{setSection(s);setView("list");setCurrent(null);setFilterTag(null);setFilterCat(null);setFilterLang(null);window.scrollTo(0,0);};
  const toggleLang=()=>setLang(l=>l==="FR"?"EN":"FR");

  // Posts
  const allTags=[...new Set(articles.flatMap(a=>a.tags))];
  const tagCounts=allTags.reduce((a,x)=>{a[x]=articles.filter(y=>y.tags.includes(x)).length;return a;},{});
  const filtered=articles.filter(a=>(!filterTag||a.tags.includes(filterTag))&&(!filterLang||a.lang===filterLang));
  const pinnedPost=filtered.find(a=>a.pinned);const restPosts=filtered.filter(a=>!a.pinned);
  const openNew=()=>{setDraft({title:"",tags:"",content:"# Title\n\nStart writing...",lang});setEditId(null);setImages([]);setView("editor");};
  const openEdit=(a)=>{setDraft({title:a.title,tags:a.tags.join(", "),content:a.content,lang:a.lang||"FR"});setEditId(a.id);setImages(a.images||[]);setView("editor");};
  const savePost=useCallback(()=>{if(!draft.title.trim()){notify(t.titleRequired,"error");return;}const tags=draft.tags.split(",").map(x=>x.trim()).filter(Boolean);if(editId){setArticles(p=>p.map(a=>a.id===editId?{...a,title:draft.title,tags,content:draft.content,images,lang:draft.lang}:a));notify(t.articleUpdated);}else{setArticles(p=>[{id:Date.now(),pinned:false,title:draft.title,slug:draft.title.toLowerCase().replace(/\s+/g,"-").replace(/[^\w-]/g,""),date:new Date().toISOString().split("T")[0],tags,content:draft.content,images,lang:draft.lang},...p]);notify(t.articlePublished);}setView("list");},[draft,editId,images,t]);
  const delPost=(id)=>{setArticles(p=>p.filter(a=>a.id!==id));setView("list");notify(t.articleDeleted);};
  const togglePinPost=(id,e)=>{if(e)e.stopPropagation();setArticles(p=>{const target=p.find(a=>a.id===id);if(target.pinned)return p.map(a=>a.id===id?{...a,pinned:false}:a);const pinCount=p.filter(a=>a.pinned).length;if(pinCount>=2)return p;return p.map(a=>a.id===id?{...a,pinned:true}:a);});};

  // Creations
  const allCats=[...new Set(creations.map(c=>c.category))];
  const filteredC=creations.filter(c=>(!filterCat||c.category===filterCat)&&(!filterLang||c.lang===filterLang));
  const saveCreation=(data)=>{if(editItem){setCreations(p=>p.map(c=>c.id===editItem.id?{...c,...data}:c));notify(t.projectUpdated);}else{setCreations(p=>[{id:Date.now(),pinned:false,...data},...p]);notify(t.projectAdded);}setShowForm(null);setEditItem(null);};
  const delCreation=(id)=>{setCreations(p=>p.filter(c=>c.id!==id));notify(t.projectDeleted);};
  const togglePinCreation=(id)=>{setCreations(p=>p.map(c=>({...c,pinned:c.id===id?!c.pinned:false})));};

  // Talks
  const filteredT=talks.filter(x=>!filterLang||x.lang===filterLang);
  const saveTalk=(data)=>{if(editItem){setTalks(p=>p.map(x=>x.id===editItem.id?{...x,...data,date:x.date}:x));notify(t.talkUpdated);}else{setTalks(p=>[{id:Date.now(),pinned:false,date:new Date().toISOString().split("T")[0],...data},...p]);notify(t.talkAdded);}setShowForm(null);setEditItem(null);};
  const delTalk=(id)=>{setTalks(p=>p.filter(x=>x.id!==id));notify(t.talkDeleted);};
  const togglePinTalk=(id)=>{setTalks(p=>p.map(x=>({...x,pinned:x.id===id?!x.pinned:false})));};

  const wc=draft.content.split(/\s+/).filter(Boolean).length;
  const LangFilters=()=>(<div className="lang-filters"><button className={`lang-btn ${filterLang===null?"on":""}`} onClick={()=>setFilterLang(null)}>{t.all}</button><button className={`lang-btn ${filterLang==="FR"?"on":""}`} onClick={()=>setFilterLang(filterLang==="FR"?null:"FR")}>🇫🇷 FR</button><button className={`lang-btn ${filterLang==="EN"?"on":""}`} onClick={()=>setFilterLang(filterLang==="EN"?null:"EN")}>🇬🇧 EN</button></div>);

  // Pinned items for landing
  const pinnedArticles=articles.filter(a=>a.pinned).slice(0,2);
  const pinnedTalk=talks.find(x=>x.pinned);

  return(
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Space+Grotesk:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        :root{--bg:#fffcf8;--bg2:#faf6f0;--bg3:#f0ebe4;--border:rgba(0,0,0,0.06);--border2:rgba(0,0,0,0.1);--text:#2c1e10;--text2:#6b5744;--text3:#9c8b7a;--accent:#b45309;--accent2:#92400e;--accent-dim:rgba(180,83,9,0.06);--accent-glow:rgba(180,83,9,0.12);--green:#059669;--orange:#d97706;--red:#dc2626;--fd:'Space Grotesk',sans-serif;--fb:'Inter',sans-serif;--fm:'JetBrains Mono',monospace}
        html{font-size:16px;scroll-behavior:smooth}body{background:var(--bg);color:var(--text);font-family:var(--fb);-webkit-font-smoothing:antialiased}
        ::-webkit-scrollbar{width:5px}::-webkit-scrollbar-track{background:var(--bg2)}::-webkit-scrollbar-thumb{background:var(--bg3);border-radius:3px}

        .nav{position:sticky;top:0;z-index:200;background:rgba(255,252,248,0.88);backdrop-filter:blur(24px);border-bottom:1px solid transparent;transition:all 0.4s}.nav.stuck{border-bottom-color:var(--border);background:rgba(255,252,248,0.96)}.nav-inner{max-width:1100px;margin:0 auto;height:64px;padding:0 2rem;display:flex;align-items:center;justify-content:space-between;gap:0.75rem}
        .logo{font-family:var(--fd);font-size:1.1rem;font-weight:800;color:var(--text);cursor:pointer;display:flex;align-items:center;gap:10px;transition:all 0.2s;flex-shrink:0;background:none;border:none}.logo:hover{opacity:0.75}.logo-mark{width:32px;height:32px;background:linear-gradient(135deg,var(--accent),#d97706);border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:0.62rem;font-weight:800;color:#fff;box-shadow:0 0 20px var(--accent-glow);flex-shrink:0}
        .nav-links{display:flex;align-items:center;gap:0.15rem;font-family:var(--fd);font-size:0.8rem;font-weight:600}.nav-dot{color:var(--text3);padding:0 0.15rem;user-select:none}.nav-link{color:var(--text2);cursor:pointer;padding:0.35rem 0.7rem;border-radius:8px;transition:all 0.2s;border:none;background:none;font:inherit;font-weight:600}.nav-link:hover{color:var(--text);background:rgba(255,255,255,0.04)}.nav-link.active{color:var(--accent2);background:var(--accent-dim)}
        .nav-right{display:flex;align-items:center;gap:0.6rem;flex-shrink:0}
        .lang-toggle{font-family:var(--fd);font-size:0.68rem;font-weight:700;background:rgba(255,255,255,0.04);color:var(--text2);border:1px solid var(--border2);border-radius:8px;padding:0.35rem 0.6rem;cursor:pointer;transition:all 0.2s;display:flex;align-items:center;gap:4px}.lang-toggle:hover{color:var(--text);border-color:rgba(255,255,255,0.2)}
        .btn-new{font-family:var(--fd);font-size:0.75rem;font-weight:700;background:linear-gradient(135deg,var(--accent),#667eea);color:#fff;border:none;border-radius:8px;padding:0.45rem 1rem;cursor:pointer;display:flex;align-items:center;gap:5px;transition:all 0.2s;box-shadow:0 0 20px var(--accent-glow);white-space:nowrap}.btn-new:hover{transform:translateY(-1px);box-shadow:0 4px 24px var(--accent-glow)}
        .btn-cancel{font-family:var(--fd);font-size:0.78rem;font-weight:600;background:var(--bg3);color:var(--text2);border:1px solid var(--border2);border-radius:8px;padding:0.4rem 1rem;cursor:pointer}

        /* ── LANDING ─────────────────────────────────────────────── */
        .landing{max-width:680px;margin:0 auto;padding:0 2rem}
        .landing-hero{padding:3rem 0 1.5rem;text-align:center}
        .landing-badge{font-family:var(--fd);font-size:0.68rem;font-weight:700;letter-spacing:0.18em;text-transform:uppercase;color:var(--accent);margin-bottom:1rem}
        .landing-name{font-family:var(--fd);font-size:clamp(1.8rem,5vw,2.8rem);font-weight:800;letter-spacing:-0.04em;line-height:1.08;margin-bottom:0.4rem}
        .landing-role{font-family:var(--fd);font-size:clamp(0.85rem,1.8vw,1rem);color:var(--text2);font-weight:500;margin-bottom:1.25rem}
        .landing-intro{font-family:var(--fb);font-size:0.88rem;color:var(--text2);line-height:1.7;max-width:520px;margin:0 auto;text-align:center}
        .landing-divider{width:40px;height:1px;background:var(--border2);margin:2rem auto}

        .landing-section{margin-bottom:2.25rem}
        .landing-section-header{display:flex;align-items:center;justify-content:space-between;margin-bottom:1.25rem}
        .landing-section-title{font-family:var(--fd);font-size:0.62rem;font-weight:700;letter-spacing:0.18em;text-transform:uppercase;color:var(--text3);display:flex;align-items:center;gap:8px}
        .landing-section-title::before{content:'';width:16px;height:1px;background:var(--text3)}
        .landing-see-all{font-family:var(--fd);font-size:0.72rem;font-weight:600;color:var(--accent2);background:none;border:none;cursor:pointer;transition:opacity 0.15s;padding:0}.landing-see-all:hover{opacity:0.7}

        .landing-pin-card{background:var(--bg2);border:1px solid var(--border);border-radius:12px;padding:1.35rem;cursor:pointer;transition:all 0.25s;position:relative;overflow:hidden}.landing-pin-card::before{content:'';position:absolute;top:0;left:0;right:0;height:2px;background:linear-gradient(90deg,var(--accent),#d97706,transparent)}.landing-pin-card:hover{border-color:rgba(180,83,9,0.2);transform:translateY(-2px);box-shadow:0 12px 40px rgba(0,0,0,0.08)}
        .landing-pin-label{font-family:var(--fd);font-size:0.55rem;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:var(--accent);margin-bottom:0.6rem;display:flex;align-items:center;gap:4px}
        .landing-pin-title{font-family:var(--fd);font-size:1.05rem;font-weight:700;line-height:1.3;margin-bottom:0.4rem}
        .landing-pin-excerpt{font-family:var(--fd);font-size:0.8rem;color:var(--text2);line-height:1.55}
        .landing-pin-meta{font-family:var(--fd);font-size:0.65rem;color:var(--text3);margin-top:0.75rem;display:flex;align-items:center;gap:0.6rem}
        .landing-empty{font-family:var(--fd);font-size:0.78rem;color:var(--text3);font-style:italic}

        /* ── PAGE ────────────────────────────────────────────────── */
        .page-wrap{max-width:760px;margin:0 auto;padding:4rem 2rem 2rem}
        .site-intro{margin-bottom:2.5rem;padding-bottom:2.5rem;border-bottom:1px solid var(--border)}.intro-eyebrow{font-family:var(--fd);font-size:0.65rem;font-weight:700;letter-spacing:0.18em;text-transform:uppercase;color:var(--accent);margin-bottom:1.25rem;display:flex;align-items:center;gap:8px}.intro-eyebrow::before{content:'';width:20px;height:1px;background:var(--accent);display:block}.intro-title{font-family:var(--fd);font-size:clamp(1.6rem,4vw,2.4rem);font-weight:800;letter-spacing:-0.03em;line-height:1.15;margin-bottom:0.9rem}.intro-title em{font-style:normal;color:var(--accent)}.intro-sub{font-family:var(--fd);font-size:0.88rem;color:var(--text2);line-height:1.65;max-width:500px}

        .filter-row{display:flex;gap:0.75rem;margin-bottom:2rem;flex-wrap:wrap;align-items:center}
        .filters{display:flex;gap:0.35rem;flex-wrap:wrap}.ftag{font-family:var(--fd);font-size:0.72rem;font-weight:600;padding:0.25rem 0.7rem;border-radius:18px;border:1px solid var(--border2);background:transparent;color:var(--text3);cursor:pointer;transition:all 0.2s;display:flex;align-items:center;gap:4px}.ftag:hover{color:var(--accent2);border-color:rgba(79,156,249,0.4);background:var(--accent-dim)}.ftag.on{background:var(--accent-dim);border-color:rgba(79,156,249,0.5);color:var(--accent2)}.ftag-count{font-size:0.58rem;background:var(--bg3);padding:0 4px;border-radius:3px}.ftag.on .ftag-count{background:rgba(79,156,249,0.2);color:var(--accent2)}
        .lang-filters{display:flex;gap:0.3rem;margin-left:auto}.lang-btn{font-family:var(--fd);font-size:0.68rem;font-weight:600;padding:0.2rem 0.6rem;border-radius:14px;border:1px solid var(--border2);background:transparent;color:var(--text3);cursor:pointer;transition:all 0.15s}.lang-btn:hover{color:var(--text)}.lang-btn.on{background:var(--accent-dim);border-color:rgba(79,156,249,0.4);color:var(--accent2)}

        .post-list{display:flex;flex-direction:column}.post-item{padding:1.25rem 0;border-bottom:1px solid var(--border);cursor:pointer;transition:all 0.2s;display:flex;align-items:center;gap:0.75rem}.post-item:first-child{padding-top:0}.post-item:hover{transform:translateX(4px)}.post-item:hover .post-title{color:var(--accent2)}.post-date{font-family:var(--fd);font-size:0.7rem;color:var(--text3);min-width:80px;flex-shrink:0}.post-title{font-family:var(--fd);font-size:0.95rem;font-weight:700;color:var(--text);line-height:1.35;transition:all 0.2s;flex:1}.post-pin{font-size:0.65rem;opacity:0.35;cursor:pointer;flex-shrink:0;transition:all 0.15s;background:none;border:none;padding:2px 4px;border-radius:4px}.post-pin:hover{opacity:1;background:var(--accent-dim)}.post-pin.is-pinned{opacity:1;color:var(--accent)}
        .featured-post{background:var(--bg2);border:1px solid var(--border);border-radius:14px;padding:1.75rem;margin-bottom:1.75rem;cursor:pointer;transition:all 0.3s;position:relative;overflow:hidden}.featured-post::before{content:'';position:absolute;top:0;left:0;right:0;height:2px;background:linear-gradient(90deg,var(--accent),#d97706,transparent)}.featured-post:hover{border-color:rgba(180,83,9,0.25);transform:translateY(-2px);box-shadow:0 16px 48px rgba(0,0,0,0.08)}.featured-label{font-family:var(--fd);font-size:0.6rem;letter-spacing:0.14em;text-transform:uppercase;color:var(--accent);margin-bottom:0.75rem}.featured-title{font-family:var(--fd);font-size:1.2rem;font-weight:800;line-height:1.25;margin-bottom:0.5rem}.featured-excerpt{font-family:var(--fd);font-size:0.82rem;color:var(--text2);line-height:1.6}.featured-meta{font-family:var(--fd);font-size:0.68rem;color:var(--text3);margin-top:1rem;padding-top:0.75rem;border-top:1px solid var(--border);display:flex;justify-content:space-between}

        .creations-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(320px,1fr));gap:1rem}
        .creation-card{background:var(--bg2);border:1px solid var(--border);border-radius:14px;padding:1.5rem;transition:all 0.3s;position:relative;overflow:hidden}.creation-card:hover{border-color:rgba(180,83,9,0.2);transform:translateY(-3px);box-shadow:0 12px 40px rgba(0,0,0,0.08)}.creation-header{display:flex;align-items:center;justify-content:space-between;margin-bottom:0.6rem;gap:0.5rem}.creation-title{font-family:var(--fd);font-size:1rem;font-weight:700;color:var(--text);display:flex;align-items:center;gap:6px}.creation-status{font-family:var(--fd);font-size:0.58rem;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;padding:0.2rem 0.55rem;border-radius:4px;flex-shrink:0}.creation-desc{font-family:var(--fd);font-size:0.82rem;color:var(--text2);line-height:1.6;margin-bottom:0.85rem}.creation-tech{display:flex;gap:0.35rem;flex-wrap:wrap;margin-bottom:0.5rem}.tech-tag{font-family:var(--fm);font-size:0.62rem;padding:0.15rem 0.5rem;border-radius:4px;background:var(--bg3);color:var(--text3);border:1px solid var(--border)}.creation-links{display:flex;gap:0.5rem;flex-wrap:wrap}.creation-link{font-family:var(--fd);font-size:0.7rem;font-weight:600;color:var(--accent2);text-decoration:none;display:flex;align-items:center;gap:3px}.creation-link:hover{opacity:0.7}.creation-media{display:flex;gap:6px;margin-top:0.75rem;flex-wrap:wrap}.creation-media img{width:56px;height:56px;object-fit:cover;border-radius:6px;border:1px solid var(--border2)}.creation-actions{position:absolute;top:10px;right:10px;display:flex;gap:4px;opacity:0;transition:opacity 0.2s;z-index:2}.creation-card:hover .creation-actions{opacity:1}

        .talk-card{background:var(--bg2);border:1px solid var(--border);border-radius:14px;padding:1.5rem;margin-bottom:0.75rem;transition:all 0.3s;position:relative}.talk-card:hover{border-color:rgba(180,83,9,0.2);transform:translateX(4px);box-shadow:0 8px 32px rgba(0,0,0,0.06)}.talk-top{display:flex;align-items:center;gap:0.75rem;margin-bottom:0.6rem}.talk-icon{font-size:1.4rem;width:44px;height:44px;display:flex;align-items:center;justify-content:center;background:linear-gradient(135deg,var(--bg3),rgba(79,156,249,0.08));border-radius:10px;flex-shrink:0;border:1px solid var(--border)}.talk-type{font-family:var(--fd);font-size:0.6rem;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:var(--accent)}.talk-title{font-family:var(--fd);font-size:1rem;font-weight:700;color:var(--text);line-height:1.3;display:flex;align-items:center;gap:6px}.talk-show{font-family:var(--fd);font-size:0.72rem;color:var(--text3);margin-top:1px}.talk-desc{font-family:var(--fd);font-size:0.82rem;color:var(--text2);line-height:1.6;margin-bottom:0.75rem}.talk-footer{display:flex;gap:1rem;font-family:var(--fd);font-size:0.68rem;color:var(--text3);align-items:center}.talk-play{font-family:var(--fd);font-size:0.7rem;font-weight:700;color:var(--accent2);cursor:pointer;background:none;border:none;display:flex;align-items:center;gap:4px;margin-left:auto}.talk-play:hover{opacity:0.7}.talk-actions{position:absolute;top:10px;right:10px;display:flex;gap:4px;opacity:0;transition:opacity 0.2s}.talk-card:hover .talk-actions{opacity:1}

        .chip{font-family:var(--fd);font-size:0.6rem;font-weight:700;letter-spacing:0.07em;text-transform:uppercase;padding:0.18rem 0.55rem;border-radius:4px}
        .item-actions-btn{font-family:var(--fd);font-size:0.6rem;font-weight:600;background:var(--bg3);color:var(--text2);border:1px solid var(--border2);border-radius:4px;padding:0.2rem 0.45rem;cursor:pointer;transition:all 0.12s}.item-actions-btn:hover{color:var(--text)}.item-actions-btn.del{color:var(--red);border-color:rgba(248,113,113,0.2)}.item-actions-btn.pin-on{color:var(--accent);border-color:rgba(79,156,249,0.3);background:var(--accent-dim)}
        .share-compact{display:flex;gap:3px;align-items:center}.share-btn{display:flex;align-items:center;justify-content:center;width:26px;height:26px;border-radius:5px;background:var(--bg3);border:1px solid var(--border2);color:var(--text3);cursor:pointer;transition:all 0.15s;text-decoration:none;font-size:0.65rem;padding:0}.share-btn:hover{color:var(--accent2);border-color:rgba(79,156,249,0.4);background:var(--accent-dim)}
        .share-row{display:flex;gap:5px;align-items:center}.share-btn-full{display:flex;align-items:center;gap:4px;font-family:var(--fd);font-size:0.7rem;font-weight:600;padding:0.3rem 0.7rem;border-radius:6px;background:var(--bg3);border:1px solid var(--border2);color:var(--text2);cursor:pointer;transition:all 0.15s;text-decoration:none;white-space:nowrap}.share-btn-full:hover{color:var(--accent2);border-color:rgba(79,156,249,0.4);background:var(--accent-dim)}

        .read-progress{position:fixed;top:64px;left:0;height:2px;background:linear-gradient(90deg,var(--accent),#667eea,var(--accent2));z-index:150;box-shadow:0 0 12px var(--accent);transition:width 0.08s linear}.art-hero{background:var(--bg2);border-bottom:1px solid var(--border);padding:3rem 2rem 2.5rem}.art-hero-inner{max-width:760px;margin:0 auto}.art-title{font-family:var(--fd);font-size:clamp(1.5rem,4vw,2.2rem);font-weight:800;letter-spacing:-0.025em;line-height:1.2;margin-bottom:1rem}.art-info-row{display:flex;align-items:center;gap:0.9rem;flex-wrap:wrap}.art-info{font-family:var(--fd);font-size:0.75rem;color:var(--text3)}.art-sep{width:1px;height:12px;background:var(--border2)}.art-actions{margin-left:auto;display:flex;gap:6px}.art-layout{max-width:960px;margin:0 auto;padding:3rem 2rem 6rem;display:grid;gap:3rem}
        .back-btn{background:none;border:none;color:var(--text3);font-family:var(--fd);font-size:0.75rem;cursor:pointer;display:flex;align-items:center;gap:5px;margin-bottom:1.75rem;padding:0;transition:color 0.15s}.back-btn:hover{color:var(--accent2)}
        .btn-sm-ghost{font-family:var(--fd);font-size:0.72rem;font-weight:600;background:var(--bg3);color:var(--text2);border:1px solid var(--border2);border-radius:6px;padding:0.3rem 0.75rem;cursor:pointer;transition:all 0.15s}.btn-sm-ghost:hover{color:var(--text)}
        .btn-sm-danger{font-family:var(--fd);font-size:0.72rem;font-weight:600;background:rgba(248,113,113,0.08);color:var(--red);border:1px solid rgba(248,113,113,0.18);border-radius:6px;padding:0.3rem 0.75rem;cursor:pointer}
        .toc{position:sticky;top:80px}.toc-label{font-family:var(--fd);font-size:0.58rem;letter-spacing:0.14em;text-transform:uppercase;color:var(--text3);margin-bottom:0.6rem}.toc-nav{display:flex;flex-direction:column;gap:0.15rem}.toc-link{font-family:var(--fd);font-size:0.75rem;color:var(--text3);text-decoration:none;padding:0.2rem 0.5rem;border-left:2px solid var(--border2);transition:all 0.15s;display:block}.toc-link:hover{color:var(--text)}.toc-link.active{color:var(--accent2);border-left-color:var(--accent)}
        .related-section{margin-top:3.5rem;padding-top:2rem;border-top:1px solid var(--border)}.related-label{font-family:var(--fd);font-size:0.6rem;letter-spacing:0.14em;text-transform:uppercase;color:var(--text3);margin-bottom:1rem}.related-card{display:flex;gap:1rem;padding:0.9rem;background:var(--bg2);border:1px solid var(--border);border-radius:8px;cursor:pointer;transition:all 0.2s;margin-bottom:0.5rem}.related-card:hover{border-color:rgba(79,156,249,0.25);transform:translateX(4px)}
        .md{font-family:var(--fb);font-size:1.05rem;line-height:1.85;color:var(--text2)}.md h1{font-family:var(--fd);font-size:1.8rem;font-weight:800;color:var(--text);margin:2.5rem 0 1rem;letter-spacing:-0.025em;line-height:1.2}.md h2{font-family:var(--fd);font-size:1.3rem;font-weight:700;color:var(--text);margin:2.25rem 0 0.75rem;padding-left:1rem;border-left:2px solid var(--accent)}.md h3{font-family:var(--fd);font-size:1.05rem;font-weight:700;color:var(--text);margin:1.75rem 0 0.5rem}.md p{margin-bottom:1.25rem}.md strong{color:var(--text);font-weight:600}.md em{color:var(--text2);font-style:italic}.md blockquote{margin:1.75rem 0;padding:1rem 1.5rem;background:var(--bg2);border-left:3px solid var(--accent);border-radius:0 8px 8px 0;color:var(--text2);font-style:italic}.md ul,.md ol{padding-left:1.5rem;margin-bottom:1.25rem}.md li{margin-bottom:0.4rem}.md li::marker{color:var(--accent)}.md code{font-family:var(--fm);background:var(--bg3);color:var(--accent2);padding:0.12em 0.4em;border-radius:4px;font-size:0.875em;border:1px solid var(--border2)}.md pre{background:var(--bg3);border:1px solid var(--border2);border-radius:10px;padding:1.5rem;overflow-x:auto;margin:1.75rem 0;position:relative}.md pre code{background:none;border:none;color:var(--text);padding:0;font-size:0.875rem;line-height:1.7}.md hr{border:none;margin:2.5rem 0;height:1px;background:var(--border)}.md img{max-width:100%;border-radius:8px;margin:1.5rem 0}
        .copy-btn{position:absolute;top:8px;right:8px;font-family:var(--fd);font-size:0.62rem;font-weight:700;background:var(--bg3);border:1px solid var(--border2);color:var(--text3);border-radius:5px;padding:2px 7px;cursor:pointer}

        .ed-wrap{display:flex;flex-direction:column;height:calc(100vh - 64px)}.ed-bar{background:var(--bg2);border-bottom:1px solid var(--border);padding:0.7rem 1.5rem;display:flex;gap:0.75rem;align-items:center;flex-wrap:wrap}.ed-title{background:none;border:none;outline:none;font-family:var(--fd);font-size:1rem;font-weight:700;color:var(--text);flex:1;min-width:140px}.ed-title::placeholder{color:var(--text3)}.ed-sep{width:1px;height:18px;background:var(--border2);flex-shrink:0}.ed-tags{background:none;border:none;outline:none;font-family:var(--fd);font-size:0.78rem;color:var(--text2);width:150px}.ed-tags::placeholder{color:var(--text3)}
        .ed-lang{background:var(--bg3);border:1px solid var(--border2);border-radius:5px;color:var(--text);font-family:var(--fd);font-size:0.72rem;font-weight:700;padding:0.25rem 0.4rem;outline:none;cursor:pointer;appearance:none;width:48px;text-align:center}
        .tabs{display:flex;background:var(--bg3);border:1px solid var(--border);border-radius:7px;overflow:hidden}.tbtn{padding:0.28rem 0.75rem;font-family:var(--fd);font-size:0.65rem;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;background:none;border:none;color:var(--text3);cursor:pointer;transition:all 0.15s}.tbtn.on{background:var(--accent);color:#fff}
        .ed-toolbar{background:var(--bg3);border-bottom:1px solid var(--border);padding:0.45rem 1.5rem;display:flex;align-items:center;gap:8px;flex-wrap:wrap}.tb-btn{background:transparent;border:1px solid var(--border);border-radius:4px;color:var(--text2);padding:0.25rem 0.5rem;cursor:pointer;transition:all 0.12s;min-width:28px;text-align:center}.tb-btn:hover{background:var(--bg2);color:var(--text);border-color:var(--border2)}
        .ed-body{flex:1;display:flex;overflow:hidden}.wpane,.ppane{flex:1;display:flex;flex-direction:column;overflow:hidden}.pane-lbl{background:var(--bg2);border-bottom:1px solid var(--border);padding:0.25rem 1.25rem;font-family:var(--fd);font-size:0.58rem;letter-spacing:0.14em;text-transform:uppercase;color:var(--text3)}.wpane{border-right:1px solid var(--border)}textarea{flex:1;background:var(--bg);color:var(--text);border:none;outline:none;resize:none;font-family:var(--fm);font-size:0.875rem;line-height:1.75;padding:1.5rem;tab-size:2}.pscroll{flex:1;overflow-y:auto;padding:2rem 2.5rem}
        .ed-foot{background:var(--bg2);border-top:1px solid var(--border);padding:0.6rem 1.5rem;display:flex;justify-content:space-between;align-items:center}.save-ind{font-family:var(--fd);font-size:0.7rem;display:flex;align-items:center;gap:5px}.save-dot{width:6px;height:6px;border-radius:50%}.si-idle{color:var(--text3)}.si-idle .save-dot{background:var(--text3)}.si-saving{color:var(--orange)}.si-saving .save-dot{background:var(--orange);animation:pulse 0.8s infinite}.si-saved{color:var(--green)}.si-saved .save-dot{background:var(--green)}@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.3}}
        .btn-pub{font-family:var(--fd);font-size:0.78rem;font-weight:700;background:linear-gradient(135deg,var(--accent),#667eea);color:#fff;border:none;border-radius:8px;padding:0.45rem 1.3rem;cursor:pointer;transition:all 0.2s;box-shadow:0 0 16px var(--accent-glow)}.btn-pub:hover{transform:translateY(-1px);box-shadow:0 4px 24px var(--accent-glow)}
        .mo{position:fixed;inset:0;background:rgba(0,0,0,0.3);z-index:1000;display:flex;align-items:center;justify-content:center;animation:fadeIn 0.2s;padding:1rem;overflow-y:auto;backdrop-filter:blur(4px)}.mo-box{background:var(--bg);border:1px solid var(--border2);border-radius:16px;padding:2rem;max-width:520px;width:100%;box-shadow:0 24px 80px rgba(0,0,0,0.12);max-height:90vh;overflow-y:auto}.mo-title{font-family:var(--fd);font-size:1.05rem;font-weight:700;text-align:center;margin-bottom:0.75rem}.mo-desc{font-family:var(--fd);font-size:0.8rem;color:var(--text2);text-align:center;margin-bottom:1.5rem}.mo-cancel{flex:1;font-family:var(--fd);font-weight:600;font-size:0.8rem;background:var(--bg3);color:var(--text2);border:1px solid var(--border2);border-radius:8px;padding:0.6rem;cursor:pointer}.mo-cancel:hover{color:var(--text)}.mo-delete{flex:1;font-family:var(--fd);font-weight:700;font-size:0.8rem;background:rgba(248,113,113,0.15);color:var(--red);border:1px solid rgba(248,113,113,0.3);border-radius:8px;padding:0.6rem;cursor:pointer}.mo-save{flex:1;font-family:var(--fd);font-weight:700;font-size:0.8rem;background:linear-gradient(135deg,var(--accent),#667eea);color:#fff;border:none;border-radius:8px;padding:0.6rem;cursor:pointer;box-shadow:0 0 12px var(--accent-glow)}.mo-save:hover{box-shadow:0 4px 20px var(--accent-glow)}@keyframes fadeIn{from{opacity:0}to{opacity:1}}
        .form-grid{display:flex;flex-direction:column;gap:0.85rem}.field-label{font-family:var(--fd);font-size:0.68rem;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:var(--text3);margin-bottom:0.3rem}.form-input{width:100%;background:var(--bg);border:1px solid var(--border2);border-radius:8px;padding:0.5rem 0.75rem;color:var(--text);font-family:var(--fd);font-size:0.82rem;outline:none;transition:border-color 0.2s}.form-input:focus{border-color:rgba(79,156,249,0.5);box-shadow:0 0 0 3px rgba(79,156,249,0.08)}.form-input::placeholder{color:var(--text3)}select.form-input{appearance:none;cursor:pointer}.form-ta{resize:vertical;min-height:60px;font-family:var(--fd)}.form-rm{background:none;border:none;color:var(--text3);cursor:pointer;font-size:0.8rem;padding:0.3rem}.form-rm:hover{color:var(--red)}.form-add-btn{font-family:var(--fd);font-size:0.72rem;font-weight:600;color:var(--accent2);background:none;border:1px dashed var(--border2);border-radius:6px;padding:0.35rem;cursor:pointer;width:100%}.form-add-btn:hover{border-color:var(--accent);background:var(--accent-dim)}
        .upload-btn{font-family:var(--fd);font-size:0.68rem;font-weight:600;color:var(--text2);background:var(--bg3);border:1px dashed var(--border2);border-radius:6px;padding:0.35rem 0.65rem;cursor:pointer;width:56px;height:56px;display:flex;align-items:center;justify-content:center;text-align:center;line-height:1.2}.upload-btn:hover{border-color:var(--accent);color:var(--accent2)}
        .contact-footer{border-top:1px solid var(--border);margin-top:3rem;padding:4rem 2rem}.contact-inner{max-width:760px;margin:0 auto;text-align:center}.contact-label{font-family:var(--fd);font-size:0.6rem;font-weight:700;letter-spacing:0.18em;text-transform:uppercase;color:var(--accent);margin-bottom:0.75rem}.contact-title{font-family:var(--fd);font-size:1.6rem;font-weight:800;letter-spacing:-0.02em;margin-bottom:0.5rem}.contact-sub{font-family:var(--fd);font-size:0.85rem;color:var(--text2);margin-bottom:1.5rem}.contact-link{font-family:var(--fd);font-size:0.88rem;font-weight:700;color:var(--accent2);text-decoration:none;display:inline-flex;align-items:center;gap:6px;padding:0.65rem 1.5rem;border:1px solid rgba(79,156,249,0.3);border-radius:10px;transition:all 0.25s;background:var(--accent-dim)}.contact-link:hover{background:rgba(79,156,249,0.18);transform:translateY(-2px);box-shadow:0 8px 24px var(--accent-glow)}
        .toast{position:fixed;bottom:2rem;right:2rem;z-index:9999;font-family:var(--fd);font-size:0.8rem;font-weight:700;padding:0.8rem 1.2rem;border-radius:10px;display:flex;align-items:center;gap:7px;animation:tin 0.25s ease;backdrop-filter:blur(12px)}.ts{background:rgba(52,211,153,0.12);border:1px solid rgba(52,211,153,0.25);color:var(--green)}.te{background:rgba(248,113,113,0.12);border:1px solid rgba(248,113,113,0.25);color:var(--red)}@keyframes tin{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
        .empty{text-align:center;padding:4rem 2rem}.empty h3{font-family:var(--fd);font-size:1.05rem;font-weight:700;color:var(--text2);margin-bottom:0.4rem}.empty p{font-family:var(--fd);font-size:0.82rem;color:var(--text3)}
        @media(max-width:768px){.creations-grid{grid-template-columns:1fr}}
        @media(max-width:600px){.nav-dot{display:none}.nav-links{gap:0.05rem;font-size:0.7rem}.post-date{display:none}.art-layout{grid-template-columns:1fr!important}.toc{display:none}.ed-body{flex-direction:column}.wpane{border-right:none;border-bottom:1px solid var(--border)}.filter-row{flex-direction:column;gap:0.5rem}.lang-filters{margin-left:0}}
      `}</style>

      {/* NAV */}
      <nav className={`nav ${scrolled?"stuck":""}`}><div className="nav-inner">
        <button className="logo" onClick={()=>navTo("home")}><div className="logo-mark">2S</div>2snde</button>
        <div className="nav-links">
          <button className={`nav-link ${section==="home"?"active":""}`} onClick={()=>navTo("home")}>{t.about}</button>
          <span className="nav-dot">·</span>
          <button className={`nav-link ${section==="posts"&&view!=="editor"?"active":""}`} onClick={()=>navTo("posts")}>{t.posts}</button>
          <span className="nav-dot">·</span>
          <button className={`nav-link ${section==="creations"?"active":""}`} onClick={()=>navTo("creations")}>{t.creations}</button>
          <span className="nav-dot">·</span>
          <button className={`nav-link ${section==="talks"?"active":""}`} onClick={()=>navTo("talks")}>{t.talks}</button>
        </div>
        <div className="nav-right">
          <button className="lang-toggle" onClick={toggleLang}>{lang==="FR"?"🇬🇧 EN":"🇫🇷 FR"}</button>
          {section==="posts"&&view==="list"&&<button className="btn-new" onClick={openNew}>+ {t.newPost}</button>}
          {section==="creations"&&view==="list"&&<button className="btn-new" onClick={()=>{setEditItem(null);setShowForm("creation");}}>+ {t.newProject}</button>}
          {section==="talks"&&view==="list"&&<button className="btn-new" onClick={()=>{setEditItem(null);setShowForm("talk");}}>+ {t.newTalk}</button>}
          {view==="editor"&&<button className="btn-cancel" onClick={()=>setView("list")}>✕ {t.cancel}</button>}
        </div>
      </div></nav>

      {/* ══ HOME / LANDING ══ */}
      {section==="home"&&view==="list"&&(<div className="landing">
        <Reveal><div className="landing-hero">
          <div className="landing-badge">{t.heroEye}</div>
          <h1 className="landing-name">{t.heroMainTitle}</h1>
          <p className="landing-role">{t.heroMainSub}</p>
          <p className="landing-intro">{t.heroIntro}</p>
        </div></Reveal>

        <div className="landing-divider"/>

        {/* Pinned Posts (up to 2) */}
        <Reveal delay={0.05}><div className="landing-section">
          <div className="landing-section-header">
            <div className="landing-section-title">{t.posts}</div>
            <button className="landing-see-all" onClick={()=>navTo("posts")}>{t.seeAll}</button>
          </div>
          {pinnedArticles.length>0 ? (
            <div style={{display:"flex",flexDirection:"column",gap:"0.75rem"}}>
              {pinnedArticles.map((pa,idx)=>(
                <div key={pa.id} className="landing-pin-card" onClick={()=>{setSection("posts");setCurrent(pa);setView("article");}}>
                  <div className="landing-pin-label">📌 {t.pinned}</div>
                  <div style={{display:"flex",gap:"0.3rem",marginBottom:"0.5rem",flexWrap:"wrap"}}>{pa.tags.map((x,i)=><span key={x} className="chip" style={cs(i)}>{x}</span>)}<LangChip lang={pa.lang}/></div>
                  <div className="landing-pin-title">{pa.title}</div>
                  <div className="landing-pin-excerpt">{exc(pa.content)}…</div>
                  <div className="landing-pin-meta"><span>{fDate(pa.date,lang)}</span><span>·</span><span>{rt(pa.content)} {t.readMin}</span></div>
                </div>
              ))}
            </div>
          ) : <div className="landing-empty">{lang==="FR"?"Épinglez jusqu'à 2 posts pour les mettre en avant ici.":"Pin up to 2 posts to feature them here."}</div>}
        </div></Reveal>

        {/* Pinned Talk (1) */}
        <Reveal delay={0.1}><div className="landing-section">
          <div className="landing-section-header">
            <div className="landing-section-title">{t.talks}</div>
            <button className="landing-see-all" onClick={()=>navTo("talks")}>{t.seeAll}</button>
          </div>
          {pinnedTalk ? (
            <div className="landing-pin-card" onClick={()=>navTo("talks")}>
              <div className="landing-pin-label">📌 {t.pinned}</div>
              <div style={{display:"flex",alignItems:"center",gap:"0.5rem",marginBottom:"0.4rem"}}><span style={{fontSize:"1.1rem"}}>{TI[pinnedTalk.type]||"🎤"}</span><span className="landing-pin-title" style={{marginBottom:0}}>{pinnedTalk.title}</span><LangChip lang={pinnedTalk.lang}/></div>
              <div className="landing-pin-excerpt">{pinnedTalk.description}</div>
              <div className="landing-pin-meta"><span>{pinnedTalk.show}</span><span>·</span><span>{pinnedTalk.duration}</span><span>·</span><span>{fDate(pinnedTalk.date,lang)}</span></div>
            </div>
          ) : <div className="landing-empty">{lang==="FR"?"Épinglez un talk pour le mettre en avant ici.":"Pin a talk to feature it here."}</div>}
        </div></Reveal>

        <ContactFooter t={t}/>
      </div>)}

      {/* ══ POSTS ══ */}
      {section==="posts"&&view==="list"&&(<><div className="page-wrap">
        <Reveal><div className="site-intro"><div className="intro-eyebrow">{t.heroEye}</div><h1 className="intro-title">{t.heroTitle[0]}<em>{t.heroTitle[1]}</em></h1><p className="intro-sub">{t.heroSub}</p></div></Reveal>
        <Reveal delay={0.1}><div className="filter-row"><div className="filters"><button className={`ftag ${!filterTag?"on":""}`} onClick={()=>setFilterTag(null)}>{t.all} <span className="ftag-count">{articles.length}</span></button>{allTags.map(x=><button key={x} className={`ftag ${filterTag===x?"on":""}`} onClick={()=>setFilterTag(filterTag===x?null:x)}>{x} <span className="ftag-count">{tagCounts[x]}</span></button>)}</div><LangFilters/></div></Reveal>
        {pinnedPost&&!filterTag&&!filterLang&&(<Reveal delay={0.15}><div className="featured-post" onClick={()=>{setCurrent(pinnedPost);setView("article");}}><div className="featured-label">★ {t.featured}</div><div style={{display:"flex",gap:"0.4rem",marginBottom:"0.6rem",flexWrap:"wrap"}}>{pinnedPost.tags.map((x,i)=><span key={x} className="chip" style={cs(i)}>{x}</span>)}<LangChip lang={pinnedPost.lang}/></div><div className="featured-title">{pinnedPost.title}</div><div className="featured-excerpt">{exc(pinnedPost.content)}…</div><div className="featured-meta"><span>{fDate(pinnedPost.date,lang)} · {rt(pinnedPost.content)} {t.readMin}</span><span style={{color:"var(--accent2)",fontWeight:700}}>{t.read} →</span></div></div></Reveal>)}
        {filtered.length===0?<div className="empty"><h3>{t.noResults}</h3></div>:(<div className="post-list">{restPosts.map((a,i)=>(<Reveal key={a.id} delay={0.05*i}><div className="post-item" onClick={()=>{setCurrent(a);setView("article");}}><span className="post-date">{fDate(a.date,lang)}</span><LangChip lang={a.lang}/><span className="post-title">{a.title}</span><button className={`post-pin ${a.pinned?"is-pinned":""}`} onClick={e=>togglePinPost(a.id,e)} title={a.pinned?t.unpin:t.pin}>📌</button></div></Reveal>))}</div>)}
      </div><ContactFooter t={t}/></>)}

      {section==="posts"&&view==="article"&&current&&<ArtView article={current} all={articles} onBack={()=>setView("list")} onEdit={()=>openEdit(current)} onDelete={()=>delPost(current.id)} lang={lang}/>}

      {/* ══ EDITOR ══ */}
      {view==="editor"&&(<div className="ed-wrap">
        <div className="ed-bar"><input className="ed-title" placeholder={t.title+"..."} value={draft.title} onChange={e=>setDraft(d=>({...d,title:e.target.value}))}/><div className="ed-sep"/><input className="ed-tags" placeholder="Tags: Sales, AI..." value={draft.tags} onChange={e=>setDraft(d=>({...d,tags:e.target.value}))}/><div className="ed-sep"/><select className="ed-lang" value={draft.lang} onChange={e=>setDraft(d=>({...d,lang:e.target.value}))}><option value="FR">🇫🇷 FR</option><option value="EN">🇬🇧 EN</option></select><div style={{marginLeft:"auto"}}><div className="tabs">{[[" write",t.write],["split",t.split],["preview",t.previewTab]].map(([v,l])=><button key={v} className={`tbtn ${tab===v.trim()?"on":""}`} onClick={()=>setTab(v.trim())}>{l}</button>)}</div></div></div>
        {tab!=="preview"&&<div className="ed-toolbar"><Toolbar taRef={taRef} draft={draft} setDraft={setDraft}/><div style={{width:1,height:18,background:"var(--border2)",margin:"0 4px"}}/><ImageUploader images={images} setImages={setImages} t={t}/></div>}
        <div className="ed-body">{tab!=="preview"&&<div className="wpane"><div className="pane-lbl">{t.markdown}</div><textarea ref={taRef} value={draft.content} onChange={e=>setDraft(d=>({...d,content:e.target.value}))} spellCheck={false}/></div>}{tab!=="write"&&<div className="ppane"><div className="pane-lbl">{t.preview}</div><div className="pscroll"><div className="md" dangerouslySetInnerHTML={{__html:parseMd(draft.content||"_..._")}}/>{images.length>0&&<div style={{display:"flex",gap:8,flexWrap:"wrap",marginTop:"1rem"}}>{images.map((img,i)=><img key={i} src={img.data} alt="" style={{maxWidth:200,borderRadius:8,border:"1px solid var(--border2)"}}/>)}</div>}</div></div>}</div>
        <div className="ed-foot"><div style={{display:"flex",alignItems:"center",gap:"1rem"}}><div className={`save-ind si-${saveStatus}`}><div className="save-dot"/>{saveStatus==="idle"?t.draft:saveStatus==="saving"?t.saving:t.saved}</div><span style={{fontFamily:"var(--fd)",fontSize:"0.7rem",color:"var(--text3)"}}>{wc} {t.words} · {rt(draft.content)} {t.readMin}</span></div><div style={{display:"flex",gap:"0.75rem",alignItems:"center"}}><span style={{fontFamily:"var(--fm)",fontSize:"0.58rem",color:"var(--text3)",background:"var(--bg3)",border:"1px solid var(--border2)",borderRadius:3,padding:"1px 5px"}}>⌘S</span><button className="btn-pub" onClick={savePost}>{editId?t.update:t.publish}</button></div></div>
      </div>)}

      {/* ══ CREATIONS ══ */}
      {section==="creations"&&view==="list"&&(<><div className="page-wrap" style={{maxWidth:900}}>
        <Reveal><div className="site-intro"><div className="intro-eyebrow">{t.creationsEye}</div><h1 className="intro-title">{t.creationsTitle[0]}<em>{t.creationsTitle[1]}</em></h1><p className="intro-sub">{t.creationsSub}</p></div></Reveal>
        <Reveal delay={0.1}><div className="filter-row"><div className="filters">{allCats.length>1&&<><button className={`ftag ${!filterCat?"on":""}`} onClick={()=>setFilterCat(null)}>{t.all}</button>{allCats.map(c=><button key={c} className={`ftag ${filterCat===c?"on":""}`} onClick={()=>setFilterCat(filterCat===c?null:c)}>{c}</button>)}</>}</div><LangFilters/></div></Reveal>
        <div className="creations-grid">{filteredC.map((c,i)=>{const st=SS[c.status]||SS.wip;return(<Reveal key={c.id} delay={0.08*i}><div className="creation-card"><div className="creation-actions"><button className={`item-actions-btn ${c.pinned?"pin-on":""}`} onClick={()=>togglePinCreation(c.id)} title={c.pinned?t.unpin:t.pin}>📌</button><ShareButtons title={c.title} slug={`creations/${c.id}`} compact/><button className="item-actions-btn" onClick={()=>{setEditItem(c);setShowForm("creation");}}>✏️</button><button className="item-actions-btn del" onClick={()=>delCreation(c.id)}>🗑</button></div><div className="creation-header"><div className="creation-title">{c.title} <LangChip lang={c.lang}/></div><span className="creation-status" style={{background:st.bg,color:st.c,border:`1px solid ${st.bd}`}}>{t[c.status]||c.status}</span></div><div className="creation-desc">{c.description}</div><div className="creation-tech">{(c.tech||[]).map(x=><span key={x} className="tech-tag">{x}</span>)}</div>{c.links?.length>0&&<div className="creation-links">{c.links.map((l,j)=><a key={j} href={l.url} target="_blank" rel="noopener noreferrer" className="creation-link">🔗 {l.label}</a>)}</div>}{c.media?.length>0&&<div className="creation-media">{c.media.map((m,j)=><img key={j} src={m.data} alt=""/>)}</div>}</div></Reveal>);})}</div>
      </div><ContactFooter t={t}/></>)}

      {/* ══ TALKS ══ */}
      {section==="talks"&&view==="list"&&(<><div className="page-wrap">
        <Reveal><div className="site-intro"><div className="intro-eyebrow">{t.talksEye}</div><h1 className="intro-title">{t.talksTitle[0]}<em>{t.talksTitle[1]}</em></h1><p className="intro-sub">{t.talksSub}</p></div></Reveal>
        <Reveal delay={0.1}><div className="filter-row"><div/><LangFilters/></div></Reveal>
        {filteredT.map((x,i)=>(<Reveal key={x.id} delay={0.08*i}><div className="talk-card"><div className="talk-actions"><button className={`item-actions-btn ${x.pinned?"pin-on":""}`} onClick={()=>togglePinTalk(x.id)} title={x.pinned?t.unpin:t.pin}>📌</button><ShareButtons title={x.title} slug={`talks/${x.id}`} compact/><button className="item-actions-btn" onClick={()=>{setEditItem(x);setShowForm("talk");}}>✏️</button><button className="item-actions-btn del" onClick={()=>delTalk(x.id)}>🗑</button></div><div className="talk-top"><div className="talk-icon">{TI[x.type]||"🎤"}</div><div style={{flex:1}}><div className="talk-type">{x.type}</div><div className="talk-title">{x.title} <LangChip lang={x.lang}/></div><div className="talk-show">{x.show}</div></div></div><div className="talk-desc">{x.description}</div><div className="talk-footer"><span>{fDate(x.date,lang)}</span><span>{x.duration}</span>{x.audioUrl&&<button className="talk-play" onClick={()=>{if(x.audioUrl.startsWith("data:")){const w=window.open();w.document.write(`<audio controls autoplay src="${x.audioUrl}"></audio>`);}else window.open(x.audioUrl,"_blank");}}>▶ {t.listen}</button>}</div></div></Reveal>))}
      </div><ContactFooter t={t}/></>)}

      {/* FORMS */}
      {showForm==="creation"&&<CreationForm initial={editItem?{...editItem,tech:editItem.tech?.join(", ")||""}:null} onSave={saveCreation} onCancel={()=>{setShowForm(null);setEditItem(null);}} t={t}/>}
      {showForm==="talk"&&<TalkForm initial={editItem} onSave={saveTalk} onCancel={()=>{setShowForm(null);setEditItem(null);}} t={t}/>}
      {toast&&<div className={`toast ${toast.type==="success"?"ts":"te"}`}>{toast.type==="success"?"✓":"⚠"} {toast.m}</div>}
    </>
  );
}
