const questions = [
  { id: 'name', prompt: 'Quel est votre nom ?', placeholder: 'Votre nom et prénom', type: 'text' },
  { id: 'business', prompt: 'Quel est le nom de votre entreprise ?', placeholder: "Nom de l’entreprise", type: 'text' },
  { id: 'business_description', prompt: 'Parlez-moi un peu de votre entreprise.', placeholder: 'Décrivez votre activité, vos produits ou vos services…', type: 'textarea' },
  { id: 'location', prompt: 'Où se trouve votre entreprise ?', options: ['Port-au-Prince', 'Cap-Haïtien', 'Gonaïves', 'Jacmel', 'Les Cayes', 'Autre'] },
  { id: 'sector', prompt: 'Dans quel domaine travaillez-vous ?', options: ['Commerce', 'Restaurant / alimentation', 'Mode / vêtements', 'Services', 'Agriculture', 'Transport', 'Autre'] },
  { id: 'age', prompt: 'Depuis combien de temps votre entreprise existe-t-elle ?', options: ["Moins d’un an", '1 à 3 ans', '3 à 5 ans', 'Plus de 5 ans'] },
  { id: 'improvement', prompt: 'Quelle est la principale chose que vous aimeriez améliorer dans votre entreprise ?', options: ['Augmenter mon stock', 'Acheter du matériel', 'Agrandir mon local', 'Augmenter mes ventes', 'Importer davantage de produits', 'Autre'] },
  { id: 'barrier', prompt: "Qu’est-ce qui vous empêche aujourd’hui de faire grandir votre entreprise ?", placeholder: 'Expliquez-nous avec vos mots…', type: 'textarea' },
  { id: 'project', prompt: 'Si vous aviez les ressources nécessaires, que souhaiteriez-vous faire avec votre entreprise ?', placeholder: 'Décrivez votre projet…', type: 'textarea' },
  { id: 'resources', prompt: 'De quelles ressources pensez-vous avoir besoin pour réaliser votre projet ?', options: ['Moins de 1 000 $', '1 000 – 2 500 $', '2 500 – 5 000 $', '5 000 – 10 000 $', 'Plus de 10 000 $', 'Je ne sais pas encore'] },
  { id: 'partner', prompt: 'Pourquoi pensez-vous que SYKSS pourrait être un bon partenaire pour votre entreprise ?', placeholder: 'Votre réponse…', type: 'textarea' },
  { id: 'contact_method', prompt: 'Quel est le meilleur moyen de vous contacter ?', options: ['E-mail', 'SMS', 'WhatsApp'] },
  { id: 'contact_details', prompt: 'Quelle est votre adresse e-mail ou votre numéro de téléphone ?', placeholder: 'Exemple : nom@email.com ou +509 …', type: 'text' },
];

const app = document.querySelector('#app');
let step = -1;
const answers = {};

function start() { step = 0; renderQuestion(); }
function escapeHtml(value = '') { const div = document.createElement('div'); div.textContent = value; return div.innerHTML; }
function showIntro() {
  app.innerHTML = `<div class="intro"><span class="eyebrow">Questionnaire d’entreprise</span><h1>Présentez votre entreprise à SYKSS.</h1><p class="lead">Nous souhaitons découvrir votre entreprise, comprendre vos objectifs et apprendre comment nous pourrions éventuellement vous accompagner.</p><p class="hint">Cela prendra seulement quelques minutes.</p><div class="actions"><span></span><button class="button" id="start">Commencer <span aria-hidden="true">→</span></button></div></div>`;
  document.querySelector('#start').addEventListener('click', start);
}
function renderQuestion() {
  const q = questions[step]; const progress = ((step + 1) / questions.length) * 100;
  const prompt = typeof q.prompt === 'function' ? q.prompt() : q.prompt;
  const placeholder = typeof q.placeholder === 'function' ? q.placeholder() : q.placeholder;
  const choices = q.options ? `<div class="choice-list">${q.options.map(option => `<label class="choice"><input type="radio" name="answer" value="${escapeHtml(option)}" ${answers[q.id] === option ? 'checked' : ''}><span>${escapeHtml(option)}</span></label>`).join('')}</div>${q.options.includes('Autre') ? `<input id="other" class="field other-field" placeholder="Précisez votre réponse" value="${escapeHtml(answers[`${q.id}_other`] || '')}" ${answers[q.id] === 'Autre' ? '' : 'hidden'}>` : ''}` : q.type === 'textarea' ? `<textarea id="answer" placeholder="${placeholder}">${escapeHtml(answers[q.id] || '')}</textarea>` : `<input id="answer" class="field" type="text" placeholder="${placeholder}" value="${escapeHtml(answers[q.id] || '')}">`;
  const privacy = q.id === 'contact_details' ? `<label class="privacy"><input id="consent" type="checkbox" ${answers.consent ? 'checked' : ''}><span>J’accepte que SYKSS utilise ces informations uniquement pour me recontacter au sujet de mon entreprise.</span></label>` : '';
  app.innerHTML = `<div class="progress-row"><span>Question ${step + 1} sur ${questions.length}</span><span>${Math.round(progress)} %</span></div><div class="progress-track"><div class="progress-value" style="width:${progress}%"></div></div><div class="question"><span class="eyebrow">Parlons de votre entreprise</span><h2>${prompt}</h2>${choices}${privacy}<p id="error" class="error"></p><div class="actions"><button class="button secondary" id="back" ${step === 0 ? 'hidden' : ''}>Retour</button><button class="button" id="next">${step === questions.length - 1 ? 'Envoyer' : 'Continuer →'}</button></div></div>`;
  if (q.options && q.options.includes('Autre')) document.querySelectorAll('input[name="answer"]').forEach(input => input.addEventListener('change', () => { document.querySelector('#other').hidden = input.value !== 'Autre'; }));
  document.querySelector('#back').addEventListener('click', () => { save(false); step--; renderQuestion(); });
  document.querySelector('#next').addEventListener('click', submitStep);
  const first = document.querySelector('#answer'); if (first) first.focus();
}
function save(required = true) {
  const q = questions[step]; let value;
  if (q.options) { value = document.querySelector('input[name="answer"]:checked')?.value; if (value === 'Autre') answers[`${q.id}_other`] = document.querySelector('#other').value.trim(); }
  else value = document.querySelector('#answer').value.trim();
  if (q.id === 'contact_details') answers.consent = document.querySelector('#consent').checked;
  if (required && (!value || (value === 'Autre' && !answers[`${q.id}_other`]) || (q.id === 'contact_details' && !answers.consent))) return false;
  if (value) answers[q.id] = value;
  return true;
}
async function submitStep() {
  const error = document.querySelector('#error'); error.textContent = '';
  if (!save()) { error.textContent = questions[step].id === 'contact_details' ? 'Veuillez fournir vos coordonnées et accepter cette utilisation avant d’envoyer.' : 'Veuillez répondre à cette question avant de continuer.'; return; }
  if (step < questions.length - 1) { step++; renderQuestion(); return; }
  const button = document.querySelector('#next'); button.disabled = true; button.textContent = 'Envoi en cours…';
  try {
    const response = await fetch('/api/submit', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ answers, submittedAt: new Date().toISOString() }) });
    if (!response.ok) throw new Error('submit failed');
  } catch (_) {
    if (location.protocol !== 'file:') { button.disabled = false; button.textContent = 'Envoyer'; error.textContent = 'Le questionnaire ne peut pas être envoyé pour le moment. Veuillez réessayer plus tard.'; return; }
    localStorage.setItem('sykss-latest-application', JSON.stringify({ answers, submittedAt: new Date().toISOString() }));
    renderConfirmation(true); return;
  }
  renderConfirmation(false);
}
function renderConfirmation(isLocalTest) { app.innerHTML = `<div class="confirmation"><div class="confirmation-icon" aria-hidden="true">✓</div><span class="eyebrow">${isLocalTest ? 'Test terminé' : 'Questionnaire envoyé'}</span><h1>Merci d’avoir présenté votre entreprise à SYKSS.</h1><p>${isLocalTest ? 'Ceci est une version de test sur votre ordinateur : aucune réponse n’a été envoyée par e-mail.' : 'Nous allons prendre le temps d’examiner les informations que vous avez partagées. Si votre projet correspond à une opportunité de partenariat, nous vous contacterons pour discuter de la prochaine étape.'}</p><p><strong>SYKSS — Construire ensemble.</strong></p></div>`; }
showIntro();
