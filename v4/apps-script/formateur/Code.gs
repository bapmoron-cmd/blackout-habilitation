/**
 * BLACKOUT V4 — stockage privé du dossier, première brique Apps Script.
 * Non déployé. Ne pas activer avant accord PROMEO et tests d'autorisation.
 * Toutes les fonctions publiques vérifient l'identité professionnelle.
 * Aucun accès apprenti, aucune clôture, aucun envoi dans cette version.
 */
function config_(){
  const p=PropertiesService.getScriptProperties();
  if(p.getProperty("BLACKOUT_ENABLED")!=="YES")throw new Error("Service désactivé");
  const email=String(Session.getActiveUser().getEmail()||"").trim().toLowerCase();
  const trainers=String(p.getProperty("BLACKOUT_TRAINERS")||"").toLowerCase().split(",").map(x=>x.trim()).filter(Boolean);
  if(!email||!trainers.includes(email))throw new Error("Accès formateur refusé");
  const sheetId=p.getProperty("BLACKOUT_SHEET_ID"),folderId=p.getProperty("BLACKOUT_FOLDER_ID");
  if(!sheetId||!folderId)throw new Error("Stockage non configuré");
  return {email,sheetId,folderId};
}
function withLock_(fn){const lock=LockService.getScriptLock();lock.waitLock(10000);try{return fn()}finally{lock.releaseLock()}}
function sheet_(c){const s=SpreadsheetApp.openById(c.sheetId).getSheetByName("DOSSIERS");if(!s)throw new Error("Index absent");return s;}
function id_(v){const s=String(v||"");if(!/^[A-Za-z0-9_-]{1,100}$/.test(s))throw new Error("Identifiant invalide");return s;}
function label_(v){const s=String(v||"").trim();if(!s||s.length>100||/[\u0000-\u001f]/.test(s))throw new Error("Libellé invalide");return s;}
function index_(c,id){const s=sheet_(c),n=s.getLastRow();if(n<2)throw new Error("Dossier absent");const matches=s.getRange(2,1,n-1,5).getValues().map((a,i)=>({row:i+2,id:a[0],campaign:a[1],fileId:a[2],revision:Number(a[3]),owner:a[4]})).filter(a=>a.id===id&&a.owner===c.email);if(matches.length!==1)throw new Error("Dossier absent ou non autorisé");return matches[0];}
function read_(c,id){const r=index_(c,id),f=DriveApp.getFileById(r.fileId);const d=JSON.parse(f.getBlob().getDataAsString("UTF-8"));if(d.caseId!==id||d.campaignId!==r.campaign||d.revision!==r.revision||d.owner!==c.email)throw new Error("Incohérence de version");return d;}
function initializeIndex(){const c=config_();return withLock_(()=>{const book=SpreadsheetApp.openById(c.sheetId);let s=book.getSheetByName("DOSSIERS");if(!s)s=book.insertSheet("DOSSIERS");const expected=["caseId","campaignId","fileId","revision","owner"];if(!s.getLastRow()){s.getRange(1,1,1,5).setValues([expected]);s.setFrozenRows(1)}else if(JSON.stringify(s.getRange(1,1,1,5).getValues()[0])!==JSON.stringify(expected)){throw new Error("En-têtes incompatibles")}return {ready:true}});}
function createDossier(input){const c=config_();return withLock_(()=>{
  const campaignId=id_(input.campaignId),identity={nom:label_(input.nom),prenom:label_(input.prenom),classe:label_(input.classe)};
  const allowed=["B0_éxécutant","B0_Chargé_de_chantier","B1V","B2V","BC","BE_mesurage","BE_Essais","BE_Manœuvre","BP","BR","BS","BF_HF"];
  if(!Array.isArray(input.profiles)||!input.profiles.length||input.profiles.some(p=>!allowed.includes(p))||new Set(input.profiles).size!==input.profiles.length)throw new Error("Symboles invalides");
  const caseId=Utilities.getUuid(),d={schemaVersion:1,caseId,campaignId,identity,profiles:input.profiles,owner:c.email,createdAt:new Date().toISOString(),revision:0,theory:{},practice:{},opinions:{},signatures:{},closed:false};
  const s=sheet_(c);const file=DriveApp.getFolderById(c.folderId).createFile(caseId+".r0.json",JSON.stringify(d),MimeType.PLAIN_TEXT);
  try{s.appendRow([caseId,campaignId,file.getId(),0,c.email]);SpreadsheetApp.flush()}catch(e){file.setTrashed(true);throw e}
  return d;
});}
function getDossier(caseId){const c=config_();return withLock_(()=>read_(c,id_(caseId)));}
function listDossiers(campaignId){const c=config_(),id=id_(campaignId);return withLock_(()=>{const s=sheet_(c),n=s.getLastRow();if(n<2)return [];return s.getRange(2,1,n-1,5).getValues().filter(a=>a[1]===id&&a[4]===c.email).map(a=>{const d=read_(c,a[0]);return {caseId:d.caseId,campaignId:d.campaignId,identity:d.identity,profiles:d.profiles,revision:d.revision,closed:d.closed,theoryCount:Object.keys(d.theory).length,practiceCount:Object.keys(d.practice).length}})});}
