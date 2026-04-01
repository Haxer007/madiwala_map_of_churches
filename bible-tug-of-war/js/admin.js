import { db } from './firebase.js';

const ADMIN_PASSCODE = 'CHANGE_ME';

const passcodeGate = document.getElementById('passcodeGate');
const passcodeForm = document.getElementById('passcodeForm');
const passcodeInput = document.getElementById('passcodeInput');
const passcodeError = document.getElementById('passcodeError');
const adminApp = document.getElementById('adminApp');

const packSelect = document.getElementById('packSelect');
const packNameInput = document.getElementById('packName');
const newPackIdInput = document.getElementById('newPackId');
const newPackNameInput = document.getElementById('newPackName');
const savePackBtn = document.getElementById('savePackBtn');
const createPackBtn = document.getElementById('createPackBtn');
const fixEncodingBtn = document.getElementById('fixEncodingBtn');

const questionText = document.getElementById('questionText');
const questionAnswers = document.getElementById('questionAnswers');
const questionCorrect = document.getElementById('questionCorrect');
const addQuestionBtn = document.getElementById('addQuestionBtn');
const updateQuestionBtn = document.getElementById('updateQuestionBtn');
const resetFormBtn = document.getElementById('resetFormBtn');
const questionList = document.getElementById('questionList');

const matchIdInput = document.getElementById('matchIdInput');
const applyPackBtn = document.getElementById('applyPackBtn');
const applyStatus = document.getElementById('applyStatus');

let packs = {};
let currentPackId = null;
let editingIndex = null;

const DEFAULT_PACKS = {
  starter: {
    name: 'Starter Pack',
    questions: [
      { id: 's1', q: 'Who was the first man?', a: ['Adam', 'Moses', 'Noah', 'David'], c: 0 },
      { id: 's2', q: 'What did God tell Noah to build?', a: ['An Ark', 'A Temple', 'A Pyramid', 'A Boat'], c: 0 },
      { id: 's3', q: 'How many disciples did Jesus have?', a: ['12', '7', '3', '40'], c: 0 },
      { id: 's4', q: 'Who fought Goliath?', a: ['David', 'Samson', 'Joshua', 'Moses'], c: 0 },
      { id: 's5', q: 'Jesus was born in which town?', a: ['Bethlehem', 'Nazareth', 'Jerusalem', 'Egypt'], c: 0 },
      { id: 's6', q: 'Who was thrown into the lions� den?', a: ['Daniel', 'Jonah', 'Elijah', 'Joseph'], c: 0 }
    ]
  },
  ot_trivia: {
    name: 'OT Trivia',
    questions: [
      { id: 'ot1', q: 'What is the first book of the Bible?', a: ['Genesis', 'Exodus', 'Leviticus', 'Numbers'], c: 0 },
      { id: 'ot2', q: 'Who led the Israelites out of Egypt?', a: ['Moses', 'Aaron', 'Joshua', 'David'], c: 0 },
      { id: 'ot3', q: 'What did God create on the first day?', a: ['Light', 'Land', 'Plants', 'Stars'], c: 0 },
      { id: 'ot4', q: 'Who built the ark?', a: ['Noah', 'Abraham', 'Isaac', 'Jacob'], c: 0 },
      { id: 'ot5', q: 'Who was the strongest man in the Bible?', a: ['Samson', 'David', 'Goliath', 'Joshua'], c: 0 },
      { id: 'ot6', q: 'What sea did Moses split?', a: ['Red Sea', 'Dead Sea', 'Sea of Galilee', 'Mediterranean Sea'], c: 0 }
    ]
  },
  gospel_quiz: {
    name: 'Gospel Quiz',
    questions: [
      { id: 'g1', q: 'Who baptized Jesus?', a: ['John the Baptist', 'Peter', 'James', 'Matthew'], c: 0 },
      { id: 'g2', q: 'What was Jesus� first miracle?', a: ['Water to wine', 'Feeding 5000', 'Walking on water', 'Healing the blind'], c: 0 },
      { id: 'g3', q: 'Who walked on water toward Jesus?', a: ['Peter', 'John', 'Judas', 'Thomas'], c: 0 },
      { id: 'g4', q: 'Which disciple betrayed Jesus?', a: ['Judas Iscariot', 'Peter', 'Thomas', 'Matthew'], c: 0 },
      { id: 'g5', q: 'How many loaves did Jesus use to feed 5,000?', a: ['5', '2', '7', '12'], c: 0 },
      { id: 'g6', q: 'On what day did Jesus rise from the dead?', a: ['Third day', 'Second day', 'Fourth day', 'Seventh day'], c: 0 }
    ]
  }
};

async function ensureDefaultPacks() {
  const checks = await Promise.all(
    Object.keys(DEFAULT_PACKS).map((id) => db.collection('questionPacks').doc(id).get())
  );
  const batch = db.batch();
  let needsCommit = false;

  Object.keys(DEFAULT_PACKS).forEach((id, idx) => {
    if (!checks[idx].exists) {
      batch.set(db.collection('questionPacks').doc(id), DEFAULT_PACKS[id]);
      needsCommit = true;
    }
  });

  if (needsCommit) await batch.commit();
}

function showAdmin() {
  passcodeGate.classList.add('hide');
  adminApp.classList.remove('hide');
  ensureDefaultPacks().then(loadPacks);
}

function checkPasscode() {
  const ok = localStorage.getItem('adminPasscodeOk') === 'true';
  if (ok) showAdmin();
}

passcodeForm.addEventListener('submit', (e) => {
  e.preventDefault();
  if (passcodeInput.value === ADMIN_PASSCODE) {
    localStorage.setItem('adminPasscodeOk', 'true');
    passcodeError.style.display = 'none';
    showAdmin();
  } else {
    passcodeError.style.display = 'block';
  }
});

async function loadPacks() {
  const snap = await db.collection('questionPacks').get();
  packs = {};
  snap.forEach(doc => { packs[doc.id] = doc.data(); });

  const ids = Object.keys(packs).sort();
  packSelect.innerHTML = ids.map(id => `<option value="${id}">${packs[id].name || id}</option>`).join('');
  if (!currentPackId && ids.length) currentPackId = ids[0];
  if (currentPackId) packSelect.value = currentPackId;
  renderPack();
}

function renderPack() {
  if (!currentPackId || !packs[currentPackId]) return;
  const pack = packs[currentPackId];
  packNameInput.value = pack.name || currentPackId;

  questionList.innerHTML = '';
  const questions = pack.questions || [];
  questions.forEach((q, idx) => {
    const item = document.createElement('div');
    item.className = 'question-item';
    item.innerHTML = `
      <strong>${idx + 1}. ${q.q}</strong>
      <div>Answers: ${q.a.join(' | ')}</div>
      <div>Correct: ${q.c}</div>
      <button data-index="${idx}">Delete</button>
    `;
    item.addEventListener('click', () => selectQuestion(idx));
    item.querySelector('button').addEventListener('click', (e) => {
      e.stopPropagation();
      deleteQuestion(idx);
    });
    questionList.appendChild(item);
  });
}

function selectQuestion(idx) {
  const pack = packs[currentPackId];
  if (!pack) return;
  const q = pack.questions[idx];
  if (!q) return;
  editingIndex = idx;
  questionText.value = q.q;
  questionAnswers.value = q.a.join(', ');
  questionCorrect.value = q.c;
}

function resetForm() {
  editingIndex = null;
  questionText.value = '';
  questionAnswers.value = '';
  questionCorrect.value = 0;
}

function normalizeQuestionInput() {
  const text = questionText.value.trim();
  const answers = questionAnswers.value.split(',').map(a => a.trim()).filter(Boolean);
  const correct = Math.max(0, Math.min(answers.length - 1, parseInt(questionCorrect.value, 10) || 0));

  if (!text || answers.length < 2) {
    alert('Please add a question and at least two answers.');
    return null;
  }

  return {
    id: `q_${Date.now()}`,
    q: text,
    a: answers,
    c: correct
  };
}

function fixMojibake(text) {
  if (!text || typeof text !== 'string') return text;
  return text
    .replace(/â€œ/g, '“')
    .replace(/â€/g, '”')
    .replace(/â€˜/g, '‘')
    .replace(/â€™/g, '’')
    .replace(/â€‘/g, '‑')
    .replace(/â€“/g, '–')
    .replace(/â€”/g, '—')
    .replace(/â€¦/g, '…')
    .replace(/â€¯/g, ' ')
    .replace(/â€¢/g, '•');
}

async function fixAllPacksEncoding() {
  const snap = await db.collection('questionPacks').get();
  const batch = db.batch();
  let touched = 0;

  snap.forEach(doc => {
    const data = doc.data() || {};
    const questions = (data.questions || []).map(q => ({
      ...q,
      q: fixMojibake(q.q),
      a: Array.isArray(q.a) ? q.a.map(ans => fixMojibake(ans)) : q.a
    }));
    batch.set(doc.ref, { questions }, { merge: true });
    touched++;
  });

  if (touched) {
    await batch.commit();
    await loadPacks();
  }
}

async function savePackQuestions(questions) {
  await db.collection('questionPacks').doc(currentPackId).set({ questions }, { merge: true });
  packs[currentPackId].questions = questions;
  renderPack();
}

async function deleteQuestion(idx) {
  const pack = packs[currentPackId];
  if (!pack) return;
  const questions = (pack.questions || []).filter((_, i) => i !== idx);
  await savePackQuestions(questions);
}

addQuestionBtn.addEventListener('click', async () => {
  const pack = packs[currentPackId];
  if (!pack) return;
  const q = normalizeQuestionInput();
  if (!q) return;
  const questions = [...(pack.questions || []), q];
  await savePackQuestions(questions);
  resetForm();
});

updateQuestionBtn.addEventListener('click', async () => {
  const pack = packs[currentPackId];
  if (!pack || editingIndex === null) return;
  const q = normalizeQuestionInput();
  if (!q) return;
  const questions = [...(pack.questions || [])];
  questions[editingIndex] = { ...q, id: questions[editingIndex].id || q.id };
  await savePackQuestions(questions);
  resetForm();
});

resetFormBtn.addEventListener('click', resetForm);

packSelect.addEventListener('change', (e) => {
  currentPackId = e.target.value;
  renderPack();
  resetForm();
});

savePackBtn.addEventListener('click', async () => {
  if (!currentPackId) return;
  const name = packNameInput.value.trim() || currentPackId;
  await db.collection('questionPacks').doc(currentPackId).set({ name }, { merge: true });
  packs[currentPackId].name = name;
  await loadPacks();
});

createPackBtn.addEventListener('click', async () => {
  const id = newPackIdInput.value.trim();
  if (!id) {
    alert('Enter a pack id.');
    return;
  }
  const name = newPackNameInput.value.trim() || id;
  await db.collection('questionPacks').doc(id).set({ name, questions: [] }, { merge: true });
  newPackIdInput.value = '';
  newPackNameInput.value = '';
  currentPackId = id;
  await loadPacks();
});

if (fixEncodingBtn) {
  fixEncodingBtn.addEventListener('click', async () => {
    await fixAllPacksEncoding();
    alert('Encoding fix applied.');
  });
}

applyPackBtn.addEventListener('click', async () => {
  const matchId = matchIdInput.value.trim();
  if (!matchId) {
    applyStatus.textContent = 'Enter a match id.';
    return;
  }
  if (!currentPackId) {
    applyStatus.textContent = 'Select a pack first.';
    return;
  }
  await db.collection('matches').doc(matchId).set({
    settings: {
      questionMode: 'customPack',
      customPackId: currentPackId,
      category: currentPackId
    }
  }, { merge: true });
  applyStatus.textContent = `Applied pack "${currentPackId}" to ${matchId}.`;
});

checkPasscode();

