/* V4 — noyau du dossier, règles pédagogiques provisoires */
const BlackoutCore=(function buildCore(){
 const profiles=["B0_éxécutant","B0_Chargé_de_chantier","B1V","B2V","BC","BE_mesurage","BE_Essais","BE_Manœuvre","BP","BR","BS","BF_HF"];
 function summarize(d,p){
  const t=d.theory[p]||null,g=d.practice[p]||null;
  const criteria=g?.criteria||[];
  const marked=criteria.filter(c=>["acquis","partiel","non_acquis","non_observe"].includes(c.mark));
  const critical=marked.filter(c=>c.critical&&c.mark!=="acquis");
  const complete=Boolean(g?.gridVersion&&criteria.length&&marked.length===criteria.length&&marked.every(c=>c.mark!=="non_observe"));
  return {theory:t? (t.passed?"réussie":"non réussie"):"à passer",practice:!complete?"à compléter":critical.length?"alerte critique":"évaluée",critical:critical.length,complete,canReview:Boolean(t&&complete),canFavor:Boolean(t?.passed&&complete&&!critical.length)};
 }
 function status(d){if(d.closed)return "Clôturé";if(d.profiles.some(p=>!d.theory[p]))return "Théorie en attente";if(d.profiles.some(p=>!summarize(d,p).complete))return "Pratique en attente";return "À valider / signer";}
 function attachTheory(d,packet){
  if(d.closed)throw Error("Dossier clôturé");
  if(packet.caseId!==d.caseId||packet.campaignId!==d.campaignId)throw Error("Identifiant ou campagne incompatible");
  if(!packet.results||typeof packet.results!=="object")throw Error("Résultats absents");
  const entries=Object.entries(packet.results);
  if(!entries.length)throw Error("Aucun résultat");
  for(const [p,r] of entries){
   if(!d.profiles.includes(p)||r.profile!==p||!Number.isInteger(r.good)||!Number.isInteger(r.total)||r.total<=0||r.good<0||r.good>r.total||!Array.isArray(r.details)||!Array.isArray(r.critical)||typeof r.passed!=="boolean")throw Error("Résultat invalide");
   if(d.theory[p])throw Error("Résultat déjà présent : reprise explicite nécessaire");
  }
  const next=JSON.parse(JSON.stringify(d));for(const [p,r] of entries)next.theory[p]={...r,source:"déclaratif / non authentifié"};next.revision++;return next;
 }
 function reviewAllowed(d){
  return d.profiles.every(p=>{const s=summarize(d,p),a=d.opinions[p];return s.canReview&&["favorable","defavorable"].includes(a)&&(a!=="favorable"||s.canFavor);});
 }
 return {profiles,summarize,status,attachTheory,reviewAllowed};
})();
