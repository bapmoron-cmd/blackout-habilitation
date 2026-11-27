
/* Avis après formation : reprise du modèle "HE - Avis après formation.docx"
   fourni par le formateur. Logo extrait du document, texte et structure conservés.
   Aucun titre d'habilitation délivré par cet outil. */
(function(){
"use strict";
const LOGO="data:image/png;base64,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";
const groups=[
 {title:"Travaux d’ordre non électrique",rows:[["nonExec","Exécutant"],["nonChef","Chargé de chantier"]]},
 {title:"Opérations d’ordre électrique",rows:[["exec","Exécutant"],["chef","Chargé de travaux"],["inter","Chargé d’intervention BT"],["cons","Chargé de consignation"],["spec","Chargé d’opérations spécifiques"],["special","Habilité spécial"]]}
];
const category={
 "B0_éxécutant":"nonExec","H0_exec":"nonExec","H0V_exec":"nonExec","B0_Chargé_de_chantier":"nonChef","H0_chantier":"nonChef","H0V_chantier":"nonChef",
 "B1":"exec","B1V":"exec","H1":"exec","H1V":"exec","B2":"chef","B2V":"chef","B2V_Essai":"chef","H2":"chef","H2V":"chef","BR":"inter","BS":"inter","BC":"cons","HC":"cons",
 "BE_Manœuvre":"spec","BE_mesurage":"spec","BE_Essais":"spec","BE_Verification":"spec","BP":"special","BF_HF":"special"
};
const actualSymbol={"B0_éxécutant":"B0","B0_Chargé_de_chantier":"B0","H0_exec":"H0","H0_chantier":"H0","H0V_exec":"H0V","H0V_chantier":"H0V"};
const checks=[
"que les symboles proposés à l’issue de la formation sont cohérents avec les opérations qu’il souhaite confier à la personne concernée par la présente appréciation ;",
"que le domaine d’application de l’habilitation est convenablement cerné et notamment qu’il ne risque pas de placer le titulaire dans une situation pour la gestion de laquelle il n’aurait pas été formé ;",
"que la personne concernée possède les compétences nécessaires à l’accomplissement de ces opérations ;",
"que la personne concernée possède les aptitudes, notamment médicales, à l’accomplissement de ces opérations ;",
"qu’elle présente, vis-à-vis du risque électrique, un comportement compatible avec la bonne exécution de ces opérations."
];
const norm=s=>String(s??"").trim().toLocaleLowerCase("fr").replace(/\s+/g," ");
function sameRequested(request,profiles){
 const a=request.split(/[,;\n/]+/).map(norm).filter(Boolean).sort(),b=profiles.map(p=>norm(p.name)).sort();
 return a.length===b.length&&a.every((x,i)=>x===b[i]);
}
function decision(request,profiles){
 const positive=profiles.filter(p=>p.opinion==="favorable"),negative=profiles.filter(p=>p.opinion==="defavorable");
 const exact=sameRequested(request,profiles),ok=exact&&positive.length===profiles.length&&profiles.length>0;
 const rejected=exact&&negative.length>0;
 let other="";
 if(!exact)other=positive.length?"Avis favorable limité aux symboles évalués suivants : "+positive.map(p=>p.name).join(", ")+". Autres titres demandés : hors périmètre de cet avis.":"Aucun symbole évalué n’est proposé ; la demande de l’entreprise diffère du périmètre évalué.";
 else if(rejected&&positive.length)other="Proposition limitée aux symboles suivants : "+positive.map(p=>p.name).join(", ")+".";
 return {ok,rejected,other,positive,negative,exact};
}
function tableRows(positive){
 return groups.map(group=>({title:group.title,rows:group.rows.flatMap(([key,name])=>{
 const items=positive.filter(p=>category[p.id]===key);
 return items.length?items.map(p=>[name,actualSymbol[p.id]||p.name,p.tension||p.domain,p.ouvrages||"",p.indications||""]):[[name,"","","",""]];
 })}));
}
const clean=t=>String(t??"").replace(/[’‘]/g,"'").replace(/[“”]/g,'"').replace(/[–—−]/g,"-").replace(/…/g,"...").replace(/œ/g,"oe").replace(/Œ/g,"OE").replace(/\u202f/g," ").replace(/[^\x20-\x7e\xa0-\xff\n]/g," ");
async function create(d,PDFLib,{preview=false}={}){
 const {PDFDocument,StandardFonts,rgb}=PDFLib,doc=await PDFDocument.create();
 const font=await doc.embedFont(StandardFonts.Helvetica),bold=await doc.embedFont(StandardFonts.HelveticaBold),italic=await doc.embedFont(StandardFonts.HelveticaOblique),boldItalic=await doc.embedFont(StandardFonts.HelveticaBoldOblique);
 const logo=await doc.embedPng(LOGO);
 let sig;if(!preview){try{sig=await doc.embedPng(d.signature.png)}catch(e){throw Error("Signature du formateur illisible : effacez-la puis signez à nouveau.")}}
 const W=595.28,H=841.89,M=30,R=W-M,W0=R-M,black=rgb(0,0,0),gray=rgb(.32,.32,.32);
 let page,y=0,pn=0;
 function width(s,f,z){return f.widthOfTextAtSize(clean(s),z)}
 function wrap(s,w,f,z){let out=[];for(const paragraph of clean(s).split("\n")){let line="";for(let word of paragraph.split(/\s+/).filter(Boolean)){
  if(width(word,f,z)>w){if(line){out.push(line);line=""}let part="";for(const ch of word){if(part&&width(part+ch,f,z)>w){out.push(part);part=ch}else part+=ch}word=part}
  const n=line?line+" "+word:word;if(line&&width(n,f,z)>w){out.push(line);line=word}else line=n
 }out.push(line)}return out.length?out:[""]}
 function draw(s,x,t,z=9.4,f=font,color=black){page.drawText(clean(s),{x,y:H-t-z,font:f,size:z,color})}
 function center(s,x,w,t,z,f=font){draw(s,x+(w-width(s,f,z))/2,t,z,f)}
 function box(x,t,w,h,th=.55){page.drawRectangle({x,y:H-t-h,width:w,height:h,borderColor:black,borderWidth:th})}
 function rule(x1,t1,x2,t2){page.drawLine({start:{x:x1,y:H-t1},end:{x:x2,y:H-t2},thickness:1.1,color:black})}
 function start(){page=doc.addPage([W,H]);pn++;page.drawImage(logo,{x:22,y:H-19-58,width:54,height:58});center(preview?"BROUILLON - AVIS NON SIGNE":"AVIS APRÈS FORMATION",95,R-95,26,14,bold);
  if(pn>1)center("Suite - "+d.nom+" "+d.prenom,95,R-95,46,9.2,font);
  draw((preview?"BROUILLON NON SIGNE - NE PAS TRANSMETTRE | ":"")+"Modèle HE - Avis après formation | V6 pilote",M,H-20,6.4,font,gray);draw(String(pn),R-9,H-20,7,font,gray);y=pn===1?49:87;
 }
 function need(h){if(y+h>H-32)start()}
 function paragraph(s,opt={}){const x=opt.x??M,w=opt.w??R-x,z=opt.z??9.2,f=opt.f??font,lead=opt.lead??(z+2.3);
 for(const line of wrap(s,w,f,z)){need(lead);draw(line,x,y,z,f);y+=lead}y+=opt.gap??3}
 function label(name,value,opt={}){paragraph(name+" "+(value||"-"),opt)}
 function pair(a,av,b,bv){const w=(W0-12)/2,z=9.2,lead=11.5,l=wrap(a+" "+(av||"-"),w,font,z),r=wrap(b+" "+(bv||"-"),w,font,z),h=Math.max(l.length,r.length)*lead;need(h);l.forEach((s,i)=>draw(s,M,y+i*lead,z));r.forEach((s,i)=>draw(s,M+w+12,y+i*lead,z));y+=h+4}
 function cb(x,t,on){box(x,t,10,10);if(on){rule(x+2,t+5,x+4.5,t+8);rule(x+4.5,t+8,x+8,t+2)}}
 const widths=[110,81,109,137,W0-437],xs=widths.map((_,i)=>M+widths.slice(0,i).reduce((a,b)=>a+b,0)),cellZ=8.4,cellLead=10.4;
 function cell(lines,x,w,t,h,weight=false){const f=weight?bold:font;box(x,t,w,h);const top=t+(h-lines.length*cellLead)/2;lines.forEach((s,i)=>center(s,x,w,top+i*cellLead,cellZ,f))}
 function header(){need(40);const t=y;cell(wrap("Personnel",widths[0]-8,font,cellZ),xs[0],widths[0],t,40);cell(wrap("Symbole d’habilitation et attribut",widths[1]-8,font,cellZ),xs[1],widths[1],t,40);
 cell(["Champ d’application"],xs[2],widths[2]+widths[3]+widths[4],t,14);
 ["Domaine de tension ou tensions concernées","Ouvrages ou installations concernés","Indications supplémentaires"].forEach((s,i)=>cell(wrap(s,widths[i+2]-8,font,cellZ),xs[i+2],widths[i+2],t+14,26));y+=40}
 function group(title){cell([title],M,W0,y,15,true);y+=15}
 function row(values,gtitle){const lines=values.map((s,i)=>wrap(s,widths[i]-8,font,cellZ));const h=Math.max(18,Math.max(...lines.map(a=>a.length))*cellLead+5);
 if(h>H-140)throw Error("Une ligne du champ d’application est trop longue. Raccourcissez les précisions et reportez le détail dans les commentaires.");
 if(y+h>H-32){start();header();group(gtitle+" (suite)")}
 lines.forEach((l,i)=>cell(l,xs[i],widths[i],y,h));y+=h}
 const a=decision(d.requested,d.profiles);
 start();
 label("ENTREPRISE :",d.entreprise,{x:102,z:9.5,gap:3});
 label("STAGIAIRE (Nom Prénom) :",d.nom+" "+d.prenom,{x:102,z:9.5,gap:4});
 y=Math.max(y,89);
 pair("Lieu de formation :",d.lieu,"Dates de la formation :",d.dates);
 pair("Durée de formation :",d.duree,"Intitulé de la formation :",d.stage);
 y+=6;label("Titre(s) demandé(s) par l’entreprise :",d.requested,{gap:8});
 paragraph("Au vu des résultats d’évaluations théorique et pratique effectuées, nous émettons un",{f:italic,gap:4});
 need(16);draw("Avis favorable",M+12,y,9.4);cb(M+98,y-.1,a.ok);draw("Avis défavorable",M+260,y,9.4);cb(M+359,y-.1,a.rejected);y+=16;
 label("Autre proposition :",a.other||"-",{gap:3});
 const comments=[...d.comments];if(a.negative.length)comments.unshift("Symboles non recommandés : "+a.negative.map(p=>p.name).join(", ")+".");
 label("Commentaires :",comments.filter(Boolean).join("\n")||"-",{gap:7});
 paragraph("Au vu de cet avis et compte tenu des prescriptions contenues dans la norme NF C 18-510, l’employeur peut délivrer l’habilitation électrique.",{gap:7});
 need(75);paragraph("Exemple de titre d’habilitation électrique :",{f:boldItalic,gap:3});
 header();for(const g of tableRows(a.positive)){if(y+33>H-32){start();header()}group(g.title);g.rows.forEach(v=>row(v,g.title))}
 y+=10;need(28);
 paragraph("Avant de remettre le titre d’habilitation à l’intéressé, l’employeur doit s’assurer :",{f:boldItalic,z:9.1,gap:3});
 for(const s of checks)paragraph("- "+s,{x:M+9,z:8.9,lead:10.8,gap:2});
 y+=4;paragraph("NB : la norme recommande un recyclage périodique des connaissances tous les 3 ans.",{f:boldItalic,z:9.1,gap:5});
 need(72);const signedDate=preview?"[date de signature]":new Date(d.signature.at).toLocaleDateString("fr-FR",{timeZone:"Europe/Paris"});
 const leftLines=wrap(d.lieu+", le "+signedDate,210,font,9.1);leftLines.forEach((l,i)=>draw(l,M,y+i*11,9.1)); 
 const signX=M+230, signW=R-signX;
 const titleLines=wrap("Responsable de formation maintenance",signW,bold,9.1);titleLines.forEach((l,i)=>center(l,signX,signW,y+i*11,9.1,bold));
 let sy=y+titleLines.length*11+2;const nameLines=wrap(d.formateur+" - "+d.fonction,signW,font,8.7);nameLines.forEach((l,i)=>center(l,signX,signW,sy+i*10,8.7));sy+=nameLines.length*10+2;
 if(preview){need(38);box(signX,sy,signW,28);center("Signature à recueillir - brouillon",signX,signW,sy+8,8.5,font)}else{
 const sc=Math.min(160/sig.width,29/sig.height);const iw=sig.width*sc,ih=sig.height*sc;
 if(sy+ih+10>H-32){start();paragraph("Signature du responsable / signataire de l’avis",{f:bold});paragraph(d.formateur+" - "+d.fonction);paragraph(d.lieu+", le "+signedDate);sy=y;page.drawImage(sig,{x:M,y:H-sy-ih,width:iw,height:ih});draw("Signature manuscrite numérisée",M,sy+ih+1,7,font,gray)}
 else{page.drawImage(sig,{x:signX+(signW-iw)/2,y:H-sy-ih,width:iw,height:ih});center("Signature manuscrite numérisée",signX,signW,sy+ih+1,7,font)}}
 doc.setTitle("Avis après formation - "+d.nom+" "+d.prenom);doc.setAuthor(d.organisme);doc.setSubject("Avis après formation préalable à l’habilitation électrique - modèle fourni - version pilote");
 return doc;
}
window.HAB_AVIS={create,decision,tableRows,sameRequested};
})();
