
"use strict";
(() => {
const D=window.HAB_DATA;if(!D){document.getElementById("app").textContent="Banque de questions indisponible. Actualisez la page.";return}
const P=Object.fromEntries(D.profiles.map(p=>[p.id,p])), Q=Object.fromEntries(D.bank.map(q=>[q.id,q])), A=document.getElementById("app"), $=id=>document.getElementById(id);
const MODE=document.body.dataset.mode, VERSION=D.version, PREFIX="BLACKOUT-HAB-V5:", KEY="blackout-hab-v5-theory-"+VERSION;
const themes={risk:"Dangers et protections",zone:"Zones et distances",limit:"Limites du symbole"};
const marks={ok:"Sans erreur",minor:"Erreur mineure",major:"Erreur majeure",unseen:"Non observé"};
const ops={favorable:"Favorable",defavorable:"Défavorable",incomplet:"À compléter"};
const escape=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const E=escape, today=()=>new Date().toLocaleDateString("sv-SE"), dateFmt=d=>d?String(d).slice(0,10).split("-").reverse().join("/"):"—";
const displayTime=n=>String(Math.floor(Math.max(0,n)/60)).padStart(2,"0")+":"+String(Math.max(0,n)%60).padStart(2,"0");
const safeName=s=>String(s).normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/[^a-zA-Z0-9_-]+/g,"_").replace(/^_+|_+$/g,"").slice(0,80)||"dossier";
const normal=s=>String(s??"").normalize("NFKC").trim().replace(/\s+/g," ").toLowerCase();
const shuffle=a=>{a=[...a];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};
const uniq=a=>new Set(a).size===a.length;
const get=id=>P[id]?.name||id;
const idString=id=>String(id).replace(/[^a-zA-Z0-9_-]/g,"_");
const pilot="Version pilote : banque et grilles à faire valider par le référent habilitation de l’organisme avant utilisation certificative. Pas de travaux sous tension. Le titre d’habilitation est délivré par l’employeur.";
const footer=()=>'<footer>BLACKOUT HABILITATION V5 · Traitement local dans le navigateur · <a target="_blank" rel="noreferrer" href="https://www.inrs.fr/risques/electriques/habilitation-electrique.html">INRS — Habilitation électrique</a> · <a target="_blank" rel="noreferrer" href="https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000033769527">Code du travail R. 4544-10</a></footer>';
function hero(label,title,desc){return '<div class="hero"><div class="eyebrow">'+E(label)+'</div><h1>'+E(title)+'</h1><p>'+E(desc)+'</p></div>'}
function field(key,label,value="",type="text",required=false){return '<label>'+E(label)+(required?' *':'')+'<input '+(required?"required ":"")+'id="'+E(key)+'" type="'+E(type)+'" maxlength="150" value="'+E(value)+'"></label>'}
function profilePicker(selected, allowed=null, disabled=false){return ["BT","HT","BT/HT"].map(domain=>'<div class="group"><h3>'+E(domain==="BT"?"Basse tension (BT)":domain==="HT"?"Haute tension (HT)":"Canalisations enterrées")+'</h3><div class="profiles">'+D.profiles.filter(p=>p.domain===domain&&(!allowed||allowed.includes(p.id))).map(p=>'<label class="profile"><input type="checkbox" name="profile" value="'+E(p.id)+'" '+(selected.includes(p.id)?"checked ":"")+(disabled?"disabled":"")+'><span><b>'+E(p.name)+'</b><small>'+E(p.role)+'</small></span></label>').join("")+'</div></div>').join("")}
function showError(msg){const el=$("error");if(el){el.textContent=String(msg);el.scrollIntoView({block:"nearest",behavior:"smooth"})}else alert(String(msg))}
function status(text,kind){return '<span class="status '+E(kind)+'">'+E(text)+'</span>'}
function chosen(){return [...A.querySelectorAll('input[name=profile]:checked')].map(i=>i.value)}
function makeExam(id){
 const pool=D.bank.filter(q=>q.profiles.includes(id));let ids=[];
 for(const k of ["risk","zone","limit"]){const a=shuffle(pool.filter(q=>q.theme===k));if(a.length<5)throw Error("Banque insuffisante pour "+get(id));ids.push(...a.slice(0,5).map(q=>q.id))}
 return {id,ids:shuffle(ids),answers:{},orders:{},start:Date.now(),end:Date.now()+P[id].minutes*60000,index:0};
}
function scoreExam(id,ids,answers,seconds=0){
 if(!P[id]||!Array.isArray(ids)||ids.length!==15||!uniq(ids)||ids.some(q=>!Q[q]||!Q[q].profiles.includes(id)))throw Error("Questions incompatibles avec "+get(id));
 if(Object.keys(themes).some(t=>ids.filter(q=>Q[q].theme===t).length!==5))throw Error("Répartition thématique invalide");
 if(!answers||typeof answers!=="object"||Array.isArray(answers)||Object.keys(answers).some(q=>!ids.includes(q)))throw Error("Réponses invalides");
 const detail=ids.map(idq=>{const q=Q[idq],selected=answers[idq]||[];
 if(!Array.isArray(selected)||!uniq(selected)||selected.some(i=>!Number.isInteger(i)||i<0||i>=q.options.length))throw Error("Réponse hors limites");
 const correct=q.options.map((o,i)=>o.correct?i:-1).filter(i=>i>=0);
 return {id:idq,ok:selected.length===correct.length&&correct.every(i=>selected.includes(i)),selected:[...selected],correct,theme:q.theme,critical:!!q.critical};
 });
 const good=detail.filter(x=>x.ok).length,total=detail.length,pct=Math.round(good*100/total),critical=detail.filter(x=>x.critical&&!x.ok).length,passed=good/total>=.7&&critical===0;
 return {id,good,total,pct,critical,passed,seconds:Math.max(0,Math.min(P[id].minutes*60,Math.round(Number(seconds)||0))),detail,themes:Object.fromEntries(Object.keys(themes).map(k=>[k,[detail.filter(q=>q.theme===k&&q.ok).length,5]]))};
}
function encodePacket(obj){const a=new TextEncoder().encode(JSON.stringify(obj));let s="";for(let i=0;i<a.length;i+=8192)s+=String.fromCharCode(...a.subarray(i,i+8192));return PREFIX+btoa(s)}
function decodePacket(s){if(!s||!s.startsWith(PREFIX))return null;if(s.length>300000)throw Error("Métadonnées trop volumineuses");const b=atob(s.slice(PREFIX.length));return JSON.parse(new TextDecoder("utf-8",{fatal:true}).decode(Uint8Array.from(b,c=>c.charCodeAt(0))))}
function validatePacket(o){
 if(!o||o.version!==VERSION||!o.identity||!Array.isArray(o.profiles)||!o.profiles.length||!uniq(o.profiles)||o.profiles.some(p=>!P[p])||typeof o.id!=="string"||typeof o.date!=="string"||!o.results||Object.keys(o.results).length!==o.profiles.length)throw Error("PDF V5 incompatible ou incomplet");
 for(const k of ["nom","prenom","groupe"])if(typeof o.identity[k]!=="string"||!o.identity[k].trim()||o.identity[k].length>150)throw Error("Identité incomplète");
 const results={};for(const p of o.profiles){const r=o.results[p];if(!r)throw Error("Résultat manquant");results[p]=scoreExam(p,r.ids,r.answers,r.seconds)}
 return {packet:o,results};
}
function requirePdf(){if(!window.PDFLib)throw Error("Le moteur PDF n’a pas pu charger. Vérifiez la connexion Internet et actualisez la page.");return window.PDFLib}
function normalizePDF(t){return String(t??"").replace(/[’‘]/g,"'").replace(/[“”]/g,'"').replace(/[–—−]/g,"-").replace(/…/g,"...").replace(/œ/g,"oe").replace(/Œ/g,"OE").replace(/\u202f/g," ").replace(/[^\x20-\x7e\xa0-\xff\n]/g," ")}
async function pdfBuilder(title,subtitle,reference){
 const {PDFDocument,StandardFonts,rgb}=requirePdf(),doc=await PDFDocument.create(),font=await doc.embedFont(StandardFonts.Helvetica),bold=await doc.embedFont(StandardFonts.HelveticaBold),ink=rgb(.08,.16,.23),teal=rgb(0,.43,.47),muted=rgb(.31,.39,.45),light=rgb(.93,.96,.97);
 let page,y,pageNumber=0;const W=595.28,H=841.89,M=44,usable=W-M*2;
 function newPage(){page=doc.addPage([W,H]);pageNumber++;page.drawRectangle({x:0,y:H-93,width:W,height:93,color:ink});page.drawText("BLACKOUT  /  HABILITATION ELECTRIQUE",{x:M,y:H-30,size:10,font:bold,color:rgb(.37,.86,.81)});page.drawText(normalizePDF(title),{x:M,y:H-54,size:17,font:bold,color:rgb(1,1,1)});page.drawText(normalizePDF(subtitle).slice(0,100),{x:M,y:H-74,size:9,font,color:rgb(.82,.92,.93)});page.drawRectangle({x:M,y:38,width:usable,height:.6,color:muted});page.drawText("V5 PILOTE - "+normalizePDF(reference).slice(0,62),{x:M,y:24,size:8,font,color:muted});page.drawText(String(pageNumber),{x:W-M-17,y:24,size:8,font,color:muted});y=H-117}
 function ensure(h){if(y-h<58)newPage()}
 function wrap(txt,f,size,max){const lines=[];for(const para of normalizePDF(txt).split("\n")){let line="";for(let word of para.split(/\s+/).filter(Boolean)){while(f.widthOfTextAtSize(word,size)>max){let cut=word.length-1;while(cut>1&&f.widthOfTextAtSize(word.slice(0,cut),size)>max)cut--;if(line){lines.push(line);line=""}lines.push(word.slice(0,cut));word=word.slice(cut)}const next=line?line+" "+word:word;if(f.widthOfTextAtSize(next,size)>max){if(line)lines.push(line);line=word}else line=next}lines.push(line||" ")}return lines}
 function text(txt,{size=10,weight=false,color=ink,indent=0,gap=6}={}){const f=weight?bold:font,lines=wrap(txt,f,size,usable-indent);for(const l of lines){ensure(size+6);page.drawText(l,{x:M+indent,y:y-size,size,font:f,color});y-=size+4}y-=gap}
 function heading(txt){ensure(48);page.drawRectangle({x:M,y:y-22,width:usable,height:24,color:light});page.drawText(normalizePDF(txt).slice(0,85),{x:M+8,y:y-15,size:11,font:bold,color:teal});y-=31}
 function section(txt){ensure(43);text(txt,{size:13,weight:true,color:teal,gap:5})}
 function space(h=8){ensure(h);y-=h}
 async function signature(label,name,signed){ensure(146);text(label,{weight:true,size:11,gap:3});text(name,{size:10,gap:3});const at=signed?new Date(signed.at).toLocaleString("fr-FR",{dateStyle:"short",timeStyle:"short",timeZone:"Europe/Paris"}):"Non signée";text(signed?"Signature tracée le "+at+" (heure de Paris)":"Signature facultative non renseignée",{size:9,color:muted,gap:4});ensure(82);page.drawRectangle({x:M,y:y-70,width:usable,height:70,borderColor:muted,borderWidth:.6});if(signed){const image=await doc.embedPng(signed.png),scale=Math.min((usable-20)/image.width,56/image.height),w=image.width*scale,h=image.height*scale;page.drawImage(image,{x:M+10,y:y-35-h/2,width:w,height:h})}y-=82}
 newPage();return {doc,text,heading,section,space,signature,newPage};
}
function download(bytes,name){const blob=new Blob([bytes],{type:"application/pdf"}),url=URL.createObjectURL(blob),link=document.createElement("a");link.href=url;link.download=name;document.body.append(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(url),10000)}
async function actionPDF(button,fn){button.disabled=true;const label=button.textContent;button.textContent="Création du PDF…";try{await fn();if($("error"))$("error").textContent=""}catch(e){showError(e.message||e)}finally{button.disabled=false;button.textContent=label}}
function identityLine(i){return i.nom+" "+i.prenom+"  |  Groupe : "+i.groupe}
function ruleText(){return "Seuil théorique : au moins 70 % de réponses exactes et aucune erreur sur les questions signalées critiques (règle pédagogique interne). QCM : toutes les bonnes options doivent être choisies, sans option erronée."}
function theoryLabel(r){return r.passed?"Réussie":"Non réussie"}
let S=null;
function save(){try{if(S)sessionStorage.setItem(KEY,JSON.stringify(S));else sessionStorage.removeItem(KEY)}catch{}}
function restore(){try{let o=JSON.parse(sessionStorage.getItem(KEY)||"null");if(o&&o.version===VERSION&&o.identity&&Array.isArray(o.profiles)&&o.profiles.length&&o.profiles.every(p=>P[p])&&o.results)S=o}catch{}}
function theoryLanding(){
 A.innerHTML=hero("Espace apprenti / 01","Évaluation théorique","Renseignez votre identité, choisissez les habilitations demandées par votre formateur, puis téléchargez votre résultat en un seul PDF.")+
 '<form id="startForm"><section class="panel"><div class="eyebrow">01 / Identification</div><h2>Votre identité</h2><div class="grid fields">'+field("nom","Nom","","text",true)+field("prenom","Prénom","","text",true)+field("groupe","Classe / groupe","","text",true)+'</div></section><section class="panel"><div class="eyebrow">02 / Parcours</div><h2>Symboles à évaluer</h2><p class="muted">15 questions par parcours : 5 dangers/protections, 5 zones/distances, 5 limites. 20 minutes par parcours.</p>'+profilePicker([])+'</section><section class="panel"><h2>Consignes</h2><p>'+E(ruleText())+'</p><p>Plusieurs réponses peuvent être justes. Les questions non renseignées comptent comme incorrectes. Le chronomètre continue même si l’onglet est fermé ou actualisé. Les réponses et l’identité restent dans cet onglet ; ne fermez pas la session avant d’avoir téléchargé votre PDF.</p><div class="notice">'+E(pilot)+'</div><label class="checkline"><input type="checkbox" id="agree" required>Je confirme que j’ai sélectionné les symboles demandés et que je réaliserai le test selon les consignes du formateur.</label><p class="error" id="error" role="alert"></p><button class="primary" type="submit">Accéder à mon parcours →</button></section></form>'+footer();
 $("startForm").onsubmit=e=>{e.preventDefault();const identity=Object.fromEntries(["nom","prenom","groupe"].map(k=>[k,$(k).value.trim()])),profiles=chosen();if(!profiles.length)return showError("Sélectionnez au moins un symbole.");if(Object.values(identity).some(s=>!s))return showError("Renseignez les trois champs.");S={version:VERSION,id:"HAB-"+(crypto.randomUUID?crypto.randomUUID():Math.random().toString(36).slice(2)+Date.now()).slice(0,12).toUpperCase(),date:new Date().toISOString(),identity,profiles,results:{},exam:null};save();renderTheory()};
}
function theoryDashboard(){
 const pending=S.profiles.find(p=>!S.results[p]),done=S.profiles.length-(S.profiles.filter(p=>!S.results[p]).length),all=!pending;
 A.innerHTML=hero("Espace apprenti / "+(all?"03":"02"),all?"Votre bilan est prêt":"Votre parcours",identityLine(S.identity)+" · Réf. "+S.id)+
 '<section class="panel"><div class="row"><div><div class="eyebrow">Avancement</div><div class="metric">'+done+' / '+S.profiles.length+'</div></div>'+status(all?"Terminé":"En cours",all?"good":"wait")+'</div><div class="progress"><i style="width:'+done/S.profiles.length*100+'%"></i></div><div class="scroll" style="margin-top:18px"><table><thead><tr><th>Symbole</th><th>Score</th><th>Temps</th><th>Résultat</th></tr></thead><tbody>'+S.profiles.map(p=>{let r=S.results[p]?scoreExam(p,S.results[p].ids,S.results[p].answers,S.results[p].seconds):null;return '<tr><td><b>'+E(get(p))+'</b></td><td>'+(r?r.good+'/'+r.total+' · '+r.pct+' %':'—')+'</td><td>'+(r?displayTime(r.seconds):"—")+'</td><td>'+(r?status(theoryLabel(r),r.passed?"good":"bad"):status("À passer","wait"))+'</td></tr>'}).join("")+'</tbody></table></div></section>'+
 (all?'<section class="panel"><h2>Transmettre votre PDF au formateur</h2><p>Le fichier contient votre identité, les scores et les réponses détaillées. Téléchargez-le et transmettez-le par le canal demandé par votre formateur. N’envoyez pas de données nominatives sur GitHub.</p><button id="theoryPDF" class="primary">Télécharger mon PDF de théorie</button><p id="downloaded" class="success" role="status"></p><p class="error" id="error" role="alert"></p></section>':'<section class="panel"><div class="eyebrow">Prochaine épreuve</div><h2>'+E(get(pending))+'</h2><p>15 questions · 20 minutes · correction en fin d’épreuve.</p><button class="primary" id="begin">Commencer cette épreuve →</button></section>')+
 '<div class="toolbar"><button id="restart" class="secondary">Effacer la session / nouvel apprenti</button></div>'+footer();
 $("restart").onclick=()=>{if(confirm("Effacer cette session et les résultats présents dans cet onglet ? Assurez-vous d’avoir téléchargé les PDF nécessaires.")){S=null;save();renderTheory()}};
 if(pending)$("begin").onclick=()=>{S.exam=makeExam(pending);save();renderTheory()};
 if(all)$("theoryPDF").onclick=()=>actionPDF($("theoryPDF"),async()=>{await theoryPDF();$("downloaded").textContent="PDF généré. Vous pouvez le transmettre au formateur."});
}
function examScreen(){
 const ex=S.exam;if(Date.now()>=ex.end){finishExam(true);return}
 const id=ex.ids[ex.index],q=Q[id];if(!q){S.exam=null;save();renderTheory();return}
 const selected=ex.answers[id]||[],count=ex.ids.filter(x=>ex.answers[x]?.length).length;
 if(!ex.orders[id]){ex.orders[id]=shuffle(q.options.map((_,i)=>i));save()}
 A.innerHTML='<div class="row"><div><div class="eyebrow">Épreuve en cours / '+E(get(ex.id))+'</div><h1>Question '+(ex.index+1)+' sur 15</h1></div><div class="metric small">'+count+' / 15</div></div><div class="progress"><i style="width:'+count/15*100+'%"></i></div><div class="examgrid" style="margin-top:18px"><section class="panel"><div class="eyebrow">'+E(themes[q.theme])+'</div>'+(q.critical?'<div class="notice">Question critique de sécurité : une erreur bloque la réussite de cette épreuve.</div>':'')+'<h2>'+E(q.question)+'</h2><p class="muted">Cochez toutes les réponses que vous considérez exactes.</p>'+ex.orders[id].map(i=>'<label class="option"><input type="checkbox" data-opt="'+i+'" '+(selected.includes(i)?"checked":"")+'><span>'+E(q.options[i].text)+'</span></label>').join("")+'<div class="row" style="margin-top:18px"><button id="prev" '+(ex.index===0?"disabled":"")+'>← Précédente</button><button id="next" class="primary" '+(ex.index===14?"disabled":"")+'>Suivante →</button></div></section><aside class="panel"><h3>Navigation</h3><div class="nav">'+ex.ids.map((q,i)=>'<button data-nav="'+i+'" class="'+(ex.answers[q]?.length?"done ":"")+(i===ex.index?"current":"")+'">'+(i+1)+'</button>').join("")+'</div><p class="fine" style="margin-top:12px">Vert : une réponse enregistrée.</p><button id="finish" class="primary" style="width:100%">Terminer l’épreuve</button></aside></div>'+footer();
 A.querySelectorAll("[data-opt]").forEach(el=>el.onchange=()=>{ex.answers[id]=[...A.querySelectorAll("[data-opt]:checked")].map(i=>Number(i.dataset.opt));save();examScreen()});
 const navigate=n=>{ex.index=n;save();examScreen();window.scrollTo({top:0,behavior:"instant"})};
 $("prev").onclick=()=>navigate(ex.index-1);$("next").onclick=()=>navigate(ex.index+1);A.querySelectorAll("[data-nav]").forEach(b=>b.onclick=()=>navigate(Number(b.dataset.nav)));
 $("finish").onclick=()=>{const unanswered=15-count;if(confirm("Terminer définitivement cette épreuve ? "+(unanswered?unanswered+" question(s) sans réponse compteront comme incorrectes.":"Toutes les questions ont une réponse.")))finishExam(false)};
 updateClock();
}
function finishExam(expired){if(!S?.exam)return;const ex=S.exam;S.results[ex.id]={ids:ex.ids,answers:ex.answers,seconds:expired?P[ex.id].minutes*60:Math.max(0,Math.round((Date.now()-ex.start)/1000))};S.exam=null;save();renderTheory();if(expired)alert("Temps écoulé : l’épreuve a été corrigée avec les réponses enregistrées.")}
function updateClock(){const h=$("headRight");if(!S?.exam){h.className="badge";h.textContent="APPRENTI";return}const remain=Math.max(0,Math.ceil((S.exam.end-Date.now())/1000));h.className="clock"+(remain<60?" danger":"");h.textContent=displayTime(remain);if(!remain)finishExam(true)}
function renderTheory(){if(!S)theoryLanding();else if(S.exam)examScreen();else theoryDashboard();updateClock()}
async function theoryPDF(){
 const packet={version:VERSION,id:S.id,date:S.date,identity:S.identity,profiles:S.profiles,results:S.results};
 const validated=validatePacket(packet),b=await pdfBuilder("Résultats de l'évaluation théorique","Formation préalable à l'habilitation électrique",S.id);
 b.doc.setTitle("Résultats théoriques - "+S.identity.nom+" "+S.identity.prenom);b.doc.setAuthor("BLACKOUT HABILITATION");b.doc.setSubject(encodePacket(packet));b.doc.setCreator("BLACKOUT HABILITATION V5");
 b.heading("01 / Identification");b.text(identityLine(S.identity),{weight:true,size:12});b.text("Date : "+dateFmt(S.date)+"   |   Référence : "+S.id);
 b.heading("02 / Résultats par symbole");for(const p of S.profiles){const r=validated.results[p];b.text(get(p)+"  |  "+r.good+"/"+r.total+" ("+r.pct+" %)  |  "+theoryLabel(r)+"  |  Temps "+displayTime(r.seconds)+"  |  Erreurs critiques : "+r.critical,{weight:true});b.text(Object.keys(themes).map(k=>themes[k]+" "+r.themes[k][0]+"/5").join("  |  "),{size:9,gap:8})}
 b.heading("03 / Conditions et limites");b.text(ruleText(),{size:9});b.text("Résultats produits localement, sans authentification cryptographique. Le formateur doit contrôler l'identité, les conditions du test et la cohérence des résultats. "+pilot,{size:9});
 for(const p of S.profiles){const r=validated.results[p];b.newPage();b.heading("Correction détaillée - "+get(p));b.text("Résultat : "+r.good+"/"+r.total+" ("+r.pct+" %) / "+theoryLabel(r),{weight:true});for(let i=0;i<r.detail.length;i++){const d=r.detail[i],q=Q[d.id];b.section((i+1)+". "+(d.ok?"Correct":"Incorrect")+(d.critical?" / critique":""));b.text(q.question,{weight:true,gap:3});b.text("Réponse donnée : "+(d.selected.map(k=>q.options[k].text).join(" ; ")||"Aucune"),{size:9,gap:3});b.text("Réponse attendue : "+d.correct.map(k=>q.options[k].text).join(" ; "),{size:9,gap:8});}}
 download(await b.doc.save(),"THEORIE_HABILITATION_"+safeName(S.identity.nom)+"_"+safeName(S.identity.prenom)+"_"+S.id+".pdf");
}
let T={identity:{nom:"",prenom:"",groupe:"",entreprise:"",organisme:"PROMEO",lieu:"",formateur:"",fonction:"Formateur",dateTheorie:today(),datePratique:today(),dureeTheorie:"",dureePratique:"",stage:"Prévention du risque électrique",type:"Initiale",perimetre:""},file:null,source:null,importMessage:"",profiles:[],practice:{},external:{},verified:false,reviewed:false,scopeNotes:"",signatures:{trainer:null,learner:null}};

function signatureSnapshot(){return JSON.stringify({identity:T.identity,profiles:T.profiles,practice:T.profiles.map(p=>[p,gridFor(p)]),external:T.external,verified:T.verified,scopeNotes:T.scopeNotes,source:T.source?.packet.id||null,file:T.file?[T.file.name,T.file.bytes.length,T.file.pages]:null})}
function validSignature(role){const s=T.signatures[role];return T.reviewed&&s?.png?.startsWith("data:image/png;base64,")&&s.snapshot===signatureSnapshot()?s:null}
function invalidateSignatureReview(){
 T.reviewed=false;T.signatures={trainer:null,learner:null};
 const review=$("reviewed");if(review)review.checked=false;
 for(const role of ["trainer","learner"]){const canvas=$("signature-"+role);if(canvas?.resetPad)canvas.resetPad()}
 refreshSignatureUI();
}
function signatureMarkup(){return '<div class="signature-section"><div class="eyebrow">06 / Signatures</div><h3>Signer le dossier</h3><p class="muted">Après relecture, tracez la signature à la souris, au doigt ou au stylet puis cliquez sur « Valider la signature ». Toute modification du dossier annule la relecture et les signatures.</p><div id="signatureLock" class="info"></div><div class="signature-grid">'+[["trainer","Signature du formateur","Obligatoire pour le PDF final"],["learner","Signature de l’apprenti","Facultative · prise de connaissance"]].map(([role,title,subtitle])=>'<div class="signature-card"><h3>'+E(title)+'</h3><small>'+E(subtitle)+'</small><canvas id="signature-'+role+'" class="signature-pad" width="900" height="300" aria-label="'+E(title)+'" role="img"></canvas><div class="toolbar"><button type="button" id="clear-'+role+'" class="secondary">Effacer</button><button type="button" id="accept-'+role+'" class="primary">Valider la signature</button></div><p id="signed-'+role+'" class="fine" role="status"></p></div>').join("")+'</div><p class="fine">Signatures manuscrites numérisées intégrées au PDF, sans certificat électronique ni horodatage de confiance. Elles restent dans la mémoire de cet onglet ; aucune signature n’est envoyée à GitHub.</p></div>'}
function refreshSignatureUI(){
 const lock=$("signatureLock");if(!lock)return;
 lock.textContent=T.reviewed?"Relecture confirmée : vous pouvez signer.":"Confirmez d’abord la relecture du dossier ci-dessus pour activer les signatures.";
 for(const role of ["trainer","learner"]){
 const canvas=$("signature-"+role),accept=$("accept-"+role),clear=$("clear-"+role),label=$("signed-"+role);
 if(!canvas||!accept||!clear||!label)continue;
 const signed=validSignature(role);
 canvas.classList.toggle("locked",!T.reviewed||!!signed);
 canvas.setAttribute("aria-disabled",String(!T.reviewed||!!signed));
 accept.disabled=!T.reviewed||!!signed||!canvas.hasInk;
 clear.disabled=!T.reviewed||(!signed&&!canvas.hasInk);
 label.className=signed?"success":"fine";
 label.textContent=signed?"Signature validée le "+new Date(signed.at).toLocaleString("fr-FR"):canvas.hasInk?"Tracé à valider.":role==="trainer"?"Signature obligatoire non renseignée.":"Signature facultative non renseignée.";
 }
}
function initSignaturePad(role){
 const canvas=$("signature-"+role);if(!canvas)return;
 const ctx=canvas.getContext("2d");let pointer=null,last=null,points=0,minX=Infinity,minY=Infinity,maxX=-Infinity,maxY=-Infinity,distance=0;
 canvas.hasInk=false;
 function reset(){if(pointer!==null){try{if(canvas.hasPointerCapture(pointer))canvas.releasePointerCapture(pointer)}catch{}}pointer=null;last=null;points=0;distance=0;minX=minY=Infinity;maxX=maxY=-Infinity;ctx.clearRect(0,0,canvas.width,canvas.height);canvas.hasInk=false}
 canvas.resetPad=reset;
 function point(e){const r=canvas.getBoundingClientRect();return {x:Math.max(0,Math.min(canvas.width,(e.clientX-r.left)*canvas.width/r.width)),y:Math.max(0,Math.min(canvas.height,(e.clientY-r.top)*canvas.height/r.height))}}
 function bound(p){minX=Math.min(minX,p.x);minY=Math.min(minY,p.y);maxX=Math.max(maxX,p.x);maxY=Math.max(maxY,p.y)}
 function draw(p){if(!last)return;const d=Math.hypot(p.x-last.x,p.y-last.y);if(d<.2)return;ctx.lineWidth=6;ctx.lineCap="round";ctx.lineJoin="round";ctx.strokeStyle="#142738";ctx.beginPath();ctx.moveTo(last.x,last.y);ctx.lineTo(p.x,p.y);ctx.stroke();bound(last);bound(p);distance+=d;points++;last=p;canvas.hasInk=distance>=24&&Math.max(maxX-minX,maxY-minY)>=15&&points>=2;refreshSignatureUI()}
 canvas.addEventListener("pointerdown",e=>{if(!T.reviewed||validSignature(role)||pointer!==null||(e.pointerType==="mouse"&&e.button!==0))return;e.preventDefault();pointer=e.pointerId;last=point(e);try{canvas.setPointerCapture(pointer)}catch{}});
 canvas.addEventListener("pointermove",e=>{if(pointer!==e.pointerId)return;e.preventDefault();draw(point(e))});
 function end(e){if(pointer!==e.pointerId)return;if(e.type==="pointerup")draw(point(e));pointer=null;last=null;refreshSignatureUI()}
 for(const event of ["pointerup","pointercancel","lostpointercapture"])canvas.addEventListener(event,end);
 $("clear-"+role).onclick=()=>{if(!T.reviewed)return;T.signatures[role]=null;reset();refreshSignatureUI();updateOverall()};
 $("accept-"+role).onclick=()=>{if(!T.reviewed||!canvas.hasInk||validSignature(role))return;const pad=18,x=Math.max(0,Math.floor(minX-pad)),y=Math.max(0,Math.floor(minY-pad)),w=Math.min(canvas.width-x,Math.ceil(maxX+pad-x)),h=Math.min(canvas.height-y,Math.ceil(maxY+pad-y));const crop=document.createElement("canvas");crop.width=w;crop.height=h;crop.getContext("2d").drawImage(canvas,x,y,w,h,0,0,w,h);T.signatures[role]={png:crop.toDataURL("image/png"),at:new Date().toISOString(),snapshot:signatureSnapshot()};refreshSignatureUI();updateOverall()};
 const saved=validSignature(role);if(saved){const img=new Image();img.onload=()=>{if(validSignature(role)!==saved)return;const scale=Math.min((canvas.width-40)/img.width,(canvas.height-40)/img.height,1.5);ctx.drawImage(img,(canvas.width-img.width*scale)/2,(canvas.height-img.height*scale)/2,img.width*scale,img.height*scale);canvas.hasInk=true;refreshSignatureUI()};img.src=saved.png}
}

function emptyGrid(p){return {criteria:P[p].criteria.map(text=>({text,mark:"",note:"",base:true})),scenario:"",observations:"",opinion:"incomplet",reserve:""}}
function gridFor(p){return T.practice[p]||(T.practice[p]=emptyGrid(p))}
function importState(){return T.source?"v5":T.file?"external":"none"}
function readTheory(p){
 if(T.source)return T.source.results[p]||null;
 if(T.file){const x=T.external[p];if(!x||!Number.isInteger(x.good)||!Number.isInteger(x.total)||x.good<0||x.good>x.total||x.total<15||!["0","1","unknown"].includes(x.critical))return null;return {good:x.good,total:x.total,pct:Math.round(x.good*100/x.total),critical:x.critical==="0"?0:x.critical==="1"?1:null,passed:x.good/x.total>=.7&&x.critical==="0"}}
 return null;
}
function identityMatch(){return !T.source||["nom","prenom","groupe"].every(k=>normal(T.identity[k])===normal(T.source.packet.identity[k]))}
function gridStatus(p){
 const g=gridFor(p),r=readTheory(p),minor=g.criteria.filter(c=>c.mark==="minor").length,major=g.criteria.filter(c=>c.mark==="major").length,unseen=g.criteria.filter(c=>!c.mark||c.mark==="unseen").length;
 const positive=!!r?.passed&&T.verified&&identityMatch(),complete=!!g.scenario.trim()&&unseen===0,possible=positive&&complete&&minor<=2&&major===0;
 return {r,minor,major,unseen,positive,complete,possible};
}
function trainerFields(){const i=T.identity;return '<div class="grid fields">'+field("nom","Nom",i.nom,"text",true)+field("prenom","Prénom",i.prenom,"text",true)+field("groupe","Classe / groupe",i.groupe,"text",true)+field("entreprise","Entreprise",i.entreprise)+field("organisme","Organisme de formation",i.organisme,"text",true)+field("lieu","Lieu",i.lieu,"text",true)+field("formateur","Formateur / signataire",i.formateur,"text",true)+field("fonction","Fonction du signataire",i.fonction,"text",true)+field("dateTheorie","Date théorie",i.dateTheorie,"date",true)+field("datePratique","Date pratique",i.datePratique,"date",true)+field("dureeTheorie","Durée théorie (ex. 7 h)",i.dureeTheorie,"text",true)+field("dureePratique","Durée pratique (ex. 3 h)",i.dureePratique,"text",true)+field("stage","Intitulé du stage",i.stage,"text",true)+'<label>Type de formation<select id="type"><option '+(i.type==="Initiale"?"selected":"")+'>Initiale</option><option '+(i.type==="Recyclage"?"selected":"")+'>Recyclage</option></select></label></div><label class="fields" style="display:block;margin-top:12px;font-size:14px;font-weight:700;color:var(--muted)">Attributions, environnement et restrictions envisagés par l’employeur<textarea id="perimetre" placeholder="Installations, domaine de tension, opérations, limites…">'+E(i.perimetre)+'</textarea></label>'}
function renderTrainer(){
 A.innerHTML=hero("Espace formateur / V5","Évaluation pratique et avis après formation","Importez le résultat théorique, sélectionnez les symboles, renseignez les observations et générez le dossier PDF individuel.")+
 '<section class="panel"><div class="eyebrow">01 / Théorie</div><h2>Importer le PDF de l’apprenti</h2><div class="filebox"><label for="theoryFile"><b>Fichier PDF de théorie</b></label><input id="theoryFile" type="file" accept="application/pdf,.pdf"><p id="importMessage" role="status" class="'+(T.source?"success":"muted")+'" style="margin:9px 0 0">'+E(T.importMessage||"Aucun fichier importé.")+'</p></div>'+(T.file?'<div class="toolbar" style="margin-top:10px"><button id="openTheory" type="button">Ouvrir le PDF importé</button><button id="removeTheory" type="button" class="secondary">Retirer le PDF</button></div>':'')+
 '<p class="fine">Pour un PDF issu de la V5, les réponses intégrées sont recalculées. Le document d’origine reste annexé. Le fichier n’est ni authentifié ni envoyé vers un serveur.</p>'+(T.file?'<label class="checkline"><input id="verified" type="checkbox" '+(T.verified?"checked":"")+'>J’ai contrôlé le PDF original, l’identité, les résultats et les conditions de réalisation du test. Pour un PDF externe, j’ai vérifié les résultats reportés et les critères de réussite applicables.</label>':'')+'</section>'+
 '<section class="panel"><div class="eyebrow">02 / Identification</div><h2>Informations du dossier</h2>'+trainerFields()+'</section><section class="panel"><div class="eyebrow">03 / Périmètre</div><h2>Symboles faisant l’objet de l’évaluation</h2><p class="muted">Cochez les symboles à évaluer. La grille s’adapte à chaque profil. Pour un avis favorable, le parcours théorique doit être validé et contrôlé.</p>'+profilePicker(T.profiles)+'</section><div id="practiceArea"></div>'+
 '<section class="panel"><div class="eyebrow">05 / Dossier final</div><h2>Générer l’avis après formation</h2><label class="fields" style="font-size:14px;font-weight:700;color:var(--muted)">Observations globales / restrictions<textarea id="scopeNotes" placeholder="Précisions, limites d’activité, compléments de formation, contexte…">'+E(T.scopeNotes)+'</textarea></label><div class="notice">'+E(pilot)+'</div><label class="checkline"><input id="reviewed" type="checkbox" '+(T.reviewed?"checked":"")+'>Je confirme avoir relu le dossier et que les informations et avis reportés correspondent à mes observations. Je signe ensuite l’avis en connaissance de cause.</label>'+signatureMarkup()+'<p id="error" role="alert" class="error"></p><div class="sticky-summary row"><span id="overallStatus" class="muted"></span><div class="toolbar"><button id="resetTrainer" class="secondary">Nouveau dossier</button><button id="generate" class="primary">Générer le dossier PDF complet</button></div></div></section>'+footer();
 $("theoryFile").onchange=async e=>{const file=e.target.files?.[0];if(file)await importPDF(file)};
 if($("openTheory"))$("openTheory").onclick=()=>{const u=URL.createObjectURL(new Blob([T.file.bytes],{type:"application/pdf"}));window.open(u,"_blank","noopener,noreferrer");setTimeout(()=>URL.revokeObjectURL(u),120000)};
 if($("removeTheory"))$("removeTheory").onclick=()=>{if(confirm("Retirer le PDF et les résultats théoriques associés ? Les observations pratiques restent en mémoire.")){T.file=null;T.source=null;T.external={};T.verified=false;invalidateSignatureReview();T.importMessage="PDF retiré.";for(const g of Object.values(T.practice))if(g.opinion==="favorable")g.opinion="incomplet";renderTrainer()}};
 if($("verified"))$("verified").onchange=e=>{T.verified=e.target.checked;invalidateSignatureReview();$("reviewed").checked=false;renderPractices()};
 Object.keys(T.identity).forEach(k=>{const el=$(k);if(el)el.oninput=()=>{T.identity[k]=el.value;invalidateSignatureReview();$("reviewed").checked=false;if(["nom","prenom","groupe"].includes(k)){if(T.source&&!identityMatch()){T.verified=false;if($("verified"))$("verified").checked=false}renderPractices()}else updateOverall()}});
 A.querySelectorAll('input[name=profile]').forEach(x=>x.onchange=()=>{T.profiles=chosen();invalidateSignatureReview();$("reviewed").checked=false;renderPractices()});
 $("scopeNotes").oninput=e=>{T.scopeNotes=e.target.value;invalidateSignatureReview();$("reviewed").checked=false};
 $("reviewed").onchange=e=>{if(e.target.checked){T.reviewed=true;refreshSignatureUI()}else invalidateSignatureReview();updateOverall()};
 for(const role of ["trainer","learner"])initSignaturePad(role);refreshSignatureUI();
 $("generate").onclick=()=>actionPDF($("generate"),async()=>{A.inert=true;try{await trainerPDF()}finally{A.inert=false}});
 $("resetTrainer").onclick=()=>{if(confirm("Effacer ce dossier de la mémoire de cet onglet ? Téléchargez d’abord le PDF si nécessaire.")){location.reload()}};
 renderPractices();
}
async function importPDF(file){
 try{
  if(file.size>30*1024*1024)throw Error("PDF trop volumineux : limite 30 Mo.");const {PDFDocument}=requirePdf(),bytes=new Uint8Array(await file.arrayBuffer()),pdf=await PDFDocument.load(bytes);
  if(!pdf.getPageCount())throw Error("PDF vide.");let source=null,message;
  const packet=decodePacket(pdf.getSubject());if(packet){source=validatePacket(packet);message="PDF V5 reconnu · "+pdf.getPageCount()+" page(s) · "+source.packet.id+" · résultats recalculés."}
  else message="PDF externe importé · "+pdf.getPageCount()+" page(s). Renseignez manuellement les résultats pour chaque symbole, puis contrôlez-les.";
  const replace=T.file||T.profiles.length||Object.values(T.practice).some(g=>g.criteria.some(c=>c.mark));
  if(replace&&!confirm("Remplacer la théorie et repartir sur un nouveau dossier pratique ? Les observations et avis en cours seront effacés.")){renderTrainer();return}
  T.file={bytes,name:file.name,pages:pdf.getPageCount()};T.source=source;T.external={};T.practice={};T.profiles=source?[...source.packet.profiles]:[];T.verified=false;invalidateSignatureReview();T.importMessage=message;
  if(source){Object.assign(T.identity,source.packet.identity,{dateTheorie:source.packet.date.slice(0,10)})}else{Object.assign(T.identity,{nom:"",prenom:"",groupe:""})}
  renderTrainer();
 }catch(e){T.importMessage="Import impossible : "+e.message;if($("importMessage"))$("importMessage").textContent=T.importMessage;showError(T.importMessage)}
}
function marksSelect(value){return '<option value="">À renseigner</option>'+Object.entries(marks).map(([k,v])=>'<option value="'+k+'" '+(value===k?"selected":"")+'>'+E(v)+'</option>').join("")}
function renderPractices(){
 const area=$("practiceArea");if(!area)return;
 if(!T.profiles.length){area.innerHTML='<section class="panel"><div class="eyebrow">04 / Pratique</div><h2>Aucun symbole sélectionné</h2><p class="muted">Sélectionnez un ou plusieurs symboles pour afficher les grilles.</p></section>';updateOverall();return}
 area.innerHTML=T.profiles.map((p,n)=>{const g=gridFor(p),s=gridStatus(p),r=s.r;if(g.opinion==="favorable"&&!s.possible)g.opinion="incomplet";
 let manual="";if(importState()==="external"){const x=T.external[p]||{};manual='<div class="grid fields"><label>Bonnes réponses<input type="number" min="0" max="10000" step="1" data-manual="good" value="'+E(x.good??"")+'"></label><label>Nombre de questions<input type="number" min="15" max="10000" step="1" data-manual="total" value="'+E(x.total??"")+'"></label><label>Erreur critique constatée ?<select data-manual="critical"><option value="unknown" '+(!x.critical||x.critical==="unknown"?"selected":"")+'>À vérifier</option><option value="0" '+(x.critical==="0"?"selected":"")+'>Non</option><option value="1" '+(x.critical==="1"?"selected":"")+'>Oui</option></select></label></div>'}
 const desc=!r?"Résultat théorique absent":theoryLabel(r)+" · "+r.good+"/"+r.total+" ("+r.pct+" %)"+(r.critical===null?" · critiques à vérifier":" · critiques : "+r.critical);
 return '<section class="panel" data-profile="'+E(p)+'"><div class="row"><div><div class="eyebrow">04 / Pratique · '+(n+1)+' / '+T.profiles.length+'</div><h2>'+E(get(p))+'</h2><p class="muted">'+E(P[p].scope)+'</p></div>'+status(desc,r?(r.passed?"good":"bad"):"wait")+'</div>'+manual+
 (!s.positive?'<div class="notice">La théorie doit être positive et contrôlée avant de valider la pratique. Vous pouvez préparer la grille et conserver des observations, mais aucun avis favorable ne sera possible.</div>':'<div class="info">Théorie positive et contrôlée. Renseignez les critères observés pendant la mise en situation.</div>')+
 '<label class="fields" style="display:block;font-size:14px;font-weight:700;color:var(--muted)">Situation de travail / installation utilisée *<textarea data-field="scenario" placeholder="Décrire le banc, l’installation, la tâche confiée et les conditions…">'+E(g.scenario)+'</textarea></label><h3 style="margin-top:18px">Grille d’observation</h3><p class="fine">Sans erreur · mineure = sans conséquence directe pour la sécurité · majeure = conséquence directe pour la sécurité · non observé = évaluation à compléter.</p>'+
 g.criteria.map((c,i)=>'<div class="criterion"><div><strong>'+E(String(i+1)+". "+c.text)+'</strong><input data-note="'+i+'" placeholder="Observation facultative" maxlength="300" value="'+E(c.note)+'" style="font-size:13px" aria-label="Observation du critère '+(i+1)+'"></div><div><select data-mark="'+i+'" aria-label="Évaluation du critère '+(i+1)+'">'+marksSelect(c.mark)+'</select>'+(!c.base?'<button class="secondary" data-remove="'+i+'" type="button" style="margin-top:5px;font-size:12px;min-height:30px">Retirer ce critère</button>':'')+'</div></div>').join("")+
 '<div class="toolbar" style="margin-top:12px"><input data-newcriterion type="text" maxlength="180" placeholder="Ajouter un critère adapté à la situation" style="max-width:430px"><button data-add type="button">+ Ajouter</button></div><div class="grade-summary" data-summary></div>'+
 '<label class="fields" style="display:block;font-size:14px;font-weight:700;color:var(--muted)">Observations pratiques<textarea data-field="observations" placeholder="Écarts, points forts, reprises nécessaires…">'+E(g.observations)+'</textarea></label><div class="grid fields" style="margin-top:10px"><label>Avis explicite du formateur<select data-opinion><option value="incomplet" '+(g.opinion==="incomplet"?"selected":"")+'>À compléter</option><option value="favorable" '+(g.opinion==="favorable"?"selected ":"")+(s.possible?"":"disabled")+'>Favorable</option><option value="defavorable" '+(g.opinion==="defavorable"?"selected":"")+'>Défavorable</option></select></label><label>Restrictions / suites / justification<textarea data-field="reserve" placeholder="Préciser les limites ou les actions nécessaires…">'+E(g.reserve)+'</textarea></label></div></section>'
 }).join("");
 area.querySelectorAll("[data-profile]").forEach(el=>{const p=el.dataset.profile,g=gridFor(p);
  const invalidate=()=>{invalidateSignatureReview();$("reviewed").checked=false};
  el.querySelectorAll("[data-mark]").forEach(x=>x.onchange=()=>{g.criteria[Number(x.dataset.mark)].mark=x.value;g.opinion="incomplet";invalidate();refreshPractice(p,el)});
  el.querySelectorAll("[data-note]").forEach(x=>x.oninput=()=>{g.criteria[Number(x.dataset.note)].note=x.value;invalidate()});
  el.querySelectorAll("[data-field]").forEach(x=>x.oninput=()=>{g[x.dataset.field]=x.value;g.opinion="incomplet";invalidate();refreshPractice(p,el)});
  el.querySelector("[data-opinion]").onchange=e=>{const v=e.target.value;g.opinion=v==="favorable"&&!gridStatus(p).possible?"incomplet":v;invalidate();refreshPractice(p,el)};
  el.querySelector("[data-add]").onclick=()=>{const input=el.querySelector("[data-newcriterion]"),text=input.value.trim();if(!text)return;if(g.criteria.length>=35)return alert("35 critères maximum.");g.criteria.push({text,mark:"",note:"",base:false});g.opinion="incomplet";invalidate();renderPractices()};
  el.querySelectorAll("[data-remove]").forEach(x=>x.onclick=()=>{if(!g.criteria[Number(x.dataset.remove)].base){g.criteria.splice(Number(x.dataset.remove),1);g.opinion="incomplet";invalidate();renderPractices()}});
  el.querySelectorAll("[data-manual]").forEach(x=>x.onchange=()=>{T.external[p]??={};T.external[p][x.dataset.manual]=x.dataset.manual==="critical"?x.value:x.value===""?null:Number(x.value);T.verified=false;if($("verified"))$("verified").checked=false;g.opinion="incomplet";invalidate();renderPractices()});
  refreshPractice(p,el);
 });updateOverall();
}
function refreshPractice(p,el){const g=gridFor(p),s=gridStatus(p),op=el.querySelector("[data-opinion]");if(!s.possible&&g.opinion==="favorable")g.opinion="incomplet";op.querySelector('option[value="favorable"]').disabled=!s.possible;op.value=g.opinion;
 el.querySelector("[data-summary]").innerHTML='Sans erreur : <b>'+g.criteria.filter(c=>c.mark==="ok").length+'</b> · Mineures : <b>'+s.minor+'</b> · Majeures : <b>'+s.major+'</b> · Non observés / à renseigner : <b>'+s.unseen+'</b> '+status(s.possible?"Critères satisfaits":s.major||s.minor>2?"Critères non satisfaits":"À compléter / vérifier",s.possible?"good":s.major||s.minor>2?"bad":"wait");updateOverall()}
function updateOverall(){const el=$("overallStatus");if(!el)return;const fav=T.profiles.filter(p=>gridFor(p).opinion==="favorable"&&gridStatus(p).possible).length;el.textContent=T.profiles.length+" symbole(s) · "+fav+" avis favorable(s) · "+(T.file?"PDF théorique joint":"PDF théorique absent")+" · "+(validSignature("trainer")?"Formateur signé":"Signature formateur requise");refreshSignatureUI()}
async function trainerPDF(){
 if(!T.file)throw Error("Importez le PDF théorique avant de générer le dossier final.");
 if(!T.profiles.length)throw Error("Sélectionnez au moins un symbole.");
 const req=["nom","prenom","groupe","organisme","lieu","formateur","fonction","dateTheorie","datePratique","dureeTheorie","dureePratique","stage"];
 const missing=req.filter(k=>!T.identity[k]?.trim());if(missing.length)throw Error("Complétez tous les champs obligatoires (*) de l’identification et de la formation.");
 if(!identityMatch())throw Error("L’identité saisie ne correspond pas au PDF V5 importé. Corrigez les champs ou importez le bon fichier.");
 if(!T.reviewed)throw Error("Confirmez la relecture du dossier avant de générer le PDF.");
 const trainerSigned=validSignature("trainer"),learnerSigned=validSignature("learner");if(!trainerSigned)throw Error("Tracez et validez la signature du formateur avant de générer le PDF.");
 const fav=T.profiles.filter(p=>gridFor(p).opinion==="favorable"&&gridStatus(p).possible);if(T.profiles.some(p=>gridFor(p).opinion==="favorable"&&!gridStatus(p).possible))throw Error("Un avis favorable est incompatible avec les critères de réussite.");
 if(T.profiles.some(p=>gridFor(p).opinion==="defavorable"&&!gridFor(p).reserve.trim()&&!gridFor(p).observations.trim()))throw Error("Précisez les observations ou les suites pour chaque avis défavorable.");
 const i=T.identity,ref=T.source?.packet.id||("EXT-"+Date.now().toString(36).toUpperCase()),b=await pdfBuilder("Avis après formation préalable","Formation électrique / avis signé manuscritement",ref);
 b.doc.setTitle("Avis après formation - "+i.nom+" "+i.prenom);b.doc.setAuthor(i.organisme);b.doc.setSubject("Avis après formation préalable à l'habilitation électrique - V5 pilote");
 b.heading("01 / Identification de l'apprenti et de la formation");
 b.text(identityLine(i),{weight:true,size:12});b.text("Entreprise : "+(i.entreprise||"Non renseignée"));b.text("Organisme : "+i.organisme+"  |  Lieu : "+i.lieu);b.text("Stage : "+i.stage+"  |  Type : "+i.type);b.text("Théorie : "+dateFmt(i.dateTheorie)+" - "+i.dureeTheorie+"  |  Pratique : "+dateFmt(i.datePratique)+" - "+i.dureePratique);b.text("Formateur / signataire : "+i.formateur+" - "+i.fonction);b.text("Attributions et périmètre envisagés : "+(i.perimetre||"À préciser par l'employeur"));
 b.heading("02 / Synthèse des résultats et avis par symbole");
 for(const p of T.profiles){const g=gridFor(p),s=gridStatus(p),r=s.r;b.text(get(p)+"  |  Avis : "+ops[g.opinion],{weight:true,size:11,gap:3});b.text("Théorie : "+(r?r.good+"/"+r.total+" ("+r.pct+" %) / "+theoryLabel(r):"Non renseignée")+"  |  Pratique : "+s.minor+" mineure(s), "+s.major+" majeure(s), "+s.unseen+" non observé(s) / à compléter",{size:9,gap:4});if(g.reserve)b.text("Restrictions / suites : "+g.reserve,{size:9,gap:6})}
 b.heading("03 / Recommandations et visa");b.text("Symboles faisant l'objet d'un avis favorable : "+(fav.map(get).join(" ; ")||"Aucun"),{weight:true});b.text("Observations globales : "+(T.scopeNotes||"Aucune observation globale renseignée."));b.text("Le titre d'habilitation relève de l'employeur (article R. 4544-10 du Code du travail). Ce document est un avis après formation, et non un titre. Version pilote : validation institutionnelle requise avant usage officiel.",{size:9});b.text("Les visas manuscrits figurent à la fin du dossier pratique, avant l’annexe théorique.",{size:9});
 for(const p of T.profiles){const g=gridFor(p),s=gridStatus(p),r=s.r;b.newPage();b.heading("04 / Grille pratique - "+get(p));b.text("Périmètre : "+P[p].scope,{size:10});b.text("Situation de travail : "+(g.scenario||"Non renseignée"),{weight:true});b.text("Théorie : "+(r?r.good+"/"+r.total+" ("+r.pct+" %) / "+theoryLabel(r):"Non renseignée")+" ; contrôle formateur : "+(T.verified?"déclaré effectué":"non confirmé"),{size:9});for(let j=0;j<g.criteria.length;j++){const c=g.criteria[j];b.text((j+1)+". "+c.text,{weight:true,size:10,gap:2});b.text("Évaluation : "+(marks[c.mark]||"À renseigner")+(c.note?"  |  "+c.note:""),{size:9,gap:8})}b.heading("Bilan pratique et avis");b.text("Erreurs mineures : "+s.minor+" ; majeures : "+s.major+" ; non observés / à renseigner : "+s.unseen);b.text("Critères d'acceptation : théorie positive et vérifiée ; tous les critères observés ; au plus 2 erreurs mineures et aucune erreur majeure. Situation de travail décrite.",{size:9});b.text("Observations : "+(g.observations||"Non renseignées"));b.text("Avis du formateur : "+ops[g.opinion],{weight:true});b.text("Restrictions / suites : "+(g.reserve||"Non renseignées"))}
 b.newPage();b.heading("05 / Signatures et validation de l'avis");b.text(identityLine(i),{weight:true,size:12});b.text("Référence du dossier : "+ref);b.text("Avis favorables : "+(fav.map(get).join(" ; ")||"Aucun"));b.text("Le formateur confirme avoir relu le dossier et ses observations. La signature de l'apprenti, si présente, atteste uniquement sa prise de connaissance.",{size:10});await b.signature("Formateur / signataire de l'avis",i.formateur+" - "+i.fonction,trainerSigned);await b.signature("Apprenti / prise de connaissance (facultatif)",i.nom+" "+i.prenom,learnerSigned);b.text("Signatures manuscrites numérisées, sans certificat électronique ni horodatage de confiance. Le titre d'habilitation relève de l'employeur.",{size:9});
 b.newPage();b.heading("06 / Annexe - évaluation théorique originale");b.text("Fichier joint : "+T.file.name,{weight:true});b.text("Nombre de pages annexées : "+T.file.pages);b.text("Source : "+(T.source?"PDF V5 reconnu, réponses recalculées localement":"PDF externe, résultats reportés manuellement"));b.text("Contrôle des conditions de réalisation par le formateur : "+(T.verified?"confirmé":"non confirmé"));b.text("Le PDF original est reproduit à la suite de cette page. Les métadonnées d'un fichier local ne constituent pas une preuve d'authenticité.",{size:9});b.text("Références de cadrage : INRS ED 6127, sections 5.4 et 7.2 ; Code du travail, article R. 4544-10. Vérifier les référentiels et prescriptions applicables au contexte de formation.",{size:9});
 const {PDFDocument}=requirePdf(),original=await PDFDocument.load(T.file.bytes),pages=await b.doc.copyPages(original,original.getPageIndices());pages.forEach(p=>b.doc.addPage(p));
 download(await b.doc.save(),"AVIS_HABILITATION_"+safeName(i.nom)+"_"+safeName(i.prenom)+"_"+ref+".pdf");
}
if(MODE==="theorie"){restore();renderTheory();setInterval(updateClock,500)}else if(MODE==="formateur"){renderTrainer()}else A.textContent="Lien invalide.";
})();
