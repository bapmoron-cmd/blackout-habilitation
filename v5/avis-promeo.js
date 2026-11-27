
/* Avis après formation : reprise du modèle "HE - Avis après formation.docx"
   fourni par le formateur. Logo extrait du document, texte et structure conservés.
   Aucun titre d'habilitation délivré par cet outil. */
(function(){
"use strict";
const LOGO="data:image/jpeg;base64,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";
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
async function create(d,PDFLib){
 const {PDFDocument,StandardFonts,rgb}=PDFLib,doc=await PDFDocument.create();
 const font=await doc.embedFont(StandardFonts.Helvetica),bold=await doc.embedFont(StandardFonts.HelveticaBold),italic=await doc.embedFont(StandardFonts.HelveticaOblique),boldItalic=await doc.embedFont(StandardFonts.HelveticaBoldOblique);
 const logo=await doc.embedJpg(LOGO),sig=await doc.embedPng(d.signature.png);
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
 function start(){page=doc.addPage([W,H]);pn++;page.drawImage(logo,{x:22,y:H-19-58,width:54,height:58});center("AVIS APRÈS FORMATION",95,R-95,26,14,bold);
  if(pn>1)center("Suite - "+d.nom+" "+d.prenom,95,R-95,46,9.2,font);
  draw("Modèle HE - Avis après formation | V5.3 pilote - validation institutionnelle requise",M,H-20,6.4,font,gray);draw(String(pn),R-9,H-20,7,font,gray);y=pn===1?49:87;
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
 need(72);const signedDate=new Date(d.signature.at).toLocaleDateString("fr-FR",{timeZone:"Europe/Paris"});
 const leftLines=wrap(d.lieu+", le "+signedDate,210,font,9.1);leftLines.forEach((l,i)=>draw(l,M,y+i*11,9.1)); 
 const signX=M+230, signW=R-signX;
 const titleLines=wrap("Responsable de formation maintenance",signW,bold,9.1);titleLines.forEach((l,i)=>center(l,signX,signW,y+i*11,9.1,bold));
 let sy=y+titleLines.length*11+2;const nameLines=wrap(d.formateur+" - "+d.fonction,signW,font,8.7);nameLines.forEach((l,i)=>center(l,signX,signW,sy+i*10,8.7));sy+=nameLines.length*10+2;
 const sc=Math.min(160/sig.width,29/sig.height);const iw=sig.width*sc,ih=sig.height*sc;
 if(sy+ih+10>H-32){start();paragraph("Signature du responsable / signataire de l’avis",{f:bold});paragraph(d.formateur+" - "+d.fonction);paragraph(d.lieu+", le "+signedDate);sy=y;page.drawImage(sig,{x:M,y:H-sy-ih,width:iw,height:ih});draw("Signature manuscrite numérisée",M,sy+ih+1,7,font,gray)}
 else{page.drawImage(sig,{x:signX+(signW-iw)/2,y:H-sy-ih,width:iw,height:ih});center("Signature manuscrite numérisée",signX,signW,sy+ih+1,7,font)}
 doc.setTitle("Avis après formation - "+d.nom+" "+d.prenom);doc.setAuthor(d.organisme);doc.setSubject("Avis après formation préalable à l’habilitation électrique - modèle fourni - version pilote");
 return doc;
}
window.HAB_AVIS={create,decision,tableRows,sameRequested};
})();
