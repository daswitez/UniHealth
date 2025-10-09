const { readFileSync, writeFileSync } = require("node:fs");
const { resolve } = require("node:path");

const TARGET_FILES = [
  "src/components/medical-form-wizard.tsx",
  "src/components/forms/form-summary.tsx",
  "src/components/forms/lifestyle-habits-form.tsx",
  "src/components/forms/medical-history-form.tsx",
  "src/components/forms/personal-data-form.tsx",
  "src/components/medical-registration-form.tsx",
  "index.html",
  "package.json"
];

const REPLACEMENTS = [
  ["¡Registro", "¡Registro"],
  ["\uFFFDRegistro", "¡Registro"],
  ["\uFFFDCómo", "¿Cómo"],
  ["\uFFFDFuma", "¿Fuma"],
  ["\uFFFDConsume", "¿Consume"],
  ["\uFFFDRealiza", "¿Realiza"],
  ["\uFFFDToma", "¿Toma"],
  ["\uFFFDPosee", "¿Posee"],
  ["\uFFFDPadece actualmente", "¿Padece actualmente"],
  ["\uFFFDPadece alguna", "¿Padece alguna"],
  ["\uFFFDPadece", "¿Padece"],
  ["\uFFFDEs", "¿Es"],
  ["\uFFFDHa tenido", "¿Ha tenido"],
  ["\uFFFDHa sido", "¿Ha sido"],
  ["\uFFFDHa", "¿Ha"],
  [" \uFFFD", " ¿"],
  ["C\uFFFDmo", "Cómo"],
  ["describir\uFFFDa", "describiría"],
  ["alimentaci\uFFFDn", "alimentación"],
  ["Condiciones M\uFFFDdicas", "Condiciones Médicas"],
  ["Historial M\uFFFDdico", "Historial Médico"],
  ["Antecedentes M\uFFFDdicos", "Antecedentes Médicos"],
  ["m\uFFFDdico", "médico"],
  ["m\uFFFDdicos", "médicos"],
  ["M\uFFFDdico", "Médico"],
  ["M\uFFFDdicos", "Médicos"],
  ["Seguro m\uFFFDdico", "Seguro médico"],
  ["informaci\uFFFDn", "información"],
  ["Informaci\uFFFDn", "Información"],
  ["Descripci\uFFFDn", "Descripción"],
  ["Tel\uFFFDfono", "Teléfono"],
  ["tel\uFFFDfono", "teléfono"],
  ["Relaci\uFFFDn", "Relación"],
  ["relaci\uFFFDn", "relación"],
  ["opci\uFFFDn", "opción"],
  ["Uni\uFFFDn", "Unión"],
  ["C\uFFFDnyuge", "Cónyuge"],
  ["n\uFFFDmero", "número"],
  ["pa\uFFFDs", "país"],
  ["Direcci\uFFFDn", "Dirección"],
  ["C\uFFFDdula", "Cédula"],
  ["biol\uFFFDgico", "biológico"],
  ["g\uFFFDnero", "género"],
  ["Sexo biol\uFFFDgico", "Sexo biológico"],
  ["H\uFFFDbitos", "Hábitos"],
  ["m\uFFFDs", "más"],
  ["d\uFFFDas", "días"],
  ["f\uFFFDsica", "física"],
  ["sue\uFFFDo", "sueño"],
  ["estr\uFFFDs", "estrés"],
  ["S\uFFFD", "Sí"],
  ["alg\uFFFDn", "algún"],
  ["cr\uFFFDnica", "crónica"],
  ["cr\uFFFDnicas", "crónicas"],
  ["Cardiopat\uFFFDa", "Cardiopatía"],
  ["Hipertensi\uFFFDn", "Hipertensión"],
  ["C\uFFFDncer", "Cáncer"],
  ["card\uFFFDaca", "cardíaca"],
  ["cirug\uFFFDa", "cirugía"],
  ["cirug\uFFFDas", "cirugías"],
  ["Cirug\uFFFDas", "Cirugías"],
  ["Losart\uFFFDn", "Losartán"],
  ["Neumon\uFFFDa", "Neumonía"],
  ["Apendicectom\uFFFDa", "Apendicectomía"],
  ["Ces\uFFFDrea", "Cesárea"],
  ["al\uFFFDrgico", "alérgico"],
  ["Atr\uFFFDs", "Atrás"],
  ["Condiciones M\uFFFDdicas Preexistentes", "Condiciones Médicas Preexistentes"],
  ["Cualquier informaci\uFFFDn", "Cualquier información"],
  ["Enfermedades cr\uFFFDnicas", "Enfermedades crónicas"],
  ["Alimentaci\uFFFDn", "Alimentación"],
  ["MǸdico", "Médico"],
  ["mǸdico", "médico"],
  ["A\uFFFDos", "Años"],
  ["a\uFFFDos", "años"],
  ["a\uFFFDo", "año"],
  ["l\uFFFDtex", "látex"]
];

const sortedReplacements = REPLACEMENTS.sort(
  (a, b) => b[0].length - a[0].length
);

for (const relativePath of TARGET_FILES) {
  const filePath = resolve(relativePath);
  let content = readFileSync(filePath, "utf8");
  let updated = content;

  for (const [from, to] of sortedReplacements) {
    const pattern = new RegExp(from, "g");
    updated = updated.replace(pattern, to);
  }

  if (updated !== content) {
    writeFileSync(filePath, updated, "utf8");
    console.log(`Repaired: ${relativePath}`);
  }
}
