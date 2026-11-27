
"use strict";
(() => {
const D=window.HAB_DATA;if(!D){document.getElementById("app").textContent="Banque de questions indisponible. Actualisez la page.";return}
const PRACTICE=window.HAB_PRACTICE||{};
if(document.body.dataset.mode==="formateur"&&!D.profiles.some(p=>p.id==="B2V_Essai"))D.profiles.push({id:"B2V_Essai",name:"B2V Essai",domain:"BT",role:"chargé de travaux avec essais",scope:"B2V Essai — périmètre selon la formation et les prescriptions applicables",criteria:[],legacy:false});
const P=Object.fromEntries(D.profiles.map(p=>[p.id,p])), Q=Object.fromEntries(D.bank.map(q=>[q.id,q])), A=document.getElementById("app"), $=id=>document.getElementById(id);
const MODE=document.body.dataset.mode, VERSION=D.version, PREFIX="BLACKOUT-HAB-V5:", KEY="blackout-hab-v6-theory-"+VERSION;
const DEMO=MODE==="formateur"&&document.body.dataset.demo==="true";
const minimum=p=>PRACTICE[p]?(DEMO?1:PRACTICE[p].min):0;
const themes={risk:"Dangers et protections",zone:"Zones et distances",limit:"Limites du symbole"};
const marks={A:"Sans erreur",B:"Erreur acceptable",C:"Erreur majeure",D:"Erreur grave"};
const PRACTICE_RULE="Aucun D et au plus un C pour chaque mise en situation.";
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
const footer=()=>'<footer>BLACKOUT HABILITATION V6 · Traitement local dans le navigateur · <a target="_blank" rel="noreferrer" href="https://www.inrs.fr/risques/electriques/habilitation-electrique.html">INRS — Habilitation électrique</a> · <a target="_blank" rel="noreferrer" href="https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000033769527">Code du travail R. 4544-10</a></footer>';
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
let theorySaved=true;
function save(){try{if(S)sessionStorage.setItem(KEY,JSON.stringify(S));else sessionStorage.removeItem(KEY);theorySaved=true}catch{theorySaved=false}}
function restore(){try{let o=JSON.parse(sessionStorage.getItem(KEY)||"null");if(o&&o.version===VERSION&&o.identity&&Array.isArray(o.profiles)&&o.profiles.length&&o.profiles.every(p=>P[p])&&o.results)S=o}catch{}}
function theoryLanding(){
 A.innerHTML=hero("Espace apprenti / 01","Évaluation théorique","Renseignez votre identité, choisissez les habilitations demandées par votre formateur, puis téléchargez votre résultat en un seul PDF.")+
 '<form id="startForm"><section class="panel"><div class="eyebrow">01 / Identification</div><h2>Votre identité</h2><div class="grid fields">'+field("nom","Nom","","text",true)+field("prenom","Prénom","","text",true)+field("groupe","Classe / groupe","","text",true)+'</div></section><section class="panel"><div class="eyebrow">02 / Parcours</div><h2>Symboles à évaluer</h2><p class="muted">15 questions par parcours : 5 dangers/protections, 5 zones/distances, 5 limites. 20 minutes par parcours.</p>'+profilePicker([])+'</section><section class="panel"><h2>Consignes</h2><p>'+E(ruleText())+'</p><p>Plusieurs réponses peuvent être justes. Les questions non renseignées comptent comme incorrectes. Le chronomètre continue lors d’une actualisation. La sauvegarde est limitée à cet onglet : ne le fermez pas avant d’avoir téléchargé votre PDF.</p><div class="notice">'+E(pilot)+'</div><label class="checkline"><input type="checkbox" id="agree" required>Je confirme que j’ai sélectionné les symboles demandés et que je réaliserai le test selon les consignes du formateur.</label><p class="error" id="error" role="alert"></p><button class="primary" type="submit">Accéder à mon parcours →</button></section></form>'+footer();
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
 A.innerHTML='<div class="row"><div><div class="eyebrow">Épreuve en cours / '+E(get(ex.id))+'</div><h1>Question '+(ex.index+1)+' sur 15</h1></div><div class="exam-progress"><div class="metric small">'+count+' / 15</div><small>réponses saisies</small></div></div><div class="progress"><i style="width:'+count/15*100+'%"></i></div><div class="examgrid" style="margin-top:18px"><section class="panel"><div class="eyebrow">'+E(themes[q.theme])+'</div>'+(q.critical?'<div class="notice">Question critique de sécurité : une erreur bloque la réussite de cette épreuve.</div>':'')+'<h2>'+E(q.question)+'</h2><p class="muted">Cochez toutes les réponses que vous considérez exactes.</p>'+ex.orders[id].map(i=>'<label class="option"><input type="checkbox" data-opt="'+i+'" '+(selected.includes(i)?"checked":"")+'><span>'+E(q.options[i].text)+'</span></label>').join("")+'<div class="row" style="margin-top:18px"><button id="prev" '+(ex.index===0?"disabled":"")+'>← Précédente</button><button id="next" class="primary" '+(ex.index===14?"disabled":"")+'>Suivante →</button></div></section><aside class="panel"><h3>Questions</h3><div class="nav">'+ex.ids.map((q,i)=>'<button data-nav="'+i+'" class="'+(ex.answers[q]?.length?"done ":"")+(i===ex.index?"current":"")+'">'+(i+1)+'</button>').join("")+'</div><p class="fine" style="margin-top:12px">Vert : une réponse enregistrée.</p><p class="fine">'+(theorySaved?"✓ Sauvegardé dans cet onglet":"⚠ Sauvegarde indisponible : ne quittez pas la page") +'</p><button id="finish" class="primary" style="width:100%">Terminer l’épreuve</button></aside></div>'+footer();
 A.querySelectorAll("[data-opt]").forEach(el=>el.onchange=()=>{ex.answers[id]=[...A.querySelectorAll("[data-opt]:checked")].map(i=>Number(i.dataset.opt));save();examScreen()});
 const navigate=n=>{ex.index=n;save();examScreen();window.scrollTo({top:0,behavior:"instant"})};
 A.querySelectorAll("[data-nav]").forEach(b=>b.setAttribute("aria-label","Question "+(Number(b.dataset.nav)+1)+(ex.answers[ex.ids[Number(b.dataset.nav)]]?.length?" — répondue":" — non répondue")));A.querySelectorAll("[data-nav].current").forEach(b=>b.setAttribute("aria-current","step"));
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
let T={identity:{nom:"",prenom:"",groupe:"",entreprise:"",organisme:"PROMEO",lieu:"",formateur:"",fonction:"Formateur",dateTheorie:today(),datePratique:today(),dureeTheorie:"",dureePratique:"",stage:"Prévention du risque électrique",type:"Initiale",perimetre:"",titresDemandes:"",datesFormation:"",dureeFormation:""},file:null,source:null,importMessage:"",profiles:[],practice:{},external:{},verified:false,reviewed:false,scopeNotes:"",signatures:{trainer:null,learner:null}};

function signatureSnapshot(){return JSON.stringify({identity:T.identity,profiles:T.profiles,practice:T.profiles.map(p=>[p,gridFor(p)]),external:T.external,verified:T.verified,scopeNotes:T.scopeNotes,source:T.source?.packet.id||null,file:T.file?[T.file.name,T.file.bytes.length,T.file.pages]:null})}
function validSignature(role){const s=T.signatures[role];return T.reviewed&&s?.png?.startsWith("data:image/png;base64,")&&s.snapshot===signatureSnapshot()?s:null}
function invalidateSignatureReview(){
 if(DEMO)clearQuickArtifacts();
 T.reviewed=false;T.signatures={trainer:null,learner:null};
 const review=$("reviewed");if(review)review.checked=false;
 for(const role of ["trainer","learner"]){const canvas=$("signature-"+role);if(canvas?.resetPad)canvas.resetPad()}
 refreshSignatureUI();refreshWorkspace();scheduleDraft();
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


function newSituation(p){const template=PRACTICE[p];return {title:"",criteria:(template?.criteria||[]).map(text=>({text,mark:"",note:""})),observations:""}}
function emptyGrid(p){const template=PRACTICE[p];return {situations:template?Array.from({length:minimum(p)},()=>newSituation(p)):[],observations:"",opinion:"incomplet",reserve:"",avisTension:"",avisOuvrages:"",avisIndications:""}}
function gridFor(p){return T.practice[p]||(T.practice[p]=emptyGrid(p))}
function removeSituation(p,index){const g=gridFor(p);if(!PRACTICE[p]||!Number.isInteger(index)||index<0||index>=g.situations.length)return false;g.situations.splice(index,1);g.opinion="incomplet";invalidateSignatureReview();return true}

function importState(){return T.source?"v5":T.file?"external":"none"}
function readTheory(p){
 if(T.source)return T.source.results[p]||null;
 if(T.file){const x=T.external[p];if(!x||!Number.isInteger(x.good)||!Number.isInteger(x.total)||x.good<0||x.good>x.total||x.total<15||!["0","1","unknown"].includes(x.critical))return null;return {good:x.good,total:x.total,pct:Math.round(x.good*100/x.total),critical:x.critical==="0"?0:x.critical==="1"?1:null,passed:x.good/x.total>=.7&&x.critical==="0"}}
 return null;
}
function identityMatch(){return !T.source||["nom","prenom","groupe"].every(k=>normal(T.identity[k])===normal(T.source.packet.identity[k]))}

function situationStatus(s){
 const counts={A:0,B:0,C:0,D:0,unseen:0};
 for(const c of s.criteria){if(Object.prototype.hasOwnProperty.call(marks,c.mark))counts[c.mark]++;else counts.unseen++}
 const complete=!!s.title.trim()&&s.criteria.length>0&&counts.unseen===0,failed=counts.D>0||counts.C>1;
 return {counts,complete,failed,pass:complete&&!failed};
}
function gridStatus(p){
 const g=gridFor(p),r=readTheory(p),template=PRACTICE[p],situations=g.situations.map(situationStatus);
 const counts=situations.reduce((a,s)=>{for(const k of Object.keys(a))a[k]+=s.counts[k];return a},{A:0,B:0,C:0,D:0,unseen:0});
 const positive=!!r?.passed&&T.verified&&identityMatch(),complete=!!template&&situations.length>=minimum(p)&&situations.every(s=>s.complete),failed=situations.some(s=>s.failed),practicePassed=complete&&!failed,possible=positive&&practicePassed;
 return {r,counts,situations,positive,complete,failed,practicePassed,possible,template};
}


/* La clôture de l'évaluation n'est pas sa réussite. */
function decisionReview(p){
 const g=gridFor(p),s=gridStatus(p),t=s.template,reasons=[],blockers=[];
 const explicitNotes=[g.reserve.trim(),g.observations.trim(),...g.situations.flatMap((sit,i)=>{
  const notes=[sit.observations.trim(),...sit.criteria.map((c,j)=>c.note.trim()?"Indicateur "+(j+1)+" : "+c.note.trim():"")].filter(Boolean);
  return notes.length?["Situation "+(i+1)+" : "+notes.join(" ; ")]:[];
 })].filter(Boolean);
 const failedObserved=g.situations.some((sit,i)=>!!sit.title.trim()&&s.situations[i].failed);
 if(s.r&&s.r.critical!==null&&!s.r.passed)reasons.push("Évaluation théorique non réussie ("+s.r.good+"/"+s.r.total+", "+s.r.pct+" %"+(s.r.critical>0?", erreur(s) critique(s) constatée(s)":"")+").");
 for(const [i,z] of s.situations.entries())if(z.failed)reasons.push("Situation "+(i+1)+(g.situations[i].title.trim()?" ("+g.situations[i].title.trim()+")":"")+" : "+z.counts.C+" C, "+z.counts.D+" D ; critères d’acceptation non satisfaits.");
 const negative=g.opinion==="defavorable",stopped=negative&&!s.complete&&failedObserved,reasoned=reasons.length>0||explicitNotes.length>0;
 if(stopped)reasons.unshift("Évaluation pratique non intégralement renseignée : clôture défavorable sur un échec constaté. Les éléments non observés ne sont pas validés.");
 if(!t)blockers.push("grille pratique non disponible");
 else{
  if(!s.r||s.r.critical===null)blockers.push("résultat théorique manquant / non renseigné");
  if(!s.complete&&!stopped)blockers.push(g.situations.length<minimum(p)?"minimum de "+minimum(p)+" situation(s) non atteint":"compléter les intitulés et indicateurs");
  if(g.opinion==="incomplet")blockers.push("sélectionner l’avis du formateur");
  if(negative&&!reasoned)blockers.push("justifier l’avis défavorable (aucun échec objectif relevé)");
  if(g.opinion==="favorable"&&!s.possible)blockers.push("critères incompatibles avec l’avis favorable");
 }
 return {closed:!!t&&blockers.length===0&&["favorable","defavorable"].includes(g.opinion),negative,stopped,reasons:[...reasons,...explicitNotes],blockers};
}
function reviewBadge(p){const d=decisionReview(p);return d.closed?status(d.negative?"Terminé · défavorable":"Terminé · favorable",d.negative?"bad":"good"):status("À compléter","wait")}

function trainerFields(){const i=T.identity;return '<div class="grid fields">'+field("nom","Nom",i.nom,"text",true)+field("prenom","Prénom",i.prenom,"text",true)+field("groupe","Classe / groupe",i.groupe,"text",true)+field("entreprise","Entreprise",i.entreprise,"text",true)+field("organisme","Organisme de formation",i.organisme,"text",true)+field("lieu","Lieu",i.lieu,"text",true)+field("formateur","Formateur / signataire",i.formateur,"text",true)+field("fonction","Fonction du signataire",i.fonction,"text",true)+field("dateTheorie","Date théorie",i.dateTheorie,"date",true)+field("datePratique","Date pratique",i.datePratique,"date",true)+field("dureeTheorie","Durée théorie (ex. 7 h)",i.dureeTheorie,"text",true)+field("dureePratique","Durée pratique (ex. 3 h)",i.dureePratique,"text",true)+field("stage","Intitulé de la formation",i.stage,"text",true)+field("datesFormation","Dates de la formation (facultatif : dates des évaluations par défaut)",i.datesFormation)+field("dureeFormation","Durée totale (facultatif : théorie + pratique par défaut)",i.dureeFormation)+'<label>Type de formation<select id="type"><option '+(i.type==="Initiale"?"selected":"")+'>Initiale</option><option '+(i.type==="Recyclage"?"selected":"")+'>Recyclage</option></select></label></div><label class="fields" style="display:block;margin-top:12px;font-size:14px;font-weight:700;color:var(--muted)">Attributions, environnement et restrictions envisagés par l’employeur<textarea id="perimetre" placeholder="Installations, domaine de tension, opérations, limites…">'+E(i.perimetre)+'</textarea></label>'}
function renderTrainer(){
 A.innerHTML=hero("Espace formateur / V6",DEMO?"Test technique — dossier fictif":"Poste de travail du formateur",DEMO?"Une seule situation suffit pour tester la chaîne PDF. Aucun document ne constitue une attestation valable.":"Identifiez le stagiaire, importez la théorie, évaluez les situations et signez l’avis PROMEO.")+
 '<section class="panel"><div class="eyebrow">01 / Théorie</div><h2>Importer le PDF de l’apprenti</h2><div class="filebox"><label for="theoryFile"><b>Fichier PDF de théorie</b></label><input id="theoryFile" type="file" accept="application/pdf,.pdf"><p id="importMessage" role="status" class="'+(T.source?"success":"muted")+'" style="margin:9px 0 0">'+E(T.importMessage||"Aucun fichier importé.")+'</p></div>'+(T.file?'<div class="toolbar" style="margin-top:10px"><button id="openTheory" type="button">Ouvrir le PDF importé</button><button id="removeTheory" type="button" class="secondary">Retirer le PDF</button></div>':'')+
 '<p class="fine">Pour un PDF issu de la V5, les réponses intégrées sont recalculées. Le document d’origine reste annexé. Le fichier n’est ni authentifié ni envoyé vers un serveur.</p>'+(T.file?'<label class="checkline"><input id="verified" type="checkbox" '+(T.verified?"checked":"")+'>J’ai contrôlé le PDF original, l’identité, les résultats et les conditions de réalisation du test. Pour un PDF externe, j’ai vérifié les résultats reportés et les critères de réussite applicables.</label>':'')+'</section>'+
 '<section class="panel"><div class="eyebrow">02 / Identification</div><h2>Informations du dossier</h2>'+trainerFields()+'</section><section class="panel"><div class="eyebrow">03 / Périmètre</div><h2>Symboles faisant l’objet de l’évaluation</h2><p class="muted">Cochez les symboles à évaluer. Les grilles Word fournies sont utilisées pour les symboles couverts. Les autres restent à compléter (aucun avis favorable possible). Chaque indice BE Essai ou BE Mesurage exige deux situations propres en mode réel.</p>'+profilePicker(T.profiles,DEMO?Object.keys(PRACTICE):null)+'<label class="fields" style="display:block;font-size:14px;font-weight:700;margin-top:14px">Titre(s) demandé(s) par l’entreprise<input id="titresDemandes" maxlength="400" value="'+E(T.identity.titresDemandes)+'" placeholder="'+E(T.profiles.map(get).join(", "))+'"></label><p class="fine">Si ce champ reste vide, les symboles cochés sont repris comme demande de l’entreprise. Si la demande est différente, précisez-la ici : aucun avis favorable global ne sera déduit à tort.</p></section><div id="practiceArea"></div>'+
 '<section class="panel"><div class="eyebrow">05 / Dossier final</div><h2>Générer l’avis après formation</h2><div class="info">Modèle PROMEO « Avis après formation » fourni : titre(s) demandé(s), avis favorable / défavorable, autre proposition, champ d’application et signature. Les évaluations restent annexées au dossier complet.</div><div id="avisPreview" class="notice" role="status"></div><label class="fields" style="font-size:14px;font-weight:700;color:var(--muted)">Observations globales / restrictions<textarea id="scopeNotes" placeholder="Précisions, limites d’activité, compléments de formation, contexte…">'+E(T.scopeNotes)+'</textarea></label><div class="notice">'+E(pilot)+'</div><label class="checkline"><input id="reviewed" type="checkbox" '+(T.reviewed?"checked":"")+'>Je confirme avoir relu le dossier, les titres demandés par l’entreprise, les dates, le champ d’application proposé et les avis. Les informations correspondent à mes observations. Je signe ensuite l’avis en connaissance de cause.</label>'+signatureMarkup()+'<p id="error" role="alert" class="error"></p><div class="sticky-summary row"><span id="overallStatus" class="muted"></span><div class="toolbar"><button id="resetTrainer" class="secondary">Nouveau dossier</button><button id="generateAvis" class="secondary">Télécharger l’avis PROMEO seul</button><button id="generate" class="primary">Générer le dossier PDF complet</button></div></div></section>'+footer();
 $("theoryFile").onchange=async e=>{const file=e.target.files?.[0];if(file&&!DEMO)await importPDF(file)};
 if($("openTheory"))$("openTheory").onclick=()=>{const u=URL.createObjectURL(new Blob([T.file.bytes],{type:"application/pdf"}));window.open(u,"_blank","noopener,noreferrer");setTimeout(()=>URL.revokeObjectURL(u),120000)};
 if($("removeTheory"))$("removeTheory").onclick=()=>{if(confirm("Retirer le PDF et les résultats théoriques associés ? Les observations pratiques restent en mémoire.")){T.file=null;T.source=null;T.external={};T.verified=false;invalidateSignatureReview();T.importMessage="PDF retiré.";for(const g of Object.values(T.practice))if(g.opinion==="favorable")g.opinion="incomplet";renderTrainer()}};
 if($("verified"))$("verified").onchange=e=>{T.verified=e.target.checked;invalidateSignatureReview();$("reviewed").checked=false;renderPractices()};
 Object.keys(T.identity).forEach(k=>{const el=$(k);if(el)el.oninput=()=>{T.identity[k]=el.value;invalidateSignatureReview();$("reviewed").checked=false;if(["nom","prenom","groupe"].includes(k)){if(T.source&&!identityMatch()){T.verified=false;if($("verified"))$("verified").checked=false}renderPractices()}else updateOverall()}});
 A.querySelectorAll('input[name=profile]').forEach(x=>x.onchange=()=>{T.profiles=chosen();if($("titresDemandes"))$("titresDemandes").placeholder=T.profiles.map(get).join(", ");invalidateSignatureReview();$("reviewed").checked=false;renderPractices()});
 $("scopeNotes").oninput=e=>{T.scopeNotes=e.target.value;invalidateSignatureReview();$("reviewed").checked=false};
 $("reviewed").onchange=e=>{if(e.target.checked){T.reviewed=true;refreshSignatureUI()}else invalidateSignatureReview();updateOverall()};
 for(const role of ["trainer","learner"])initSignaturePad(role);refreshSignatureUI();
 $("generate").onclick=()=>actionPDF($("generate"),async()=>{A.inert=true;try{await trainerPDF(false)}finally{A.inert=false}});
 $("generateAvis").onclick=()=>actionPDF($("generateAvis"),async()=>{A.inert=true;try{await trainerPDF(true)}finally{A.inert=false}});
 $("resetTrainer").onclick=()=>newTrainerDraft();
 renderPractices();mountWorkspace();updateOverall();
}
async function importPDF(file){
 if(DEMO)return;
 try{
  if(file.size>30*1024*1024)throw Error("PDF trop volumineux : limite 30 Mo.");const {PDFDocument}=requirePdf(),bytes=new Uint8Array(await file.arrayBuffer()),pdf=await PDFDocument.load(bytes);
  if(!pdf.getPageCount())throw Error("PDF vide.");let source=null,message;
  const packet=decodePacket(pdf.getSubject());if(packet){source=validatePacket(packet);message="PDF V5 reconnu · "+pdf.getPageCount()+" page(s) · "+source.packet.id+" · résultats recalculés."}
  else message="PDF externe importé · "+pdf.getPageCount()+" page(s). Renseignez manuellement les résultats pour chaque symbole, puis contrôlez-les.";
  const replace=T.file||T.profiles.length||Object.values(T.practice).some(g=>g.situations.some(s=>s.title||s.criteria.some(c=>c.mark)));
  if(replace&&!confirm("Remplacer la théorie et repartir sur un nouveau dossier pratique ? Les observations et avis en cours seront effacés.")){renderTrainer();return}
  if(replace){Object.assign(T.identity,{entreprise:"",perimetre:"",titresDemandes:"",datesFormation:"",dureeFormation:"",datePratique:today(),dureeTheorie:"",dureePratique:""});T.scopeNotes=""}
 v6Undo=null;v6Profile=null;v6Situation={};T.file={bytes,name:file.name,pages:pdf.getPageCount()};T.source=source;T.external={};T.practice={};T.profiles=source?[...source.packet.profiles]:[];T.verified=false;invalidateSignatureReview();T.importMessage=message;
  if(source){Object.assign(T.identity,source.packet.identity,{dateTheorie:source.packet.date.slice(0,10)})}else{Object.assign(T.identity,{nom:"",prenom:"",groupe:""})}
  renderTrainer();
 }catch(e){T.importMessage="Import impossible : "+e.message;if($("importMessage"))$("importMessage").textContent=T.importMessage;showError(T.importMessage)}
}

function countText(counts){return ["A","B","C","D"].map(k=>k+" : "+counts[k]).join(" · ")+" · Non renseignés : "+counts.unseen}
function situationBadge(s){return s.failed?status("Critères non satisfaits","bad"):s.pass?status("Critères satisfaits","good"):status("À compléter","wait")}
function practiceBadge(s){return !s.template?status("Grille manquante","wait"):s.failed?status("Pratique non réussie","bad"):s.practicePassed?status("Pratique réussie","good"):status("Pratique à compléter","wait")}
function markButtons(p,n,c,i){return '<div class="mark-buttons" role="radiogroup" aria-label="Notation du critère '+(i+1)+'">'+Object.entries(marks).map(([k,v])=>'<label class="mark-button mark-'+k+'" title="'+E(k+" : "+v)+'"><input type="radio" name="mark-'+E(p)+'-'+n+'-'+i+'" value="'+k+'" data-mark="'+i+'" '+(c.mark===k?"checked":"")+'><span>'+k+'</span></label>').join("")+'<button type="button" class="clear-mark" data-clear-mark="'+i+'" title="Effacer la notation" aria-label="Effacer la notation du critère '+(i+1)+'">×</button></div>'}
function renderPractices(){
 const area=$("practiceArea");if(!area)return;
 if(!T.profiles.length){area.innerHTML='<section class="panel"><div class="eyebrow">04 / Pratique</div><h2>Aucun symbole sélectionné</h2><p class="muted">Sélectionnez un ou plusieurs symboles dans Identité et périmètre pour afficher les grilles.</p><button class="secondary" id="goIdentity">Choisir les symboles</button></section>';$("goIdentity").onclick=()=>setStage("identity");updateOverall();return}
 area.innerHTML=T.profiles.map((p,n)=>{const g=gridFor(p),s=gridStatus(p),r=s.r,t=s.template;if(g.opinion==="favorable"&&!s.possible)g.opinion="incomplet";
 let manual="";if(importState()==="external"){const x=T.external[p]||{};manual='<div class="grid fields"><label>Bonnes réponses<input type="number" min="0" max="10000" step="1" data-manual="good" value="'+E(x.good??"")+'"></label><label>Nombre de questions<input type="number" min="15" max="10000" step="1" data-manual="total" value="'+E(x.total??"")+'"></label><label>Erreur critique constatée ?<select data-manual="critical"><option value="unknown" '+(!x.critical||x.critical==="unknown"?"selected":"")+'>À vérifier</option><option value="0" '+(x.critical==="0"?"selected":"")+'>Non</option><option value="1" '+(x.critical==="1"?"selected":"")+'>Oui</option></select></label></div>'}
 const desc=!r?"Résultat théorique absent":theoryLabel(r)+" · "+r.good+"/"+r.total+" ("+r.pct+" %)"+(r.critical===null?" · critiques à vérifier":" · critiques : "+r.critical);
 let body="";
 if(t){
 body='<details class="source-objectives"><summary>Objectifs de la grille '+E(t.source)+' ('+t.objectives.length+')</summary><ul>'+t.objectives.map(o=>'<li>'+E(o)+'</li>').join("")+'</ul></details><div class="info"><b>'+minimum(p)+' mise(s) en situation minimum</b> · '+E(PRACTICE_RULE)+(DEMO?" · Test uniquement : minimum réel "+t.min:"")+'</div><div class="mark-legend">'+Object.entries(marks).map(([k,v])=>'<span><b class="legend-'+k+'">'+k+'</b> '+E(v)+'</span>').join("")+'</div>'+
 g.situations.map((sit,si)=>'<article class="situation" data-situation="'+si+'"><div class="row"><h3>Mise en situation n°'+(si+1)+'</h3><div data-sit-badge>'+situationBadge(situationStatus(sit))+'</div></div><label class="fields" style="display:block;font-size:14px;font-weight:700">Intitulé de la mise en situation *<input data-title maxlength="240" placeholder="Intitulé de la situation réalisée" value="'+E(sit.title)+'"></label><div class="practice-indicators"><div class="practice-table-head"><span>Indicateurs</span><span>Notation A / B / C / D</span></div>'+sit.criteria.map((c,i)=>'<div class="criterion"><div><strong>'+E(String(i+1)+". "+c.text)+'</strong><details class="criterion-note" '+(c.note?"open":"")+'><summary>'+(c.note?"Observation saisie":"Ajouter une observation")+'</summary><input data-note="'+i+'" placeholder="Observation facultative" maxlength="300" value="'+E(c.note)+'" aria-label="Observation du critère '+(i+1)+'"></details></div>'+markButtons(p,si,c,i)+'</div>').join("")+'</div><div class="grade-summary" data-sit-summary>'+E(countText(situationStatus(sit).counts))+'</div><label class="fields" style="display:block;font-size:14px;font-weight:700">Observations de la situation<textarea data-sit-observations placeholder="Observations facultatives">'+E(sit.observations)+'</textarea></label>'+'<button type="button" class="secondary remove-situation" data-remove-situation="'+si+'">Supprimer cette mise en situation</button>'+'</article>').join("")+
 (g.situations.length===0?'<div class="notice">Aucune situation renseignée. Ajoutez une mise en situation pour poursuivre.</div>':'')+'<button type="button" data-add-situation class="secondary">+ Ajouter une mise en situation</button>';
 if(p==="B2V_Essai")body='<div class="notice">Grille pratique B2V Essai distincte de B2V et BE Essai. Aucun QCM V5 spécifique disponible ; utilisez un PDF théorique externe couvrant explicitement B2V Essai et renseignez ses résultats.</div>'+body;
 if(p==="BC")body='<div class="notice">Le document BC mentionne une consignation en une étape dans les objectifs, mais une première étape et l’APEC dans les indicateurs. Les formulations originales sont conservées ; à vérifier avec votre référent.</div>'+body;
 }else body='<div class="notice">Aucune des dix grilles fournies ne couvre explicitement ce symbole. La grille générique est retirée : aucun avis favorable ne peut être émis avant l’intégration de la grille correspondante.</div>';
 return '<section class="panel" data-profile="'+E(p)+'"><div class="row"><div><div class="eyebrow">04 / Pratique · '+(n+1)+' / '+T.profiles.length+'</div><h2>'+E(get(p))+'</h2><p class="muted">'+(t?'Source : '+E(t.source):'Grille non fournie')+'</p></div>'+status(desc,r?(r.passed?"good":"bad"):"wait")+'</div>'+manual+
 (!s.positive?'<div class="notice">La théorie doit être positive et contrôlée pour permettre un avis favorable. Vous pouvez toutefois renseigner les observations pratiques.</div>':'<div class="info">Théorie positive et contrôlée.</div>')+
 body+'<div class="grade-summary" data-summary></div><div data-review-status class="v6-review-state" role="status"></div>'+'<details class="avis-scope"><summary>Champ d’application proposé dans l’avis PROMEO (facultatif)</summary><div class="grid fields"><label>Domaine / tensions précisées<input data-avis="avisTension" maxlength="100" placeholder="'+E(P[p].domain)+'" value="'+E(g.avisTension)+'"></label><label>Ouvrages ou installations concernés<textarea data-avis="avisOuvrages" maxlength="280" placeholder="À préciser par l’employeur si inconnu">'+E(g.avisOuvrages)+'</textarea></label><label>Indications supplémentaires<textarea data-avis="avisIndications" maxlength="240" placeholder="Restrictions ou précisions spécifiques à ce symbole">'+E(g.avisIndications)+'</textarea></label></div><p class="fine">Ces champs ne sont reportés au tableau de proposition que pour les symboles bénéficiant d’un avis favorable.</p></details>'+
 '<label class="fields" style="display:block;font-size:14px;font-weight:700;color:var(--muted)">Observations pratiques globales<textarea data-field="observations" placeholder="Écarts, points forts, reprises nécessaires…">'+E(g.observations)+'</textarea></label><div class="grid fields" style="margin-top:10px"><label>Avis explicite du formateur<select data-opinion><option value="incomplet" '+(g.opinion==="incomplet"?"selected":"")+'>À compléter</option><option value="favorable" '+(g.opinion==="favorable"?"selected ":"")+(s.possible?"":"disabled")+'>Favorable</option><option value="defavorable" '+(g.opinion==="defavorable"?"selected":"")+'>Défavorable</option></select></label><label>Restrictions / suites / justification<textarea data-field="reserve" placeholder="Préciser les limites ou les actions nécessaires…">'+E(g.reserve)+'</textarea></label></div></section>'
 }).join("");
 area.querySelectorAll("[data-profile]").forEach(el=>{const p=el.dataset.profile,g=gridFor(p),t=PRACTICE[p];
  const invalidate=()=>{invalidateSignatureReview();$("reviewed").checked=false};
  const change=()=>{g.opinion="incomplet";invalidate();refreshPractice(p,el)};
  const commentChange=()=>{invalidate();refreshPractice(p,el)};
  el.querySelectorAll("[data-situation]").forEach(box=>{const si=Number(box.dataset.situation),sit=g.situations[si];
    box.querySelector("[data-title]").oninput=e=>{sit.title=e.target.value;change()};
    box.querySelector("[data-sit-observations]").oninput=e=>{sit.observations=e.target.value;commentChange()};
    box.querySelectorAll("[data-mark]").forEach(x=>x.onchange=()=>{if(x.checked){sit.criteria[Number(x.dataset.mark)].mark=x.value;change()}});
    box.querySelectorAll("[data-clear-mark]").forEach(x=>x.onclick=()=>{const j=Number(x.dataset.clearMark);sit.criteria[j].mark="";box.querySelectorAll('[data-mark="'+j+'"]').forEach(r=>r.checked=false);change()});
    box.querySelectorAll("[data-note]").forEach(x=>x.oninput=()=>{sit.criteria[Number(x.dataset.note)].note=x.value;commentChange()});
    const remove=box.querySelector("[data-remove-situation]");if(remove)remove.onclick=()=>{const remaining=g.situations.length-1,missing=Math.max(0,minimum(p)-remaining),hasData=!!(sit.title.trim()||sit.observations.trim()||sit.criteria.some(c=>c.mark||c.note.trim()));const message="Supprimer la mise en situation n°"+(si+1)+" de "+get(p)+" ?"+(hasData?"\nLes notes et observations seront retirées. Vous pourrez annuler la dernière suppression tant que le dossier reste ouvert.":"")+(missing?"\nIl manquera "+missing+" situation(s) pour atteindre le minimum de la grille. L’avis favorable restera bloqué.":"");if(confirm(message)){const removed={p,index:si,situation:sit,grid:g};if(removeSituation(p,si)){v6Undo=removed;v6Situation[p]=Math.max(0,Math.min(si,g.situations.length-1));renderPractices()}}};
  });
  const add=el.querySelector("[data-add-situation]");if(add)add.onclick=()=>{if(g.situations.length>=12)return alert("12 situations maximum.");g.situations.push(newSituation(p));v6Situation[p]=g.situations.length-1;g.opinion="incomplet";invalidate();renderPractices()};
  el.querySelectorAll("[data-field]").forEach(x=>x.oninput=()=>{g[x.dataset.field]=x.value;commentChange()});
  el.querySelectorAll("[data-avis]").forEach(x=>x.oninput=()=>{g[x.dataset.avis]=x.value;invalidate();updateOverall()});
  el.querySelector("[data-opinion]").onchange=e=>{const v=e.target.value;g.opinion=v==="favorable"&&!gridStatus(p).possible?"incomplet":v;invalidate();refreshPractice(p,el)};
  el.querySelectorAll("[data-manual]").forEach(x=>x.onchange=()=>{T.external[p]??={};T.external[p][x.dataset.manual]=x.dataset.manual==="critical"?x.value:x.value===""?null:Number(x.value);T.verified=false;if($("verified"))$("verified").checked=false;g.opinion="incomplet";invalidate();renderPractices()});
  refreshPractice(p,el);
 });mountPracticeTabs();updateOverall();
}
function refreshPractice(p,el){const g=gridFor(p),s=gridStatus(p),op=el.querySelector("[data-opinion]");if(!s.possible&&g.opinion==="favorable")g.opinion="incomplet";op.querySelector('option[value="favorable"]').disabled=!s.possible;op.value=g.opinion;
 const review=el.querySelector("[data-review-status]"),d=decisionReview(p);if(review){review.innerHTML=reviewBadge(p)+(d.closed&&d.negative?(d.stopped?'<p class="fine">Échec constaté : la clôture est défavorable, les autres éléments restent non évalués.</p>':'<p class="fine">L’évaluation est clôturée avec un avis défavorable, sans validation du symbole.</p>'):(d.blockers.length?'<p class="fine">'+E(d.blockers.join(" · "))+'</p>':""))}
 el.querySelectorAll("[data-situation]").forEach(box=>{const z=s.situations[Number(box.dataset.situation)];box.querySelector("[data-sit-badge]").innerHTML=situationBadge(z);box.querySelector("[data-sit-summary]").textContent=countText(z.counts)});
 el.querySelector("[data-summary]").innerHTML='<span>Situations satisfaites : <b>'+s.situations.filter(z=>z.pass).length+'/'+g.situations.length+'</b></span>'+practiceBadge(s)+(s.template&&g.situations.length<minimum(p)?status("Minimum non atteint : "+(minimum(p)-g.situations.length)+" situation(s) manquante(s)","bad"):"")+(s.practicePassed&&!s.positive?status("Théorie à contrôler","wait"):"");updateOverall()}


function avisProfiles(){
 return T.profiles.map(id=>{const g=gridFor(id),s=gridStatus(id);return {id,name:get(id),domain:P[id].domain,opinion:g.opinion==="favorable"&&!s.possible?"incomplet":g.opinion,tension:g.avisTension.trim(),ouvrages:g.avisOuvrages.trim(),indications:g.avisIndications.trim()}});
}
function requestedTitles(){return T.identity.titresDemandes.trim()||T.profiles.map(get).join(", ")}
function avisStatus(){
 const profiles=avisProfiles();
 if(!profiles.length)return "Avis PROMEO : sélectionnez les symboles évalués.";
 if(profiles.some(p=>p.opinion==="incomplet"))return "Avis PROMEO : terminez les avis par symbole avant de signer.";
 if(!window.HAB_AVIS)return "Le modèle PROMEO n'est pas chargé. Actualisez la page.";
 const a=window.HAB_AVIS.decision(requestedTitles(),profiles);
 return "Demande : "+requestedTitles()+" | "+(a.ok?"Avis favorable":a.rejected?"Avis défavorable à la demande complète":"Autre proposition / demande distincte")+" | Symboles proposés : "+(a.positive.map(p=>p.name).join(", ")||"Aucun")+(a.other?" | "+a.other:"");
}

function validateAvis(){
 if(!window.HAB_AVIS)throw Error("Le modèle PROMEO n’a pas pu être chargé. Actualisez la page.");
 if(!T.verified)throw Error("Confirmez le contrôle du PDF théorique et de ses conditions de réalisation.");
 for(const p of T.profiles){const d=decisionReview(p);if(!d.closed)throw Error(get(p)+" : "+d.blockers.join(" ; ")+".")}
}

function avisPayload(signature){
 const i=T.identity,dates=i.datesFormation.trim()||(i.dateTheorie===i.datePratique?dateFmt(i.dateTheorie):"Théorie : "+dateFmt(i.dateTheorie)+" / Pratique : "+dateFmt(i.datePratique));
 const duration=i.dureeFormation.trim()||"Théorie : "+i.dureeTheorie+" + pratique : "+i.dureePratique;
 const comments=[T.scopeNotes.trim(),i.perimetre.trim()].filter(Boolean);
 for(const id of T.profiles){const g=gridFor(id),s=gridStatus(id);
  if(g.opinion==="defavorable"){const reasons=decisionReview(id).reasons;comments.push(get(id)+" : "+reasons.join(" / "))}
  else if(g.reserve.trim())comments.push(get(id)+" : "+g.reserve.trim());
 }
 return {nom:i.nom,prenom:i.prenom,entreprise:i.entreprise,organisme:i.organisme,lieu:i.lieu,dates,duree:duration,stage:i.stage,requested:requestedTitles(),profiles:avisProfiles(),comments,formateur:i.formateur,fonction:i.fonction,signature};
}

function updateOverall(){refreshWorkspace();refreshPracticeTabs();scheduleDraft();if($("avisPreview"))$("avisPreview").textContent=avisStatus();const el=$("overallStatus");if(!el)return;const fav=T.profiles.filter(p=>gridFor(p).opinion==="favorable"&&gridStatus(p).possible).length;el.textContent=T.profiles.length+" symbole(s) · "+fav+" avis favorable(s) · "+(T.file?"PDF théorique joint":"PDF théorique absent")+" · "+(validSignature("trainer")?"Formateur signé":"Signature formateur requise");refreshSignatureUI()}
async function trainerPDF(onlyAvis=false,returnBytes=false){
 if(!T.file)throw Error("Importez le PDF théorique avant de générer le dossier final.");
 if(!T.profiles.length)throw Error("Sélectionnez au moins un symbole.");
 const req=["nom","prenom","groupe","entreprise","organisme","lieu","formateur","fonction","dateTheorie","datePratique","dureeTheorie","dureePratique","stage"];
 const missing=req.filter(k=>!T.identity[k]?.trim());if(missing.length)throw Error("Complétez tous les champs obligatoires (*) de l’identification et de la formation.");
 if(!identityMatch())throw Error("L’identité saisie ne correspond pas au PDF V5 importé. Corrigez les champs ou importez le bon fichier.");
 if(!T.reviewed)throw Error("Confirmez la relecture du dossier avant de générer le PDF.");
 const trainerSigned=validSignature("trainer"),learnerSigned=validSignature("learner");if(!trainerSigned)throw Error("Tracez et validez la signature du formateur avant de générer le PDF.");
 const fav=T.profiles.filter(p=>gridFor(p).opinion==="favorable"&&gridStatus(p).possible);if(T.profiles.some(p=>gridFor(p).opinion==="favorable"&&!gridStatus(p).possible))throw Error("Un avis favorable est incompatible avec les critères de réussite.");
 validateAvis();
 const i=T.identity,ref=T.source?.packet.id||("EXT-"+Date.now().toString(36).toUpperCase());
 const avisDoc=await window.HAB_AVIS.create(avisPayload(trainerSigned),requirePdf());
 if(onlyAvis){if(DEMO)await watermarkDemo(avisDoc);const bytes=await avisDoc.save(),name=(DEMO?"DEMONSTRATION_":"")+"AVIS_PROMEO_"+safeName(i.nom)+"_"+safeName(i.prenom)+".pdf";if(returnBytes)return {bytes,name};download(bytes,name);return}
 const b=await pdfBuilder("Dossier des évaluations","Annexes théorie et pratique / avis signé",ref);
 b.doc.setTitle("Avis après formation - "+i.nom+" "+i.prenom);b.doc.setAuthor(i.organisme);b.doc.setSubject("Avis après formation préalable à l'habilitation électrique - V5 pilote");
 b.heading("01 / Identification de l'apprenti et de la formation");
 b.text(identityLine(i),{weight:true,size:12});b.text("Entreprise : "+(i.entreprise||"Non renseignée"));b.text("Organisme : "+i.organisme+"  |  Lieu : "+i.lieu);b.text("Stage : "+i.stage+"  |  Type : "+i.type);b.text("Théorie : "+dateFmt(i.dateTheorie)+" - "+i.dureeTheorie+"  |  Pratique : "+dateFmt(i.datePratique)+" - "+i.dureePratique);b.text("Formateur / signataire : "+i.formateur+" - "+i.fonction);b.text("Attributions et périmètre envisagés : "+(i.perimetre||"À préciser par l'employeur"));
 b.heading("02 / Synthèse des résultats et avis par symbole");
 for(const p of T.profiles){const g=gridFor(p),s=gridStatus(p),r=s.r;b.text(get(p)+"  |  Avis : "+ops[g.opinion],{weight:true,size:11,gap:3});b.text("Théorie : "+(r?r.good+"/"+r.total+" ("+r.pct+" %) / "+theoryLabel(r):"Non renseignée")+"  |  Pratique : "+(s.template?(s.failed?"Non réussie":s.practicePassed?"Réussie":"À compléter")+" ("+s.situations.filter(z=>z.pass).length+"/"+g.situations.length+" situations satisfaites)":"Grille non fournie"),{size:9,gap:4});if(g.reserve)b.text("Restrictions / suites : "+g.reserve,{size:9,gap:6})}
 b.heading("03 / Recommandations et visa");b.text("Titre(s) demandé(s) par l’entreprise : "+requestedTitles(),{weight:true});b.text("Symboles faisant l'objet d'un avis favorable : "+(fav.map(get).join(" ; ")||"Aucun"),{weight:true});b.text("Observations globales : "+(T.scopeNotes||"Aucune observation globale renseignée."));b.text("Le titre d'habilitation relève de l'employeur (article R. 4544-10 du Code du travail). Ce document est un avis après formation, et non un titre. Version pilote : validation institutionnelle requise avant usage officiel.",{size:9});b.text("L’avis PROMEO signé est en tête du dossier ; les visas du formateur et de l’apprenti figurent aussi avant l’annexe théorique.",{size:9});

 for(const p of T.profiles){
 const g=gridFor(p),s=gridStatus(p),r=s.r,t=s.template;b.newPage();b.heading("04 / Grille pratique - "+get(p));b.text("Source : "+(t?t.source+" - grille Word fournie":"Grille non fournie"),{weight:true});b.text("Théorie : "+(r?r.good+"/"+r.total+" ("+r.pct+" %) / "+theoryLabel(r):"Non renseignée")+" ; contrôle formateur : "+(T.verified?"déclaré effectué":"non confirmé"),{size:9});
 if(t){b.text("Minimum de la grille réelle : "+t.min+(DEMO?" | TEST TECHNIQUE : minimum simulé 1":"")+" | "+PRACTICE_RULE,{weight:true});b.text("A : sans erreur ; B : erreur acceptable ; C : erreur majeure ; D : erreur grave.",{size:9});b.section("Objectifs des mises en situations pratiques");for(const objective of t.objectives)b.text("- "+objective,{size:9,gap:3});
 if(p==="BC")b.text("Note : l'objectif et l'indicateur relatifs à la consignation diffèrent dans le document source. Formulations conservées ; à vérifier avec le référent.",{size:9});
 for(let j=0;j<g.situations.length;j++){const sit=g.situations[j],z=s.situations[j];b.newPage();b.heading(get(p)+" - Mise en situation n°"+(j+1));b.text("Intitulé : "+(sit.title||"Non renseigné"),{weight:true});b.text(PRACTICE_RULE,{size:9});for(let k=0;k<sit.criteria.length;k++){const c=sit.criteria[k];b.text((k+1)+". "+c.text,{weight:true,size:10,gap:2});b.text("Notation : "+(marks[c.mark]?c.mark+" - "+marks[c.mark]:"Non renseignée")+(c.note?"  |  "+c.note:""),{size:9,gap:6})}b.text(countText(z.counts),{weight:true});b.text("Bilan de la situation : "+(z.failed?"Critères non satisfaits":z.pass?"Critères satisfaits":"À compléter"),{weight:true});b.text("Observations : "+(sit.observations||"Non renseignées"),{size:9});}
 }else b.text("Aucun avis favorable autorisé tant que la grille correspondant au symbole n'est pas fournie.",{weight:true});
 b.heading("Bilan pratique et avis");b.text(t?"Situations satisfaites : "+s.situations.filter(z=>z.pass).length+"/"+g.situations.length+" ; minimum réel "+t.min+(DEMO?" ; minimum de test 1":"")+" ; bilan : "+(s.failed?"Non réussie":s.practicePassed?"Réussie":"À compléter"):"Grille non fournie",{weight:true});if(t)b.text("Critères d'acceptation : "+PRACTICE_RULE+" Toutes les situations doivent être renseignées et satisfaisantes. L'avis favorable requiert aussi une théorie positive et contrôlée.",{size:9});b.text("Observations globales : "+(g.observations||"Non renseignées"));b.text("Avis du formateur : "+ops[g.opinion],{weight:true});b.text("Restrictions / suites : "+(g.reserve||"Non renseignées"));
 }

 b.newPage();b.heading("05 / Signatures et validation de l'avis");b.text(identityLine(i),{weight:true,size:12});b.text("Référence du dossier : "+ref);b.text("Avis favorables : "+(fav.map(get).join(" ; ")||"Aucun"));b.text("Le formateur confirme avoir relu le dossier et ses observations. La signature de l'apprenti, si présente, atteste uniquement sa prise de connaissance.",{size:10});await b.signature("Formateur / signataire de l'avis",i.formateur+" - "+i.fonction,trainerSigned);await b.signature("Apprenti / prise de connaissance (facultatif)",i.nom+" "+i.prenom,learnerSigned);b.text("Signatures manuscrites numérisées, sans certificat électronique ni horodatage de confiance. Le titre d'habilitation relève de l'employeur.",{size:9});
 b.newPage();b.heading("06 / Annexe - évaluation théorique originale");b.text("Fichier joint : "+T.file.name,{weight:true});b.text("Nombre de pages annexées : "+T.file.pages);b.text("Source : "+(T.source?"PDF V5 reconnu, réponses recalculées localement":"PDF externe, résultats reportés manuellement"));b.text("Contrôle des conditions de réalisation par le formateur : "+(T.verified?"confirmé":"non confirmé"));b.text("Le PDF original est reproduit à la suite de cette page. Les métadonnées d'un fichier local ne constituent pas une preuve d'authenticité.",{size:9});b.text("Références de cadrage : INRS ED 6127, sections 5.4 et 7.2 ; Code du travail, article R. 4544-10. Vérifier les référentiels et prescriptions applicables au contexte de formation.",{size:9});
 const {PDFDocument}=requirePdf(),original=await PDFDocument.load(T.file.bytes),pages=await b.doc.copyPages(original,original.getPageIndices());pages.forEach(p=>b.doc.addPage(p));
 const avisPages=await b.doc.copyPages(avisDoc,avisDoc.getPageIndices());avisPages.forEach((p,i)=>b.doc.insertPage(i,p));
 if(DEMO)await watermarkDemo(b.doc);
 const bytes=await b.doc.save(),name=(DEMO?"DEMONSTRATION_":"")+"AVIS_HABILITATION_"+safeName(i.nom)+"_"+safeName(i.prenom)+"_"+ref+".pdf";if(returnBytes)return {bytes,name};download(bytes,name);
}

/* V6 : navigation et ergonomie, sans changement des grilles ni des barèmes. */
let v6Stage="theory",v6Profile=null,v6Situation={},v6Undo=null;
const stages=[["identity","Identité & périmètre"],["theory","Théorie"],["practice","Pratique"],["final","Avis & PDF"]];
const requiredIdentity=["nom","prenom","groupe","entreprise","organisme","lieu","formateur","fonction","dateTheorie","datePratique","dureeTheorie","dureePratique","stage"];
function element(tag,cls,html=""){const e=document.createElement(tag);e.className=cls;e.innerHTML=html;return e}

function missingItems(){
 const list=[];
 const blanks=requiredIdentity.filter(k=>!T.identity[k]?.trim());
 if(blanks.length)list.push(["identity",blanks.length+" champ(s) obligatoire(s) d’identification / formation à renseigner"]);
 if(!T.profiles.length)list.push(["identity","Sélectionner les symboles à évaluer"]);
 if(!T.file)list.push(["theory","Importer le PDF théorique"]);else if(!T.verified)list.push(["theory","Contrôler le résultat théorique et les conditions de réalisation"]);
 if(T.file&&!identityMatch())list.push(["identity","Corriger l’identité : elle diffère du PDF théorique"]);
 for(const p of T.profiles)for(const issue of decisionReview(p).blockers)list.push(["practice",get(p)+" : "+issue,p]);
 return list;
}

function setStage(stage,scroll=true){
 if(!stages.some(x=>x[0]===stage))return;v6Stage=stage;
 A.querySelectorAll("[data-v6-stage]").forEach(e=>e.hidden=e.dataset.v6Stage!==stage);
 A.querySelectorAll("[data-stage-link]").forEach(e=>{const active=e.dataset.stageLink===stage;e.classList.toggle("active",active);if(active)e.setAttribute("aria-current","step");else e.removeAttribute("aria-current")});
 if(scroll)window.scrollTo({top:0,behavior:"smooth"});
 refreshWorkspace();refreshPracticeTabs();
}
function mountWorkspace(){
 const root=A;const direct=[...root.children];const hero=direct.find(n=>n.classList.contains("hero")),sections=direct.filter(n=>n.tagName==="SECTION"),area=$("practiceArea"),foot=direct.find(n=>n.tagName==="FOOTER");
 if(sections.length!==4||!area)return;
 const [theory,identity,scope,final]=sections;
 const banner=element("div","v6-dossier",'<div><div class="eyebrow">Dossier individuel</div><h2 id="v6Name">Nouveau dossier</h2><p class="muted" id="v6Identity"></p></div><div class="v6-progressbox"><div class="row"><span>Avancement des étapes</span><b id="v6Percent">0/4</b></div><div class="progress" aria-hidden="true"><i id="v6Progress"></i></div><small id="v6DraftState" role="status">Brouillon en mémoire de l’onglet</small></div>');
 root.insertBefore(banner,hero.nextSibling);
 const nav=element("nav","v6-steps",stages.map(([id,label],i)=>'<button type="button" data-stage-link="'+id+'"><span class="v6-stepno">'+(i+1)+'</span><span><b>'+label+'</b><small data-step-state="'+id+'">À compléter</small></span></button>').join(""));nav.setAttribute("aria-label","Étapes du dossier");banner.after(nav);
 const error=$("error");if(error){error.classList.add("v6-error");nav.after(error)}
 const layout=element("div","v6-layout");root.insertBefore(layout,theory);
 const aside=element("aside","v6-sidebar",'<section class="panel"><h3>Suivi du dossier</h3><div id="v6SymbolSummary"></div><div id="v6Checklist"></div></section><section class="panel v6-draft"><h3>Brouillon local</h3><p class="fine">Sur ce navigateur uniquement. PDF et données nominatives restent sur ce poste. N’activez pas la sauvegarde sur un poste partagé. Les signatures ne sont jamais conservées.</p><button type="button" id="v6SaveDraft" class="secondary">Activer la sauvegarde locale</button><button type="button" id="v6RestoreDraft" class="secondary">Reprendre un brouillon</button><button type="button" id="v6EraseDraft" class="secondary">Effacer le brouillon enregistré</button><button type="button" id="v6NewDraft" class="secondary">Nouveau dossier</button></section>');
 const content=element("div","v6-content");layout.append(content,aside);
 for(const [id,nodes] of [["identity",[identity,scope]],["theory",[theory]],["practice",[area]],["final",[final]]]){
 const block=element("div","v6-stage");block.dataset.v6Stage=id;nodes.forEach(n=>block.append(n));
 const k=stages.findIndex(x=>x[0]===id),buttons=element("div","v6-stage-nav",'<span>'+(k>0?'<button type="button" class="secondary" data-stage-link="'+stages[k-1][0]+'">← '+stages[k-1][1]+'</button>':'')+'</span>'+(k<3?'<button type="button" class="primary" data-stage-link="'+stages[k+1][0]+'">'+stages[k+1][1]+' →</button>':''));
 block.append(buttons);content.append(block);
 }
 if(foot)root.append(foot);
 const reviewed=$("reviewed");if(reviewed){const controls=element("div","v6-previewbar",'<h3>Relire avant de signer</h3><p class="fine">Affiche le véritable avis PDF en brouillon, sans signature. Terminez les avis et les informations requises pour le prévisualiser.</p><button type="button" id="v6Preview" class="secondary">Prévisualiser l’avis PROMEO</button>');reviewed.closest("label").before(controls);$("v6Preview").onclick=()=>actionPDF($("v6Preview"),previewAvis)}
 root.querySelectorAll("[data-stage-link]").forEach(e=>e.onclick=()=>setStage(e.dataset.stageLink));
 $("v6SaveDraft").onclick=()=>activateDraft();
 $("v6RestoreDraft").onclick=()=>restoreDraft();
 $("v6EraseDraft").onclick=()=>eraseDraft();
 $("v6NewDraft").onclick=()=>newTrainerDraft();
 installDemoControls(aside);setStage(v6Stage,false);draftLabel();
}
function refreshWorkspace(){
 if(!$("v6Name"))return;
 $("v6Name").textContent=[T.identity.nom,T.identity.prenom].filter(Boolean).join(" ")||"Nouveau dossier";
 $("v6Identity").textContent=[T.identity.groupe,T.identity.entreprise,T.profiles.map(get).join(" · ")].filter(Boolean).join(" / ")||"Aucun stagiaire identifié";
 const missing=missingItems(),completed={identity:!missing.some(x=>x[0]==="identity"),theory:!missing.some(x=>x[0]==="theory"),practice:T.profiles.length>0&&!missing.some(x=>x[0]==="practice"),final:!missing.length&&!!validSignature("trainer")};
 const count=Object.values(completed).filter(Boolean).length;$("v6Percent").textContent=count+"/4";$("v6Progress").style.width=count*25+"%";
 A.querySelectorAll("[data-step-state]").forEach(el=>{const id=el.dataset.stepState;const negative=id==="practice"&&completed[id]&&T.profiles.some(p=>decisionReview(p).negative);el.textContent=completed[id]?(negative?"Terminé · défavorable(s)":"Terminé"):id===v6Stage?"En cours":"À compléter";el.parentElement.parentElement.classList.toggle("step-done",completed[id]&&!negative);el.parentElement.parentElement.classList.toggle("step-negative",negative)});
 $("v6SymbolSummary").innerHTML=T.profiles.length?T.profiles.map(p=>{const g=gridFor(p),s=gridStatus(p),d=decisionReview(p),done=s.situations.filter(z=>z.complete).length,total=Math.max(g.situations.length,minimum(p),1);return '<button type="button" class="symbol-summary" data-go-symbol="'+E(p)+'"><span><b>'+E(get(p))+'</b><small>'+done+'/'+total+' situations renseignées</small></span><span class="status '+(d.closed?(d.negative?"bad":"good"):"wait")+'">'+(d.closed?(d.negative?"Défavorable":"Terminé"):"À faire")+'</span></button><div class="progress mini"><i style="width:'+Math.min(100,done/total*100)+'%"></i></div>'}).join(""):'<p class="fine">Les symboles apparaîtront ici après sélection.</p>';
 $("v6SymbolSummary").querySelectorAll("[data-go-symbol]").forEach(b=>b.onclick=()=>{v6Profile=b.dataset.goSymbol;setStage("practice");refreshPracticeTabs()});
 $("v6Checklist").innerHTML='<h4>À compléter</h4>'+(missing.length?missing.map(([id,msg,p])=>'<button type="button" class="check-task" data-go-step="'+id+'" data-go-p="'+E(p||"")+'"><span aria-hidden="true">○</span> '+E(msg)+'</button>').join(""):validSignature("trainer")?'<p class="success">Dossier prêt à exporter.</p>':'<button type="button" class="check-task" data-go-step="final">○ Relire et signer l’avis</button>');
 $("v6Checklist").querySelectorAll("[data-go-step]").forEach(b=>b.onclick=()=>{if(b.dataset.goP)v6Profile=b.dataset.goP;setStage(b.dataset.goStep);refreshPracticeTabs()});
}
function mountPracticeTabs(){
 const area=$("practiceArea");if(!area||!T.profiles.length)return;
 if(!T.profiles.includes(v6Profile))v6Profile=T.profiles[0];
 const bar=element("div","v6-profilebar",'<div class="eyebrow">Choisir une habilitation</div><div class="v6-tabs">'+T.profiles.map(p=>'<button type="button" data-v6-profile="'+E(p)+'"><b>'+E(get(p))+'</b><small data-v6-profile-status>À compléter</small></button>').join("")+'</div><div id="v6UndoBar"></div>');area.prepend(bar);
 bar.querySelectorAll("[data-v6-profile]").forEach(b=>b.onclick=()=>{v6Profile=b.dataset.v6Profile;refreshPracticeTabs()});
 area.querySelectorAll("[data-profile]").forEach(el=>{const p=el.dataset.profile,g=gridFor(p),sits=[...el.querySelectorAll("[data-situation]")];if(!sits.length)return;
 v6Situation[p]=Math.max(0,Math.min(v6Situation[p]??0,sits.length-1));
 const tabs=element("div","v6-situationbar",'<div class="eyebrow">Mises en situation</div><div class="v6-tabs">'+sits.map((_,i)=>'<button type="button" data-v6-sit="'+i+'"><b>Situation '+(i+1)+'</b><small data-v6-sit-status>À faire</small></button>').join("")+'</div>');
 sits[0].before(tabs);tabs.querySelectorAll("[data-v6-sit]").forEach(b=>b.onclick=()=>{v6Situation[p]=Number(b.dataset.v6Sit);refreshPracticeTabs()});
 for(const [i,box] of sits.entries()){
 const row=element("div","v6-sit-tools",'<p class="fine">Clavier : lorsque la notation d’un indicateur a le focus, utilisez A / B / C / D.</p><div class="toolbar"><button type="button" data-v6-reset="'+i+'" class="secondary">Réinitialiser les notes</button><button type="button" data-v6-next="'+i+'" class="primary">Situation suivante →</button></div>');box.append(row);
 row.querySelector("[data-v6-next]").onclick=()=>{if(i+1<g.situations.length){v6Situation[p]=i+1;refreshPracticeTabs()}else{const next=T.profiles[T.profiles.indexOf(p)+1];if(next){v6Profile=next;refreshPracticeTabs()}else setStage("final")}};
 row.querySelector("[data-v6-reset]").onclick=()=>{if(!confirm("Effacer les notes A/B/C/D de cette situation ? Les observations et l’intitulé restent conservés."))return;g.situations[i].criteria.forEach(c=>c.mark="");g.opinion="incomplet";invalidateSignatureReview();renderPractices()};
 box.querySelectorAll(".mark-buttons").forEach((m,j)=>m.addEventListener("keydown",e=>{if(e.ctrlKey||e.metaKey||e.altKey||!["A","B","C","D"].includes(e.key.toUpperCase()))return;const target=m.querySelector('input[value="'+e.key.toUpperCase()+'"]');if(!target)return;e.preventDefault();target.click();const next=box.querySelectorAll(".mark-buttons")[j+1]?.querySelector('input[type="radio"]');if(next)next.focus()}));
 }
 });
 refreshPracticeTabs();
}
function refreshPracticeTabs(){
 const area=$("practiceArea");if(!area||!area.querySelector(".v6-profilebar"))return;
 if(!T.profiles.includes(v6Profile))v6Profile=T.profiles[0];
 area.querySelectorAll("[data-v6-profile]").forEach(b=>{const p=b.dataset.v6Profile,s=gridStatus(p),active=p===v6Profile;b.classList.toggle("active",active);b.setAttribute("aria-pressed",String(active));const d=decisionReview(p);b.querySelector("small").textContent=d.closed?(d.negative?"Terminé · défavorable":"Terminé · favorable"):"À compléter"});
 area.querySelectorAll("[data-profile]").forEach(el=>{const p=el.dataset.profile,g=gridFor(p),s=gridStatus(p),active=p===v6Profile;el.hidden=!active;
 const idx=Math.max(0,Math.min(v6Situation[p]??0,g.situations.length-1));v6Situation[p]=idx;
 el.querySelectorAll("[data-v6-sit]").forEach(b=>{const i=Number(b.dataset.v6Sit),z=s.situations[i],on=i===idx;b.classList.toggle("active",on);b.setAttribute("aria-pressed",String(on));b.querySelector("small").textContent=z.failed?"Échec":z.pass?"Validée":z.complete?"Évaluée":"À faire"});
 el.querySelectorAll("[data-situation]").forEach(box=>{box.hidden=Number(box.dataset.situation)!==idx;const next=box.querySelector("[data-v6-next]");if(next)next.textContent=idx+1<g.situations.length?"Situation suivante →":T.profiles.indexOf(p)+1<T.profiles.length?"Habilitation suivante →":"Aller à l’avis →"});
 });
 const undo=$("v6UndoBar");if(undo){const valid=v6Undo&&T.practice[v6Undo.p]===v6Undo.grid&&T.profiles.includes(v6Undo.p)&&v6Undo.grid.situations.length<12;undo.innerHTML=valid?'<div class="info v6-undo"><span>Dernière suppression : '+E(get(v6Undo.p))+' · situation '+(v6Undo.index+1)+'</span><button type="button" class="secondary" id="undoSituation">Annuler la suppression</button></div>':'';
 if(valid)$("undoSituation").onclick=()=>{const x=v6Undo;if(!x||T.practice[x.p]!==x.grid||x.grid.situations.length>=12)return;x.grid.situations.splice(Math.min(x.index,x.grid.situations.length),0,x.situation);x.grid.opinion="incomplet";v6Profile=x.p;v6Situation[x.p]=x.index;v6Undo=null;invalidateSignatureReview();renderPractices()}}
}
async function previewAvis(){
 if(!T.file||!T.profiles.length)throw Error("Importez la théorie et sélectionnez les symboles.");
 if(requiredIdentity.some(k=>!T.identity[k]?.trim()))throw Error("Complétez les champs obligatoires de l’identification et de la formation.");
 if(!identityMatch())throw Error("L’identité diffère du PDF importé.");
 validateAvis();
 const pdf=await window.HAB_AVIS.create(avisPayload(null),requirePdf(),{preview:true});if(DEMO)await watermarkDemo(pdf);const bytes=await pdf.save(),url=URL.createObjectURL(new Blob([bytes],{type:"application/pdf"}));
 const dialog=element("dialog","v6-pdf-dialog",'<div class="row"><div><h2>Aperçu de l’avis PROMEO</h2><p class="fine">BROUILLON NON SIGNÉ — ne pas transmettre</p></div><button type="button" class="secondary" id="v6ClosePreview">Fermer</button></div><iframe title="Brouillon PDF de l’avis PROMEO"></iframe><p class="fine">Si le lecteur intégré est indisponible, <a target="_blank" rel="noopener" id="v6OpenPreview">ouvrir le brouillon dans un nouvel onglet</a>.</p>');document.body.append(dialog);dialog.querySelector("iframe").src=url;dialog.querySelector("#v6OpenPreview").href=url;dialog.querySelector("#v6ClosePreview").onclick=()=>dialog.close();dialog.addEventListener("close",()=>{dialog.remove();URL.revokeObjectURL(url)},{once:true});dialog.showModal();
}
/* Opt-in local draft: one record, no signatures, no network. */
let draftEnabled=false,draftTimer=null,draftSerial=Promise.resolve(),draftMessage="Brouillon en mémoire de l’onglet",draftDirty=false,draftRevision=0,leavingDraft=false;
function draftLabel(){const e=$("v6DraftState");if(e)e.textContent=DEMO?"Simulation locale · aucun enregistrement permanent":draftMessage;const b=$("v6SaveDraft");if(b)b.textContent=draftEnabled?"Sauvegarder maintenant":"Activer la sauvegarde locale"}
function dbAction(mode,fn){return new Promise((resolve,reject)=>{if(!window.indexedDB){reject(Error("Stockage local indisponible"));return}const req=indexedDB.open("blackout-hab-v6-local",1);req.onupgradeneeded=()=>req.result.createObjectStore("drafts");req.onerror=()=>reject(req.error||Error("Ouverture impossible"));req.onsuccess=()=>{const db=req.result;try{const tx=db.transaction("drafts",mode);const r=fn(tx.objectStore("drafts"));tx.oncomplete=()=>{db.close();resolve(r?.result)};tx.onabort=tx.onerror=()=>{db.close();reject(tx.error||Error("Écriture impossible"))}}catch(e){db.close();reject(e)}}})}
function draftSnapshot(){return {schema:1,savedAt:new Date().toISOString(),identity:{...T.identity},file:T.file?{name:T.file.name,bytes:T.file.bytes.slice(),pages:T.file.pages}:null,profiles:[...T.profiles],practice:JSON.parse(JSON.stringify(T.practice)),external:JSON.parse(JSON.stringify(T.external)),verified:T.verified,scopeNotes:T.scopeNotes}}
function writeDraft(){
 if(!draftEnabled)return Promise.resolve();clearTimeout(draftTimer);draftTimer=null;const rev=draftRevision,payload=draftSnapshot();draftDirty=true;draftMessage="Sauvegarde en cours…";draftLabel();
 const job=draftSerial.catch(()=>{}).then(()=>dbAction("readwrite",store=>store.put(payload,"current")));
 draftSerial=job;return job.then(()=>{if(rev===draftRevision){draftDirty=false;draftMessage="Brouillon local sauvegardé · "+new Date().toLocaleTimeString("fr-FR",{hour:"2-digit",minute:"2-digit"});draftLabel()}}).catch(e=>{draftEnabled=false;draftDirty=true;draftMessage="Échec de sauvegarde : "+e.message;draftLabel()});
}
function scheduleDraft(){if(MODE!=="formateur"||!draftEnabled)return;draftDirty=true;draftRevision++;clearTimeout(draftTimer);draftMessage="Modifications à sauvegarder…";draftLabel();draftTimer=setTimeout(writeDraft,650)}
async function activateDraft(){
 if(DEMO)return;
 try{if(!draftEnabled){await draftSerial.catch(()=>{});const old=await dbAction("readonly",s=>s.get("current"));if(!confirm("Sauvegarder ce dossier et son PDF sur ce navigateur ? Les données ne sont pas chiffrées. N’utilisez cette option que sur un poste autorisé."+ (old?"\nLe brouillon précédent sera remplacé.":"")))return;draftEnabled=true}
 await writeDraft();
 }catch(e){draftMessage="Sauvegarde indisponible : "+e.message;draftLabel();showError(draftMessage)}
}
function normalizedPractice(p,raw){const base=emptyGrid(p),t=PRACTICE[p];if(!raw||!Array.isArray(raw.situations)||raw.situations.length>12||(!t&&raw.situations.length))throw Error("Grille de brouillon incompatible : "+get(p));
 const str=v=>typeof v==="string"?v:"";
 base.situations=raw.situations.map(s=>{if(!s||!Array.isArray(s.criteria)||s.criteria.length!==t.criteria.length||s.criteria.some((c,i)=>c.text!==t.criteria[i]))throw Error("Indicateurs de brouillon incompatibles");return {title:str(s.title),observations:str(s.observations),criteria:t.criteria.map((text,i)=>({text,mark:Object.prototype.hasOwnProperty.call(marks,s.criteria[i].mark)?s.criteria[i].mark:"",note:str(s.criteria[i].note)}))}});
 for(const k of ["observations","reserve","avisTension","avisOuvrages","avisIndications"])base[k]=str(raw[k]);
 base.opinion=Object.prototype.hasOwnProperty.call(ops,raw.opinion)?raw.opinion:"incomplet";return base;
}
async function restoreDraft(){
 if(DEMO)return;
 try{clearTimeout(draftTimer);draftTimer=null;await draftSerial.catch(()=>{});const d=await dbAction("readonly",s=>s.get("current"));if(!d){showError("Aucun brouillon enregistré sur ce navigateur.");if(draftEnabled)scheduleDraft();return}if(d.schema!==1||!d.identity||!Array.isArray(d.profiles)||!uniq(d.profiles)||d.profiles.some(p=>!P[p]))throw Error("Brouillon incompatible");
 if(!confirm("Reprendre le brouillon du "+new Date(d.savedAt).toLocaleString("fr-FR")+" ? Les données actuellement à l’écran seront remplacées et les signatures devront être recueillies à nouveau.")){if(draftEnabled)scheduleDraft();return}
 let file=null,source=null;if(d.file){const bytes=new Uint8Array(d.file.bytes);if(!bytes.length||bytes.length>30*1024*1024)throw Error("PDF du brouillon invalide");const {PDFDocument}=requirePdf(),pdf=await PDFDocument.load(bytes);if(!pdf.getPageCount())throw Error("PDF vide");const packet=decodePacket(pdf.getSubject());if(packet)source=validatePacket(packet);file={bytes,name:String(d.file.name),pages:pdf.getPageCount()}}
 const identity=Object.fromEntries(Object.keys(T.identity).map(k=>[k,typeof d.identity[k]==="string"?d.identity[k]:""]));const practice={};for(const p of d.profiles)practice[p]=normalizedPractice(p,d.practice?.[p]||emptyGrid(p));
 const external={};for(const p of d.profiles){const x=d.external?.[p];if(x)external[p]={good:x.good,total:x.total,critical:x.critical}}
 Object.assign(T,{identity,file,source,profiles:[...d.profiles],practice,external,verified:!!file&&d.verified===true,scopeNotes:String(d.scopeNotes||""),reviewed:false,signatures:{trainer:null,learner:null},importMessage:file?"PDF restauré depuis le brouillon local":"Aucun PDF importé"});
 if(!identityMatch())T.verified=false;v6Undo=null;v6Profile=null;v6Situation={};v6Stage="identity";draftEnabled=true;draftDirty=false;draftMessage="Brouillon restauré · signatures à recueillir";renderTrainer();
 }catch(e){showError("Reprise impossible : "+e.message);if(draftEnabled)scheduleDraft()}
}
async function eraseDraft(){if(DEMO)return;if(!confirm("Effacer définitivement le brouillon enregistré sur ce navigateur ? Le dossier affiché reste dans l’onglet."))return;draftEnabled=false;clearTimeout(draftTimer);draftTimer=null;try{await draftSerial.catch(()=>{});await dbAction("readwrite",s=>s.delete("current"));draftMessage="Brouillon local effacé · dossier en mémoire";draftLabel()}catch(e){draftMessage="Effacement impossible : "+e.message;draftLabel();showError(draftMessage)}}
async function newTrainerDraft(){if(DEMO){if(confirm("Réinitialiser le dossier fictif ?"))location.reload();return}if(!confirm("Créer un nouveau dossier ? Les données en mémoire seront effacées. Le brouillon enregistré, s’il existe, reste disponible via Reprendre."))return;if(draftEnabled){await writeDraft();if(draftDirty){showError("Le brouillon n’a pas pu être enregistré. Le dossier est conservé à l’écran.");return}}draftEnabled=false;clearTimeout(draftTimer);leavingDraft=true;location.reload()}

/* Mode démonstration isolé : aucun import nominatif, aucun brouillon réel. */
function installDemoControls(aside){
 if(!DEMO){
 const card=element("section","panel v6-test-entry",'<h3>Test technique</h3><p class="fine">Essayer la génération des PDF sur un dossier fictif sans respecter le nombre réel de situations.</p><a class="button secondary" href="formateur-test.html" target="_blank" rel="noopener">Ouvrir le mode test ↗</a>');
 aside.append(card);return;
 }
 const banner=element("div","v6-demo-banner",'<strong>MODE TEST TECHNIQUE — DOCUMENTS FICTIFS</strong><span>1 situation minimum par symbole. Aucun avis ni PDF valable administrativement.</span><a class="button secondary" href="formateur.html" target="_blank" rel="noopener">Ouvrir le mode réel ↗</a>');A.prepend(banner);
 const quick=element("section","panel v6-quicktest",'<div><h2>Vérifier les PDF sans ressaisie</h2><p class="fine">Teste l’avis PROMEO et le dossier complet de la simulation courante avec un visa de test temporaire. Les notes restent inchangées. Pour vérifier le tracé manuscrit, utilisez aussi le parcours normal.</p></div><button type="button" class="primary" id="v6QuickPdf">Tester les deux PDF</button><p id="v6QuickResult" role="status" class="fine"></p><div id="v6QuickDownloads" class="toolbar" hidden></div>');banner.after(quick);
 $("v6QuickPdf").onclick=()=>actionPDF($("v6QuickPdf"),quickPdfTest);
 for(const id of ["nom","prenom","groupe","entreprise","formateur","organisme"]){const el=$(id);if(el)el.readOnly=true}
 const input=$("theoryFile");if(input){input.disabled=true;input.title="Mode test : PDF fictif fourni automatiquement."}
 const remove=$("removeTheory");if(remove)remove.hidden=true;
 const v=$("verified");if(v)v.disabled=true;
 const panel=aside.querySelector(".v6-draft");if(panel)panel.hidden=true;
 const name=$("headRight");if(name)name.textContent="MODE TEST";
 const label=$("v6DraftState");if(label)label.textContent="Simulation locale · aucun enregistrement permanent";
 const btn=$("generate");if(btn)btn.textContent="Générer le dossier PDF de test";
 const btn2=$("generateAvis");if(btn2)btn2.textContent="Télécharger l’avis de test";
}

/* Contrôle technique explicite, accessible exclusivement dans la page fictive. */
let quickArtifacts=null;
function clearQuickArtifacts(){
 quickArtifacts=null;const links=$("v6QuickDownloads"),out=$("v6QuickResult");if(links){links.replaceChildren();links.hidden=true}if(out)out.textContent="";
}
function simulatedVisa(){
 if(!DEMO)throw Error("Visa simulé interdit en mode réel.");
 const canvas=document.createElement("canvas");canvas.width=620;canvas.height=180;
 const ctx=canvas.getContext("2d");ctx.fillStyle="#a42535";ctx.font="bold 50px sans-serif";ctx.fillText("VISA FICTIF",25,78);ctx.font="25px sans-serif";ctx.fillText("TEST TECHNIQUE UNIQUEMENT",25,125);
 return {png:canvas.toDataURL("image/png"),at:new Date().toISOString(),snapshot:signatureSnapshot()};
}
async function quickPdfTest(){
 if(!DEMO)throw Error("Fonction disponible uniquement en mode test.");
 clearQuickArtifacts();
 const previous={reviewed:T.reviewed,signatures:T.signatures};const wasInert=A.inert;
 try{
  validateAvis();A.inert=true;T.reviewed=true;T.signatures={trainer:simulatedVisa(),learner:null};
  const first=await trainerPDF(true,true),second=await trainerPDF(false,true);
  const {PDFDocument}=requirePdf();
  const a=await PDFDocument.load(first.bytes),b=await PDFDocument.load(second.bytes);
  if(!a.getPageCount()||b.getPageCount()<=a.getPageCount())throw Error("Contrôle de pagination : dossier complet incohérent.");
  if(a.getSubject()!=="TEST TECHNIQUE - NE PAS TRANSMETTRE"||b.getSubject()!==a.getSubject())throw Error("Marquage de démonstration absent.");
  quickArtifacts={first,second};const result=$("v6QuickResult"),links=$("v6QuickDownloads");
  result.textContent="Contrôle réussi : avis ("+a.getPageCount()+" page(s)) et dossier ("+b.getPageCount()+" page(s)) générés et relus par le moteur PDF. Documents fictifs uniquement.";
  result.className="success";links.hidden=false;
  for(const [label,record] of [["Télécharger l’avis de test",first],["Télécharger le dossier de test",second]]){const btn=document.createElement("button");btn.type="button";btn.className="secondary";btn.textContent=label;btn.onclick=()=>download(record.bytes,record.name);links.append(btn)}
 }catch(e){const out=$("v6QuickResult");if(out){out.textContent="Échec du contrôle PDF : "+e.message;out.className="error"}throw e}
 finally{T.reviewed=previous.reviewed;T.signatures=previous.signatures;A.inert=wasInert;refreshSignatureUI();refreshWorkspace()}
}

async function watermarkDemo(doc){
 const {StandardFonts,rgb,degrees}=requirePdf(),font=await doc.embedFont(StandardFonts.HelveticaBold);
 for(const page of doc.getPages()){const {width,height}=page.getSize();const size=Math.min(24,width/27);const text="DEMONSTRATION - SANS VALEUR ADMINISTRATIVE",sz=Math.min(12,(width-20)/font.widthOfTextAtSize(text,1));
 page.drawRectangle({x:0,y:0,width,height:23,color:rgb(1,.94,.94)});
 page.drawText(text,{x:(width-font.widthOfTextAtSize(text,sz))/2,y:7,size:sz,font,color:rgb(.72,.05,.12)});
 page.drawText("SPECIMEN",{x:width*.18,y:height*.43,size:Math.min(66,width/8),font,color:rgb(.7,.08,.12),opacity:.16,rotate:degrees(31)});
 }
 doc.setTitle("DEMONSTRATION - document fictif sans valeur administrative");doc.setSubject("TEST TECHNIQUE - NE PAS TRANSMETTRE");
}
async function initDemo(){
 Object.assign(T.identity,{nom:"DEMONSTRATION",prenom:"Apprenti fictif",groupe:"TEST TECHNIQUE",entreprise:"Entreprise fictive",organisme:"PROMEO - DEMO",lieu:"Beauvais",formateur:"Formateur fictif",fonction:"Formateur",dureeTheorie:"7 h",dureePratique:"3 h",stage:"Simulation - prévention du risque électrique",titresDemandes:"",dateTheorie:today(),datePratique:today()});
 T.profiles=["BR"];T.verified=true;T.scopeNotes="Dossier fictif destiné exclusivement à vérifier le fonctionnement de l’application.";
 T.external=Object.fromEntries(Object.keys(PRACTICE).map(p=>[p,{good:15,total:15,critical:"0"}]));
 const g=gridFor("BR");g.situations[0].title="Mise en situation fictive de test";g.situations[0].criteria.forEach(c=>c.mark="A");g.opinion="favorable";
 const {PDFDocument,StandardFonts,rgb}=requirePdf();const doc=await PDFDocument.create(),font=await doc.embedFont(StandardFonts.Helvetica),page=doc.addPage([595.28,841.89]);
 page.drawText("RESULTAT THEORIQUE FICTIF - TEST TECHNIQUE",{x:35,y:785,size:14,font,color:rgb(.2,.2,.2)});
 page.drawText("Apprenti fictif / 15 sur 15 simules par symbole",{x:35,y:745,size:12,font});
 page.drawText("Aucune evaluation theorique reelle n'a ete effectuee.",{x:35,y:715,size:12,font});
 await watermarkDemo(doc);T.file={name:"THEORIE_FICTIVE_TEST.pdf",bytes:await doc.save(),pages:doc.getPageCount()};T.source=null;T.importMessage="PDF de théorie fictif généré pour le test. Aucun résultat réel.";
 v6Stage="practice";renderTrainer();
}

function initTheme(){let mode="dark";try{const saved=localStorage.getItem("blackout-hab-v6-theme");if(["light","dark"].includes(saved))mode=saved}catch{}function apply(){document.documentElement.dataset.theme=mode;const b=$("themeToggle");if(b){b.textContent=mode==="dark"?"☀ Clair":"☾ Sombre";b.setAttribute("aria-label",mode==="dark"?"Activer le thème clair":"Activer le thème sombre")}}apply();const b=$("themeToggle");if(b)b.onclick=()=>{mode=mode==="dark"?"light":"dark";try{localStorage.setItem("blackout-hab-v6-theme",mode)}catch{}apply()}}

initTheme();if(MODE==="theorie"){restore();renderTheory();setInterval(updateClock,500)}else if(MODE==="formateur"){if(DEMO){initDemo().catch(e=>{A.textContent="Impossible de préparer le dossier fictif : "+e.message})}else renderTrainer();window.addEventListener("beforeunload",e=>{if(!DEMO&&!leavingDraft&&(draftDirty||(!draftEnabled&&(T.file||T.profiles.length||T.identity.nom)))){e.preventDefault();e.returnValue=""}})}else A.textContent="Lien invalide.";
})();
