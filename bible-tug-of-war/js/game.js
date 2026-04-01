import { db, serverTimestamp } from './firebase.js';

const SoundFX = {
    ctx: null,
    master: null,
    musicTimer: null,
    musicStep: 0,
    init() {
        if (!this.ctx) {
            this.ctx = new (window.AudioContext || window.webkitAudioContext)();
            this.master = this.ctx.createGain();
            this.master.gain.value = 0.35;
            this.master.connect(this.ctx.destination);
        }
    },

    tone(freq, duration = 0.2, type = 'sine', vol = 0.08, targetFreq = null) {
        if (!this.ctx) return;

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const filter = this.ctx.createBiquadFilter();

        osc.type = type;
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

        if (targetFreq) {
            osc.frequency.exponentialRampToValueAtTime(targetFreq, this.ctx.currentTime + duration);
        }

        filter.type = 'lowpass';
        filter.frequency.value = 1800;

        gain.gain.setValueAtTime(vol, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.master);

        osc.start();
        osc.stop(this.ctx.currentTime + duration);
    },

    noiseBurst(duration = 0.12, vol = 0.05) {
        if (!this.ctx) return;

        const bufferSize = this.ctx.sampleRate * duration;
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);

        for (let i = 0; i < bufferSize; i++) {
            data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
        }

        const src = this.ctx.createBufferSource();
        const gain = this.ctx.createGain();
        const filter = this.ctx.createBiquadFilter();

        filter.type = 'highpass';
        filter.frequency.value = 500;
        gain.gain.value = vol;

        src.buffer = buffer;
        src.connect(filter);
        filter.connect(gain);
        gain.connect(this.master);

        src.start();
    },

    click() {
        this.init();
        this.tone(880, 0.08, 'triangle', 0.05);
    },

    correct() {
        this.init();
        this.tone(659.25, 0.12, 'sine', 0.08);
        setTimeout(() => this.tone(783.99, 0.15, 'sine', 0.08), 80);
    },

    wrong() {
        this.init();
        this.tone(180, 0.24, 'sawtooth', 0.08, 90);
        this.noiseBurst(0.15, 0.03);
    },

    tug() {
        this.init();
        this.tone(220, 0.12, 'triangle', 0.08, 130);
    },

    win() {
        this.init();
        [523.25, 659.25, 783.99, 1046.5].forEach((f, i) => {
            setTimeout(() => this.tone(f, 0.2, 'sine', 0.07), i * 120);
        });
    },

    startAmbient() {
        if (!this.ctx || this.musicTimer) return;

        const chords = [
            [261.63, 329.63, 392.00],
            [196.00, 246.94, 293.66],
            [220.00, 277.18, 329.63],
            [174.61, 220.00, 261.63],
        ];

        this.musicTimer = setInterval(() => {
            if (!this.ctx) return;

            const chord = chords[this.musicStep % chords.length];
            chord.forEach((freq, i) => {
                setTimeout(() => this.tone(freq / 2, 0.7, 'sine', 0.015), i * 35);
            });

            this.musicStep++;
        }, 2200);
    },

    stopAmbient() {
        if (this.musicTimer) {
            clearInterval(this.musicTimer);
            this.musicTimer = null;
        }
    }
};

document.body.addEventListener('click', () => {
    SoundFX.init();
    SoundFX.startAmbient();
}, { once: true });

const SETTINGS = {
    pullStrength: 12,
    stunMs: 3000,
    ropeAnimMs: 650,
    winThreshold: 100,
    avatarColours: ['#e53935', '#1e88e5', '#43a047', '#fdd835', '#8e24aa', '#ff6f00'],
    avatarSize: { w: 80, h: 120 },
    questionTimer: 15
};

const STARTER_QUESTIONS = [
    { id: "q1", q: "How many days did God create the world?", a: ["7", "1", "40", "12"], c: 0 },
    { id: "q2", q: "Who was the first man?", a: ["Adam", "Moses", "Noah", "David"], c: 0 },
    { id: "q3", q: "What did God tell Noah to build?", a: ["An Ark", "A Temple", "A Pyramid", "A Boat"], c: 0 },
    { id: "q4", q: "How many of each animal went onto the ark?", a: ["Two", "Ten", "Seven", "One"], c: 0 },
    { id: "q5", q: "Who fought Goliath?", a: ["David", "Samson", "Joshua", "Moses"], c: 0 },
    { id: "q6", q: "What was Goliath?", a: ["A Giant", "A King", "A Priest", "A Soldier"], c: 0 },
    { id: "q7", q: "Jesus was born in which town?", a: ["Bethlehem", "Nazareth", "Jerusalem", "Egypt"], c: 0 },
    { id: "q8", q: "How many disciples did Jesus have?", a: ["12", "7", "3", "40"], c: 0 },
    { id: "q9", q: "Who betrayed Jesus?", a: ["Judas", "Peter", "Thomas", "Matthew"], c: 0 },
    { id: "q10", q: "How many loaves and fish did Jesus use to feed 5 000?", a: ["5 and 2", "12 and 7", "2 and 2", "1 and 1"], c: 0 },
    { id: "q11", q: "What did Jesus turn water into?", a: ["Wine", "Milk", "Bread", "Oil"], c: 0 },
    { id: "q12", q: "Who was thrown into the lions den?", a: ["Daniel", "Jonah", "Elijah", "Joseph"], c: 0 },
    { id: "q13", q: "Who got swallowed by a big fish?", a: ["Jonah", "Noah", "Moses", "Job"], c: 0 },
    { id: "q14", q: "Which queen saved her people by becoming a spy?", a: ["Esther", "Ruth", "Miriam", "Deborah"], c: 0 },
    { id: "q15", q: "Who built the ark?", a: ["Noah", "Abraham", "Isaac", "Jacob"], c: 0 },
    { id: "q16", q: "What is the first book of the Bible?", a: ["Genesis", "Exodus", "Leviticus", "Numbers"], c: 0 },
    { id: "q17", q: "Who led the Israelites out of Egypt?", a: ["Moses", "Aaron", "Joshua", "David"], c: 0 },
    { id: "q18", q: "How many people were on the ark?", a: ["Eight", "Six", "Four", "Ten"], c: 0 },
    { id: "q19", q: "What did God create on the fourth day?", a: ["Sun, Moon, Stars", "Land, Plants", "Animals", "Humans"], c: 0 },
    { id: "q20", q: "Who was the strongest man in the Bible?", a: ["Samson", "David", "Goliath", "Joshua"], c: 0 },
    { id: "q21", q: "What miracle did Jesus perform at the wedding in Cana?", a: ["Turned Water into Wine", "Healed the Blind", "Walked on Water", "Fed 5 000"], c: 0 },
    { id: "q22", q: "Who was the mother of Samuel?", a: ["Hannah", "Sarah", "Rebecca", "Leah"], c: 0 },
    { id: "q23", q: "Which prophet was swallowed by a great fish?", a: ["Jonah", "Elijah", "Elisha", "Jeremiah"], c: 0 },
    { id: "q24", q: "What was the name of Abraham’s wife?", a: ["Sarah", "Rebecca", "Rachel", "Leah"], c: 0 },
    { id: "q25", q: "How many plagues did God send upon Egypt?", a: ["Ten", "Seven", "Twelve", "Five"], c: 0 },
    { id: "q26", q: "Who was the first king of Israel?", a: ["Saul", "David", "Solomon", "Josiah"], c: 0 },
    { id: "q27", q: "What is the shortest verse in the Bible?", a: ["Jesus wept.", "God is love.", "I am.", "Amen."], c: 0 },
    { id: "q28", q: "Who was the tax collector that became a disciple?", a: ["Matthew", "Mark", "Luke", "John"], c: 0 },
    { id: "q29", q: "Which apostle doubted Jesus’s resurrection until he saw his wounds?", a: ["Thomas", "Peter", "James", "John"], c: 0 },
    { id: "q30", q: "What animal did God give to Noah after the flood?", a: ["A dove with an olive branch", "A raven", "A sparrow", "A crow"], c: 0 },
    { id: "q31", q: "Who was the mother of John the Baptist?", a: ["Elizabeth", "Mary", "Martha", "Anna"], c: 0 },
    { id: "q32", q: "What garden did Adam and Eve live in?", a: ["Eden", "Gilead", "Canaan", "Jericho"], c: 0 },
    { id: "q33", q: "Who was the first martyr in the New Testament?", a: ["Stephen", "James", "Peter", "Paul"], c: 0 },
    { id: "q34", q: "Which book tells the story of a dream‑interpretation by Joseph?", a: ["Genesis", "Exodus", "Numbers", "Deuteronomy"], c: 0 },
    { id: "q35", q: "What was the name of the giant that fell on a pile of stones?", a: ["Goliath", "Nabal", "Adonijah", "Abimelech"], c: 0 },
    { id: "q36", q: "Which prophet challenged the priests of Baal on Mount Carmel?", a: ["Elijah", "Elisha", "Isaiah", "Jeremiah"], c: 0 },
    { id: "q37", q: "How many people were saved in the boat during the flood?", a: ["Eight", "Six", "Four", "Ten"], c: 0 },
    { id: "q38", q: "What is the name of the last book of the Old Testament?", a: ["Malachi", "Zechariah", "Haggai", "Habakkuk"], c: 0 },
    { id: "q39", q: "Who was the first woman mentioned in the Bible?", a: ["Eve", "Sarah", "Rebecca", "Leah"], c: 0 },
    { id: "q40", q: "What miracle did Jesus perform for a blind man named Bartimaeus?", a: ["He gave him sight", "He healed his foot", "He fed him", "He raised him from dead"], c: 0 },
    { id: "q41", q: "Which king built the First Temple in Jerusalem?", a: ["Solomon", "David", "Hezekiah", "Josiah"], c: 0 },
    { id: "q42", q: "Who was the son of Abraham and Sarah?", a: ["Isaac", "Jacob", "Esau", "Ishmael"], c: 0 },
    { id: "q43", q: "What is the name of the sea that Moses split?", a: ["Red Sea", "Dead Sea", "Sea of Galilee", "Mediterranean Sea"], c: 0 },
    { id: "q44", q: "Which disciple betrayed Jesus for 30 pieces of silver?", a: ["Judas Iscariot", "Peter", "John", "James"], c: 0 },
    { id: "q45", q: "What was the name of the mountain where Jesus was transfigured?", a: ["Mount Tabor", "Mount Sinai", "Mount Zion", "Mount Olive"], c: 0 },
    { id: "q46", q: "Who was the mother of Moses?", a: ["Jochebed", "Sarah", "Rebecca", "Rachel"], c: 0 },
    { id: "q47", q: "What did God create on the first day?", a: ["Light", "Land", "Plants", "Stars"], c: 0 },
    { id: "q48", q: "Who was the first person to see a rainbow according to Genesis?", a: ["Noah", "Abraham", "Moses", "David"], c: 0 },
    { id: "q49", q: "What was the name of the garden where Jesus prayed before his arrest?", a: ["Gethsemane", "Olive Grove", "Mount of Olives", "Bethany"], c: 0 },
    { id: "q50", q: "Which Old Testament figure is known for his patience?", a: ["Job", "David", "Solomon", "Samuel"], c: 0 },
    { id: "q51", q: "Who was the king who wrote many of the Psalms?", a: ["David", "Solomon", "Saul", "Hezekiah"], c: 0 },
    { id: "q52", q: "How many people lived on the Ark?", a: ["Eight", "Six", "Four", "Ten"], c: 0 },
    { id: "q53", q: "Which prophet was taken up to heaven in a whirlwind?", a: ["Elijah", "Elisha", "Jeremiah", "Isaiah"], c: 0 },
    { id: "q54", q: "What is the name of the river where John the Baptist baptized Jesus?", a: ["Jordan", "Nile", "Euphrates", "Tigris"], c: 0 },
    { id: "q55", q: "Who was the first to hear God’s voice in a burning bush?", a: ["Moses", "Aaron", "Joshua", "Caleb"], c: 0 },
    { id: "q56", q: "What gifts did the Wise Men bring to baby Jesus?", a: ["Gold, Frankincense, Myrrh", "Silver, Gold, Oil", "Spice, Honey, Bread", "Wine, Bread, Oil"], c: 0 },
    { id: "q57", q: "Which book contains the story of the Prodigal Son?", a: ["Luke", "Matthew", "Mark", "John"], c: 0 },
    { id: "q58", q: "Who was the first Christian martyr recorded in Acts?", a: ["Stephen", "James", "Peter", "Paul"], c: 0 },
    { id: "q59", q: "Which apostle is known as the “rock” on which the Church was built?", a: ["Peter", "John", "Andrew", "James"], c: 0 },
    { id: "q60", q: "What was the youngest son of Jacob?", a: ["Benjamin", "Joseph", "Judah", "Levi"], c: 0 },
    { id: "q61", q: "Who was the mother of John the Baptist?", a: ["Elizabeth", "Mary", "Martha", "Anna"], c: 0 },
    { id: "q62", q: "Which disciple is called the “beloved disciple”?", a: ["John", "Peter", "James", "Andrew"], c: 0 }
];

const OT_TRIVIA_QUESTIONS = [
    { id: "ot1", q: "What is the first book of the Bible?", a: ["Genesis", "Exodus", "Leviticus", "Numbers"], c: 0 },
    { id: "ot2", q: "Who led the Israelites out of Egypt?", a: ["Moses", "Aaron", "Joshua", "David"], c: 0 },
    { id: "ot3", q: "What did God create on the first day?", a: ["Light", "Land", "Plants", "Stars"], c: 0 },
    { id: "ot4", q: "Who built the ark?", a: ["Noah", "Abraham", "Isaac", "Jacob"], c: 0 },
    { id: "ot5", q: "Who was the strongest man in the Bible?", a: ["Samson", "David", "Goliath", "Joshua"], c: 0 },
    { id: "ot6", q: "What sea did Moses split?", a: ["Red Sea", "Dead Sea", "Sea of Galilee", "Mediterranean Sea"], c: 0 },
    { id: "ot7", q: "Who fought Goliath?", a: ["David", "Samson", "Joshua", "Moses"], c: 0 },
    { id: "ot8", q: "Who was thrown into the lions� den?", a: ["Daniel", "Jonah", "Elijah", "Joseph"], c: 0 }
];

const GOSPEL_QUIZ_QUESTIONS = [
    { id: "g1", q: "In what city was Jesus born?", a: ["Bethlehem", "Nazareth", "Jerusalem", "Capernaum"], c: 0 },
    { id: "g2", q: "Who baptized Jesus?", a: ["John the Baptist", "Peter", "James", "Matthew"], c: 0 },
    { id: "g3", q: "What was Jesus' first miracle?", a: ["Water to wine", "Feeding 5000", "Walking on water", "Healing the blind"], c: 0 },
    { id: "g4", q: "How many disciples did Jesus choose?", a: ["12", "10", "7", "40"], c: 0 },
    { id: "g5", q: "Who walked on water towards Jesus?", a: ["Peter", "John", "Judas", "Thomas"], c: 0 },
    { id: "g6", q: "How many loaves of bread did Jesus use to feed the 5000?", a: ["5", "2", "7", "12"], c: 0 },
    { id: "g7", q: "Which disciple betrayed Jesus?", a: ["Judas Iscariot", "Peter", "Thomas", "Matthew"], c: 0 },
    { id: "g8", q: "Which disciple denied Jesus three times?", a: ["Peter", "John", "Judas", "Andrew"], c: 0 },
    { id: "g9", q: "Who was the Roman governor that sentenced Jesus?", a: ["Pilate", "Herod", "Caesar", "Augustus"], c: 0 },
    { id: "g10", q: "On what day did Jesus rise from the dead?", a: ["Third day", "Second day", "Fourth day", "Seventh day"], c: 0 }
];

const PACK_SEED = {
    starter: STARTER_QUESTIONS,
    ot_trivia: OT_TRIVIA_QUESTIONS,
    gospel_quiz: GOSPEL_QUIZ_QUESTIONS
};

let matchRef;
let packsRef;
let unsubscribeMatch = null;
let matchId = null;
let playerTeam = null;
let viewMode = null;
let allQuestions = [];
let isLoadingQuestion = false;
let lastKnownState = null;
let questionStartTime = 0;
let buzzerPlayed = false;
let heartbeatInterval = null;
let currentQuestionId = null;
let pullFlash = null;
let isProcessingRound = false;
let ropeEl = null;
let ropeLineEl = null;
let ropeHighlightEl = null;
let ropePoints = [];
let ropeLastSize = { w: 0, h: 0 };
const ROPE_SEGMENTS = 14;
const armState = {
    0: { l: 0, r: 0, lv: 0, rv: 0, hx: 0, hy: 0, hvx: 0, hvy: 0 },
    1: { l: 0, r: 0, lv: 0, rv: 0, hx: 0, hy: 0, hvx: 0, hvy: 0 }
};
let ropeTarget = 0;
let ropePos = 0;
let ropeVel = 0;
let ropeWave = 0;
let ropeAnimating = false;

const PACK_IDS = ['starter', 'ot_trivia', 'gospel_quiz'];

function newMatchId() {
    return 'm_' + Math.random().toString(36).substr(2, 9);
}

function logDebug(msg) {
    console.log(msg);
    const d = document.getElementById('debug');
    if (d) {
        const div = document.createElement('div');
        div.textContent = `[${new Date().toLocaleTimeString()}] ${msg}`;
        d.appendChild(div);
        d.scrollTop = d.scrollHeight;
    }
}

function getMatchRef(id) {
    return db.collection('matches').doc(id);
}

function getPackRef(id) {
    return db.collection('questionPacks').doc(id);
}

function getLeaderboardRef() {
    return db.collection('leaderboard');
}

async function ensureQuestionPacks() {
    try {
        const checks = await Promise.all(
            PACK_IDS.map((id) => getPackRef(id).get())
        );

        const missing = PACK_IDS.filter((id, idx) => !checks[idx].exists);
        if (!missing.length) return;

        const batch = db.batch();
        missing.forEach((id) => {
            batch.set(getPackRef(id), {
                name: id[0].toUpperCase() + id.slice(1),
                questions: PACK_SEED[id] || []
            });
        });
        await batch.commit();
        logDebug(`Seeded question packs: ${missing.join(', ')}`);
    } catch (e) {
        logDebug(`!!! PACK SEED ERROR: ${e.message}`);
    }
}

function showConfirm(message) {
    return new Promise(resolve => {
        const modal = document.getElementById("globalConfirmModal");
        const msg = document.getElementById("confirmMessage");
        const yes = document.getElementById("confirmYesBtn");
        const no = document.getElementById("confirmNoBtn");

        msg.textContent = message;
        modal.classList.add("active");

        function cleanup() {
            modal.classList.remove("active");
            yes.onclick = null;
            no.onclick = null;
        }

        yes.onclick = () => {
            cleanup();
            resolve(true);
        };

        no.onclick = () => {
            cleanup();
            resolve(false);
        };
    });
}

function setView(mode) {
    viewMode = mode;
    if (mode === 'red') playerTeam = 0;
    if (mode === 'blue') playerTeam = 1;

    const params = new URLSearchParams(window.location.search);
    matchId = params.get('MATCH') || params.get('MATCH_ID');

    if (!matchId) {
        matchId = localStorage.getItem('matchId') || newMatchId();
        localStorage.setItem('matchId', matchId);
    }

    params.set('MATCH', matchId);
    params.set('ROLE', mode);
    window.history.replaceState({}, '', '?' + params.toString());

    document.getElementById('viewSelectors').classList.add('hide');

    document.body.classList.toggle('projector-mode', mode === 'projector');


    document.getElementById('resetBtn').classList.toggle('hide', mode !== 'projector');
    document.getElementById('settingsBtn').classList.toggle('hide', mode !== 'projector');
    document.getElementById('leaderboardBtn').classList.toggle('hide', mode !== 'projector');
    document.getElementById('debugBtn').classList.toggle('hide', mode !== 'projector');

    initGame();
}

function initGame() {
    const gameDiv = document.getElementById('game');
    gameDiv.innerHTML = '';

    if (heartbeatInterval) {
        clearInterval(heartbeatInterval);
    }

    logDebug(`Initializing Match ${matchId}...`);

    ensureQuestionPacks().then(() => {
        matchRef = getMatchRef(matchId);
        matchRef.get().then(snap => {
            const exists = snap.exists;
            const data = snap.data();

            if (viewMode === 'projector') {
                if (!exists || (data && data.status === 'finished')) {
                    createMatch();
                }
            } else if (!exists) {
                gameDiv.innerHTML = '<div class="card"><h3>Looking for match...</h3><p>Ensure the Projector is open and ready.</p></div>';
            }

            joinMatch(matchId);
        }).catch(e => {
            logDebug(`!!! MATCH READ ERROR: ${e.message}`);
            if (e.message.includes('permission_denied')) {
                alert('Firebase Error: Make sure your Firestore rules allow access for testing.');
            }
        });
    });

    heartbeatInterval = setInterval(() => {
        if (!lastKnownState) return;

        const state = lastKnownState;
        const now = Date.now();
        const timerEls = document.querySelectorAll('.timerBox');

        if (state.question && state.status !== 'finished') {
            const limit = (state.settings?.questionTimer || SETTINGS.questionTimer) * 1000;
            const startAt = toMillis(state.questionStartedAt) || questionStartTime || now;
            const elapsed = now - startAt;
            const remain = Math.ceil((limit - elapsed) / 1000);

            timerEls.forEach(timerEl => {
                if (remain > 0) {
                    timerEl.textContent = `⏱ ${remain}s`;
                    timerEl.classList.remove('timerAlert');
                } else {
                    timerEl.textContent = '⏰ ANSWER NOW!';
                    timerEl.classList.add('timerAlert');
                    if (!buzzerPlayed) {
                        SoundFX.wrong();
                        buzzerPlayed = true;
                    }
                }
            });
        } else {
            timerEls.forEach(timerEl => {
                timerEl.textContent = '';
                timerEl.classList.remove('timerAlert');
            });
        }

        if (viewMode !== 'projector' && state.status === 'active' && state.question) {
            const myStunned = state.stunned ? state.stunned[playerTeam] : 0;
            const isStunned = now < myStunned;
            const buttons = document.querySelectorAll('.answers button');
            buttons.forEach(btn => btn.disabled = isStunned);

            const stunText = document.getElementById('stunTimerText');
            if (isStunned) {
                const remaining = Math.ceil((myStunned - now) / 1000);
                if (stunText) stunText.textContent = `⚡ Stunned! Wait ${remaining}s`;
            }
        }
    }, 500);
}
function toggleDebugConsole() {
    if (!matchRef || !lastKnownState) return;

    const current = lastKnownState.settings?.showDebug !== false;

    matchRef.update({
        'settings.showDebug': !current
    }).catch(e => logDebug(`!!! DEBUG TOGGLE ERROR: ${e.message}`));
}

function createMatch() {
    logDebug('Creating match...');
    matchRef = getMatchRef(matchId);

    matchRef.set({
        status: 'waiting',
        rope: 0,
        stunned: { 0: 0, 1: 0 },
        usedIds: [],
        question: null,
        questionStartedAt: 0,
        currentQuestionId: null,
        answers: { 0: null, 1: null },
        winner: null,
        lastAction: null,
        settings: {
            gameMode: 'tug',
            stunMs: SETTINGS.stunMs,
            pullStrength: SETTINGS.pullStrength,
            winThreshold: SETTINGS.winThreshold,
            questionTimer: SETTINGS.questionTimer,
            category: 'starter',
            questionMode: 'category',
            customPackId: 'starter',
            showDebug: true
        },

        teams: {
            0: { name: '', score: 0, corrects: 0, wrongs: 0, avatarId: 'classic', shirt: SETTINGS.avatarColours[0] },
            1: { name: '', score: 0, corrects: 0, wrongs: 0, avatarId: 'classic', shirt: SETTINGS.avatarColours[1] }
        }
    }).catch(e => logDebug(`!!! MATCH CREATE ERROR: ${e.message}`));
}

function openSettingsModal() {
    if (!lastKnownState) return;
    const currentSettings = lastKnownState.settings || SETTINGS;
    document.getElementById('setStun').value = Math.round((currentSettings.stunMs || SETTINGS.stunMs) / 1000);
    document.getElementById('setPull').value = currentSettings.pullStrength || SETTINGS.pullStrength;
    document.getElementById('setWin').value = currentSettings.winThreshold || SETTINGS.winThreshold;
    document.getElementById('setTimer').value = currentSettings.questionTimer || SETTINGS.questionTimer;
    document.getElementById('setCategory').value = currentSettings.category || 'starter';
    document.getElementById('settingsModal').classList.add('active');
    if (typeof SoundFX !== 'undefined' && !SoundFX.ctx) SoundFX.init();
}

function closeSettingsModal() {
    document.getElementById('settingsModal').classList.remove('active');
}

function openLeaderboardModal() {
    document.getElementById('leaderboardModal').classList.add('active');
    const contentDiv = document.getElementById('leaderboardContent');
    contentDiv.innerHTML = '<p>Fetching global scores...</p>';

    getLeaderboardRef().orderBy('score', 'desc').limit(10).get().then(snap => {
        if (snap.empty) {
            contentDiv.innerHTML = '<p>No scores recorded yet. Play a match to get on the board!</p>';
            return;
        }

        const scores = snap.docs.map(doc => ({ key: doc.id, ...doc.data() }));

        let html = `
                    <table class="leaderboard-table" style="width:100%; text-align:left;">
                        <thead>
                            <tr style="border-bottom: 2px solid rgba(0,0,0,0.1);">
                                <th>Rank</th>
                                <th>Team Name</th>
                                <th>Score</th>
                                <th>Date</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                `;

        scores.forEach((entry, idx) => {
            const rowClass = idx === 0 ? 'color: #b8860b; font-weight: 900;' :
                idx === 1 ? 'color: #7f8c8d; font-weight: 800;' :
                    idx === 2 ? 'color: #a97142; font-weight: 800;' : '';

            const dateObj = entry.date && entry.date.toDate ? entry.date.toDate() : (entry.date ? new Date(entry.date) : null);
            const dateStr = dateObj ? dateObj.toLocaleDateString() : 'Unknown';

            html += `
                        <tr style="border-bottom: 1px solid rgba(0,0,0,0.08); ${rowClass}">
                            <td>#${idx + 1}</td>
                            <td>${entry.name || '-'}</td>
                            <td>${entry.score || 0}</td>
                            <td style="font-size:0.85rem; opacity:0.75;">${dateStr}</td>
                            <td>
                                <button onclick="deleteLeaderboard('${entry.key}')"
                                    style="background:#b91c1c;border:none;color:white;padding:6px 10px;border-radius:8px;cursor:pointer;font-weight:700;">
                                    🗑 Delete
                                </button>
                            </td>
                        </tr>
                    `;
        });

        html += `</tbody></table>`;
        contentDiv.innerHTML = html;
    }).catch(err => {
        contentDiv.innerHTML = `<p style="color:red;">Failed to load leaderboard...</p>`;
    });

    if (typeof SoundFX !== 'undefined' && !SoundFX.ctx) SoundFX.init();
}

function closeLeaderboardModal() {
    document.getElementById('leaderboardModal').classList.remove('active');
}

async function deleteLeaderboard(id) {
    if (!await showConfirm("Delete this leaderboard entry?")) return;

    getLeaderboardRef().doc(id).delete()
        .then(() => {
            alert("Entry deleted");
            openLeaderboardModal();
        })
        .catch(err => {
            alert("Failed to delete entry");
            console.error(err);
        });
}

function saveSettings() {
    const stunSec = parseInt(document.getElementById('setStun').value) || 0;
    const pullStr = parseInt(document.getElementById('setPull').value) || SETTINGS.pullStrength;
    const winThresh = parseInt(document.getElementById('setWin').value) || SETTINGS.winThreshold;
    const category = document.getElementById('setCategory').value;
    const timer = parseInt(document.getElementById('setTimer').value) || SETTINGS.questionTimer;

    matchRef.update({
        'settings.stunMs': stunSec * 1000,
        'settings.pullStrength': pullStr,
        'settings.winThreshold': winThresh,
        'settings.category': category,
        'settings.questionTimer': timer
    }).then(() => {
        closeSettingsModal();
        logDebug('Settings saved and applied across all clients.');
    }).catch(e => {
        alert('Error saving settings: ' + e.message);
    });
}

function toMillis(ts) {
    if (!ts) return 0;
    if (typeof ts === 'number') return ts;
    if (ts.toMillis) return ts.toMillis();
    return 0;
}

function setRopeTarget(px) {
    ropeTarget = px;
    if (!ropeAnimating) {
        ropeAnimating = true;
        requestAnimationFrame(animateRope);
    }
}

function animateRope() {
    const delta = ropeTarget - ropePos;
    ropeVel += delta * 0.12;
    ropeVel *= 0.75;
    ropePos += ropeVel;
    ropeWave += 0.9;

    // Slide the tug video wrapper based on rope position
    const tugWrapper = document.getElementById('tugVideoWrapper');
    if (tugWrapper) {
        const winThresh = (lastKnownState?.settings?.winThreshold) || 100;
        // Map ropePos to ±110px slide (proportional to win threshold)
        const maxSlide = 110;
        // Blue is Left, Red is Right.
        // ropePos > 0 (Blue winning) -> slide LEFT (negative)
        // ropePos < 0 (Red winning) -> slide RIGHT (positive)
        const slide = -Math.max(-maxSlide, Math.min(maxSlide, (ropePos / winThresh) * maxSlide));
        tugWrapper.style.transform = `translateX(${slide.toFixed(2)}px)`;

        // Also move the flag indicator
        const flag = document.getElementById('tugFlag');
        if (flag) {
            const pct = 50 + (slide / maxSlide) * 35;
            flag.style.left = `${pct.toFixed(1)}%`;
        }
    } else {
        // Legacy fallback for sprite mode
        const mode = (lastKnownState?.settings && lastKnownState.settings.gameMode) || 'tug';
        if (mode === 'tug') {
            const redSlot = document.querySelector('.team-slot.red');
            const blueSlot = document.querySelector('.team-slot.blue');
            if (redSlot && blueSlot) {
                const motion = Math.max(-220, Math.min(220, ropePos * 1.8));
                redSlot.style.transform = `translateX(${motion}px)`;
                blueSlot.style.transform = `translateX(${-motion}px)`;
            }
        }
        if (ropeEl) {
            ropeEl.style.setProperty('--offset', `${ropePos.toFixed(2)}px`);
            ropeEl.style.setProperty('--wave', `${ropeWave.toFixed(2)}px`);
            updateRopePath();
        }
        updateArmPhysics();
        updateRopePath();
    }

    requestAnimationFrame(animateRope);
}

function updateArmPhysics() {
    const now = Date.now();
    const lastAction = lastKnownState?.lastAction;
    const recentPull = lastAction && (now - toMillis(lastAction.time)) < 900;
    [0, 1].forEach((teamIdx) => {
        const el = document.querySelector(`.team-slot.${teamIdx === 0 ? 'red' : 'blue'} .pc-sprite`);
        if (!el) return;
        const pullDir = teamIdx === 0 ? 1 : -1;
        const pullArm = teamIdx === 0 ? 'r' : 'l';
        const baseL = -6;
        const baseR = 6;
        const pullStrength = recentPull ? 1 : 0;
        const targetL = pullArm === 'l' ? 26 * pullDir * pullStrength : baseL;
        const targetR = pullArm === 'r' ? -26 * pullDir * pullStrength : baseR;

        const state = armState[teamIdx];
        state.lv += (targetL - state.l) * 0.18;
        state.rv += (targetR - state.r) * 0.18;
        state.lv *= 0.72;
        state.rv *= 0.72;
        state.l += state.lv;
        state.r += state.rv;

        const handTargetX = pullStrength * 6 * pullDir;
        state.hvx += (handTargetX - state.hx) * 0.2;
        state.hvx *= 0.7;
        state.hx += state.hvx;

        el.style.setProperty('--arm-left-rot', `${state.l.toFixed(2)}deg`);
        el.style.setProperty('--arm-right-rot', `${state.r.toFixed(2)}deg`);
        el.style.setProperty('--hand-x', `${state.hx.toFixed(2)}px`);
    });
}

function updateRopePath() {
    if (!ropeEl || !ropeLineEl) return;
    const rect = ropeEl.getBoundingClientRect();
    const svg = ropeEl.querySelector('.rope-svg');
    if (svg) {
        svg.setAttribute('viewBox', `0 0 ${Math.max(1, rect.width)} ${Math.max(1, rect.height)}`);
    }
    const width = rect.width || 600;
    const height = rect.height || 36;
    const yBase = height / 2;
    const pad = 18;
    const sway = Math.max(-40, Math.min(40, ropePos * 0.35));
    const lx = pad + sway;
    const rx = (width - pad) + sway;
    const ly = yBase;
    const ry = yBase;

    if (!ropePoints.length || ropeLastSize.w !== rect.width || ropeLastSize.h !== rect.height) {
        ropePoints = [];
        for (let i = 0; i < ROPE_SEGMENTS; i++) {
            const t = i / (ROPE_SEGMENTS - 1);
            ropePoints.push({
                x: lx + (rx - lx) * t,
                y: ly + (ry - ly) * t,
                vx: 0,
                vy: 0
            });
        }
        ropeLastSize = { w: rect.width, h: rect.height };
    }

    const gravity = 0.05;
    const damping = 0.98;
    for (let i = 1; i < ROPE_SEGMENTS - 1; i++) {
        const p = ropePoints[i];
        p.vy += gravity;
        p.vy += (yBase - p.y) * 0.02;
        p.vx *= damping;
        p.vy *= damping;
        p.x += p.vx;
        p.y += p.vy;
        p.y = Math.max(6, Math.min(height - 6, p.y));
    }

    ropePoints[0].x = lx;
    ropePoints[0].y = ly;
    ropePoints[ROPE_SEGMENTS - 1].x = rx;
    ropePoints[ROPE_SEGMENTS - 1].y = ry;

    const dx = rx - lx;
    const dy = ry - ly;
    const dist = Math.max(1, Math.hypot(dx, dy));
    const rest = dist / (ROPE_SEGMENTS - 1);

    for (let iter = 0; iter < 4; iter++) {
        for (let i = 0; i < ROPE_SEGMENTS - 1; i++) {
            const p1 = ropePoints[i];
            const p2 = ropePoints[i + 1];
            const vx = p2.x - p1.x;
            const vy = p2.y - p1.y;
            const d = Math.max(1, Math.hypot(vx, vy));
            const diff = (d - rest) / d;
            const adjustX = vx * diff * 0.5;
            const adjustY = vy * diff * 0.5;

            if (i !== 0) {
                p1.x += adjustX;
                p1.y += adjustY;
            }
            if (i + 1 !== ROPE_SEGMENTS - 1) {
                p2.x -= adjustX;
                p2.y -= adjustY;
            }
        }
    }

    const pointsAttr = ropePoints.map(p => `${p.x.toFixed(2)},${p.y.toFixed(2)}`).join(' ');
    ropeLineEl.setAttribute('points', pointsAttr);
    if (ropeHighlightEl) {
        ropeHighlightEl.setAttribute('points', pointsAttr);
    }

    const midIdx = Math.floor(ROPE_SEGMENTS / 2);
    const mid = ropePoints[midIdx];
    const flagX = Math.max(16, Math.min((rect.width || 600) - 16, mid.x));
    const flagY = Math.max(10, Math.min((rect.height || 36) - 6, mid.y));
    ropeEl.style.setProperty('--flag-x', `${flagX.toFixed(2)}px`);
    ropeEl.style.setProperty('--flag-y', `${flagY.toFixed(2)}px`);

    const avgSpeed = ropePoints.reduce((acc, p) => acc + Math.hypot(p.vx, p.vy), 0) / ropePoints.length;
    const tension = Math.min(1, avgSpeed / 8);
    ropeEl.style.setProperty('--tension', tension.toFixed(2));
}

function updateRopeLink() {
    return;
}

function joinMatch(id) {
    logDebug(`Joining Match: ${id}`);
    matchRef = getMatchRef(id);
    if (unsubscribeMatch) unsubscribeMatch();

    unsubscribeMatch = matchRef.onSnapshot(snap => {
        const state = snap.data();
        if (!state) {
            logDebug('!!! JOIN ERROR: No data found at match path.');
            return;
        }

        lastKnownState = state;
        render(state);

        if (viewMode === 'projector' && state.status === 'active' && state.question) {
            const a = state.answers || {};
            if (a[0] !== null && a[0] !== undefined && a[1] !== null && a[1] !== undefined) {
                if (!isProcessingRound) {
                    isProcessingRound = true;
                    processRound();
                    setTimeout(() => {
                        isProcessingRound = false;
                    }, 1600);
                }
            }
        }
    });
}

function shuffleArray(arr) {
    const copy = [...arr];
    for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
}

function prepareQuestionForPlay(q) {
    const options = shuffleArray([...(q.a || [])]);
    const correctText = q.a[q.c];
    const correctIndex = options.indexOf(correctText);

    return {
        ...q,
        a: options,
        c: correctIndex
    };
}

function loadNextQuestion() {
    questionStartTime = Date.now();
    buzzerPlayed = false;

    if (isLoadingQuestion) return;
    isLoadingQuestion = true;

    setTimeout(() => {
        matchRef.get().then(async snap => {
            const state = snap.data();
            if (!state || state.status === 'finished') {
                isLoadingQuestion = false;
                return;
            }

            let pool = STARTER_QUESTIONS;

            if (state.settings?.questionMode === 'customPack' && state.settings?.customPackId) {
                const packSnap = await getPackRef(state.settings.customPackId).get();
                const pack = packSnap.data();

                if (pack && Array.isArray(pack.questions) && pack.questions.length) {
                    pool = pack.questions;
                }
            } else {
                const category = state.settings?.category || 'starter';
                if (category === 'ot_trivia') pool = OT_TRIVIA_QUESTIONS;
                else if (category === 'gospel_quiz') pool = GOSPEL_QUIZ_QUESTIONS;
            }

            let used = state.usedIds;
            if (!Array.isArray(used)) {
                used = used ? Object.values(used) : [];
            }
            used = used.filter(id => id !== undefined && id !== null);

            const remaining = pool.filter(q => q && q.id && !used.includes(q.id));

            if (remaining.length === 0) {
                await matchRef.update({ usedIds: [] });
                isLoadingQuestion = false;
                loadNextQuestion();
                return;
            }

            const next = remaining[Math.floor(Math.random() * remaining.length)];
            const playable = prepareQuestionForPlay(next);
            const newUsed = Array.from(new Set([...used, next.id]));

            if (typeof confettiLaunched !== 'undefined') {
                confettiLaunched = false;
            }

            await matchRef.update({
                question: playable,
                usedIds: newUsed,
                status: 'active',
                answers: { 0: null, 1: null },
                questionStartedAt: serverTimestamp(),
                currentQuestionId: next.id
            });

            setTimeout(() => { isLoadingQuestion = false; }, 700);
        }).catch(e => {
            logDebug(`!!! LOAD Q ERROR: ${e.message}`);
            isLoadingQuestion = false;
        });
    }, 350);
}

function old_loadNextQuestion() {
    questionStartTime = Date.now();
    buzzerPlayed = false;

    if (isLoadingQuestion) return;
    if (!allQuestions || allQuestions.length === 0) {
        allQuestions = STARTER_QUESTIONS;
    }

    isLoadingQuestion = true;
    logDebug('Picking next question...');

    setTimeout(() => {
        matchRef.get().then(snap => {
            const state = snap.data();
            if (!state || state.status === 'finished') {
                isLoadingQuestion = false;
                return;
            }

            const category = state.settings?.category || 'starter';
            let pool = STARTER_QUESTIONS;
            if (category === 'ot_trivia') pool = OT_TRIVIA_QUESTIONS;
            else if (category === 'gospel_quiz') pool = GOSPEL_QUIZ_QUESTIONS;

            let used = state.usedIds;
            if (!Array.isArray(used)) {
                used = used ? Object.values(used) : [];
            }
            used = used.filter(id => id !== undefined && id !== null);

            const remaining = pool.filter(q => q && q.id && !used.includes(q.id));

            if (remaining.length === 0) {
                logDebug(`All questions used for ${category}. Resetting pool.`);
                matchRef.update({ usedIds: [] }).then(() => {
                    isLoadingQuestion = false;
                    loadNextQuestion();
                }).catch(e => {
                    logDebug(`!!! RESET ERROR: ${e.message}`);
                    isLoadingQuestion = false;
                });
                return;
            }

            const next = remaining[Math.floor(Math.random() * remaining.length)];
            if (!next || !next.id) {
                logDebug('!!! ERROR: Failed to pick valid question.');
                isLoadingQuestion = false;
                return;
            }

            const newUsed = Array.from(new Set([...used, next.id]));
            currentQuestionId = next.id;

            matchRef.update({
                question: next,
                questionStartedAt: serverTimestamp(),
                currentQuestionId: next.id,
                usedIds: newUsed,
                status: 'active',
                answers: { 0: null, 1: null },
                lastAction: {
                    time: serverTimestamp(),
                    msg: 'New question loaded!'
                }
            }).then(() => {
                setTimeout(() => { isLoadingQuestion = false; }, 700);
            }).catch(e => {
                logDebug(`!!! DB UPDATE ERROR: ${e.message}`);
                isLoadingQuestion = false;
            });
        }).catch(e => {
            logDebug(`!!! LOAD Q ERROR: ${e.message}`);
            isLoadingQuestion = false;
        });
    }, 350);
}

function submitAnswer(idx) {
    matchRef.get().then(snap => {
        const state = snap.data();
        if (!state || !state.question || state.status !== 'active') return;

        const now = Date.now();
        if (now < (state.stunned || { 0: 0, 1: 0 })[playerTeam]) return;

        const upd = {};
        upd[`answers.${playerTeam}`] = idx;

        pullFlash = { time: Date.now(), team: playerTeam };
        matchRef.update(upd).then(() => {
            SoundFX.click();
        }).catch(e => logDebug(`!!! UPDATE ANS ERROR: ${e.message}`));
    });
}

function processRound() {
    logDebug('Processing ROUND results...');

    matchRef.get().then(snap => {
        const state = snap.data();
        if (!state || !state.question) return;

        const correctIdx = state.question.c;
        const ans0 = state.answers?.[0];
        const ans1 = state.answers?.[1];
        const now = Date.now();
        const matchSettings = state.settings || SETTINGS;

        const teams = {
            0: { ...(state.teams?.[0] || {}) },
            1: { ...(state.teams?.[1] || {}) }
        };

        const upd = {
            lastAction: {
                time: serverTimestamp(),
                msg: 'Round Complete!',
                pulledTeams: []
            },
            stunned: { ...(state.stunned || { 0: 0, 1: 0 }) },
            rope: state.rope || 0,
            teams: teams,
            answers: { 0: null, 1: null }
        };

        const correctTeams = [];

        if (ans0 === correctIdx) {
            upd.rope -= matchSettings.pullStrength;
            teams[0].score = (teams[0].score || 0) + 1;
            teams[0].corrects = (teams[0].corrects || 0) + 1;
            upd.lastAction.msg = 'Red team pulled!';
            upd.lastAction.pulledTeams.push(0);
            correctTeams.push(0);
        } else {
            upd.stunned[0] = now + matchSettings.stunMs;
            teams[0].wrongs = (teams[0].wrongs || 0) + 1;
        }

        if (ans1 === correctIdx) {
            upd.rope += matchSettings.pullStrength;
            teams[1].score = (teams[1].score || 0) + 1;
            teams[1].corrects = (teams[1].corrects || 0) + 1;
            upd.lastAction.msg = upd.lastAction.msg === 'Red team pulled!' ? 'Both teams pulled!' : 'Blue team pulled!';
            upd.lastAction.pulledTeams.push(1);
            correctTeams.push(1);
        } else {
            upd.stunned[1] = now + matchSettings.stunMs;
            teams[1].wrongs = (teams[1].wrongs || 0) + 1;
        }

        const winThresh = matchSettings.winThreshold || SETTINGS.winThreshold;

        if (matchSettings.gameMode === 'race') {
            const p0 = (teams[0].score || 0) * (matchSettings.pullStrength || SETTINGS.pullStrength);
            const p1 = (teams[1].score || 0) * (matchSettings.pullStrength || SETTINGS.pullStrength);

            if (p0 >= winThresh || p1 >= winThresh) {
                upd.winner = p0 >= p1 ? 0 : 1;
                upd.status = 'finished';
            }
        } else {
            if (Math.abs(upd.rope) >= winThresh) {
                upd.winner = upd.rope > 0 ? 1 : 0;
                upd.status = 'finished';
            }
        }

        if (upd.status === 'finished') {
            const winningTeam = teams[upd.winner];
            if (winningTeam && winningTeam.name) {
                getLeaderboardRef().add({
                    name: winningTeam.name,
                    score: winningTeam.score || 0,
                    date: serverTimestamp()
                }).catch(e => logDebug(`!!! LEADERBOARD EXCEPTION: ${e.message}`));
            }
        }

        if (correctTeams.length === 2) {
            SoundFX.correct();
        } else if (correctTeams.length === 1) {
            SoundFX.tug();
        } else {
            SoundFX.wrong();
        }

        if (upd.status === 'finished') {
            SoundFX.win();
            if (typeof confetti === 'function') {
                launchConfetti();
            }
        }

        matchRef.update(upd).then(() => {
            if (upd.status !== 'finished') {
                loadNextQuestion();
            }
        }).catch(e => logDebug(`!!! ROUND UPDATE ERROR: ${e.message}`));
    });
}

function resetMatch() {
    showConfirm('Reset the match? This will return everyone to the lobby.')
        .then(ok => {
            if (ok) createMatch();
        });
}

let confettiLaunched = false;
function launchConfetti() {
    if (confettiLaunched) return;
    confettiLaunched = true;

    const duration = 3000;
    const end = Date.now() + duration;

    const interval = setInterval(function () {
        if (Date.now() > end) {
            return clearInterval(interval);
        }

        confetti({
            particleCount: 5,
            spread: 60,
            startVelocity: 35,
            origin: { x: Math.random() * 0.2, y: Math.random() * 0.3 + 0.3 }
        });

        confetti({
            particleCount: 5,
            spread: 60,
            startVelocity: 35,
            origin: { x: 1 - Math.random() * 0.2, y: Math.random() * 0.3 + 0.3 }
        });
    }, 250);
}

const AVATAR_PRESETS = [
    { id: 'player_boy', label: 'Player', gender: 'boy' },
    { id: 'player_girl', label: 'Female', gender: 'girl' }
];

function getAvatarPreset(id) {
    return AVATAR_PRESETS.find(p => p.id === id) || AVATAR_PRESETS[0];
}

function renderSprite(avatarId, shirtColor, stateClass = 'idle', gender = 'boy') {
    if (avatarId.startsWith('player_')) {
        const key = avatarId.replace('player_', '');
        const pc = getPlayerCharacter(key);
        return `
                    <div class="pc-sprite state-${stateClass}" data-gender="${gender}">
                        <img class="pc-layer pc-body-back" src="${pc.bodyBack}" alt="body back" />
                        <img class="pc-layer pc-leg left" src="${pc.leg}" alt="leg" />
                        <img class="pc-layer pc-leg right" src="${pc.leg}" alt="leg" />
                        <img class="pc-layer pc-body-front" src="${pc.bodyFront}" alt="body front" />
                        <div class="pc-arm-group left">
                            <img class="pc-layer pc-arm" src="${pc.arm}" alt="arm" />
                            <img class="pc-layer pc-hand" src="${pc.hand}" alt="hand" />
                            <div class="hand-grip left"></div>
                        </div>
                        <div class="pc-arm-group right">
                            <img class="pc-layer pc-arm" src="${pc.arm}" alt="arm" />
                            <img class="pc-layer pc-hand" src="${pc.hand}" alt="hand" />
                            <div class="hand-grip right"></div>
                        </div>
                        <img class="pc-layer pc-head" src="${pc.head}" alt="head" />
                    </div>
                `;
    }

    const preset = getAvatarPreset(avatarId);
    return `
                <div class="sprite state-${stateClass}" data-sprite="${preset.id}" data-gender="${gender}"
                    style="--skin:${preset.skin}; --hair:${preset.hair}; --accent:${preset.accent}; --shirt:${shirtColor};">
                    <div class="sprite-head"></div>
                    <div class="sprite-hair"></div>
                    <div class="sprite-body"></div>
                    <div class="sprite-arm left"></div>
                    <div class="sprite-arm right"></div>
                    <div class="sprite-leg left"></div>
                    <div class="sprite-leg right"></div>
                    <div class="hand-grip"></div>
                </div>
            `;
}

function getPlayerCharacter(key) {
    const basePath = 'assets/sprites/player-characters/PNG';
    const map = {
        boy: {
            head: `${basePath}/Player/Limbs/head.png`,
            bodyBack: `${basePath}/Player/Limbs/body_back.png`,
            bodyFront: `${basePath}/Player/Limbs/body_front.png`,
            arm: `${basePath}/Player/Limbs/arm.png`,
            hand: `${basePath}/Player/Limbs/hand.png`,
            leg: `${basePath}/Player/Limbs/leg.png`
        },
        girl: {
            head: `${basePath}/Female/Limbs/head.png`,
            bodyBack: `${basePath}/Female/Limbs/body_back.png`,
            bodyFront: `${basePath}/Female/Limbs/body_front.png`,
            arm: `${basePath}/Female/Limbs/arm.png`,
            hand: `${basePath}/Female/Limbs/hand.png`,
            leg: `${basePath}/Female/Limbs/leg.png`
        }
    };
    return map[key] || map.boy;
}

function assetPath(p) {
    return encodeURI(p);
}

function hexToHsl(hex) {
    const clean = (hex || '').replace('#', '');
    if (clean.length !== 6) return null;
    const r = parseInt(clean.slice(0, 2), 16) / 255;
    const g = parseInt(clean.slice(2, 4), 16) / 255;
    const b = parseInt(clean.slice(4, 6), 16) / 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0;
    let s = 0;
    const l = (max + min) / 2;

    if (max !== min) {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            default: h = (r - g) / d + 4; break;
        }
        h *= 60;
    }
    return { h, s, l };
}

function getColorFamily(hex) {
    const hsl = hexToHsl(hex || '#777777');
    if (!hsl) return 'grey';
    if (hsl.s < 0.18 || hsl.l > 0.88) return 'grey';
    const h = hsl.h;
    if (h < 25 || h >= 330) return 'red';
    if (h >= 25 && h < 70) return 'yellow';
    if (h >= 70 && h < 170) return 'green';
    if (h >= 170 && h < 250) return 'blue';
    if (h >= 250 && h < 330) return 'navy';
    return 'grey';
}

function getKenneyShirtPath(hex) {
    const family = getColorFamily(hex);
    if (family === 'red') return assetPath('assets/sprites/kenney/PNG/Shirts/Red/redShirt1.png');
    if (family === 'yellow') return assetPath('assets/sprites/kenney/PNG/Shirts/Yellow/shirtYellow1.png');
    if (family === 'green') return assetPath('assets/sprites/kenney/PNG/Shirts/Green/greenShirt1.png');
    if (family === 'blue') return assetPath('assets/sprites/kenney/PNG/Shirts/Blue/blueShirt1.png');
    if (family === 'navy') return assetPath('assets/sprites/kenney/PNG/Shirts/Navy/navyShirt1.png');
    return assetPath('assets/sprites/kenney/PNG/Shirts/Grey/greyShirt1.png');
}

function getKenneyArmPath(hex) {
    const family = getColorFamily(hex);
    if (family === 'red') return assetPath('assets/sprites/kenney/PNG/Shirts/Red/redArm_short.png');
    if (family === 'yellow') return assetPath('assets/sprites/kenney/PNG/Shirts/Yellow/armYellow_short.png');
    if (family === 'green') return assetPath('assets/sprites/kenney/PNG/Shirts/Green/greenArm_short.png');
    if (family === 'blue') return assetPath('assets/sprites/kenney/PNG/Shirts/Blue/blueArm_short.png');
    if (family === 'navy') return assetPath('assets/sprites/kenney/PNG/Shirts/Navy/navyArm_short.png');
    return assetPath('assets/sprites/kenney/PNG/Shirts/Grey/greyArm_short.png');
}

function getKenneyParts(key, shirtColor) {
    const base = {
        face: assetPath('assets/sprites/kenney/PNG/Face/Completes/face1.png'),
        hair: assetPath('assets/sprites/kenney/PNG/Hair/Black/blackMan3.png'),
        pants: assetPath('assets/sprites/kenney/PNG/Pants/Blue 1/pantsBlue11.png'),
        shoes: assetPath('assets/sprites/kenney/PNG/Shoes/Black/blackShoe1.png'),
        arm: getKenneyArmPath(shirtColor),
        neck: assetPath('assets/sprites/kenney/PNG/Skin/Tint 1/tint1_neck.png')
    };

    const variants = {
        boy1: base,
        boy2: {
            face: assetPath('assets/sprites/kenney/PNG/Face/Completes/face2.png'),
            hair: assetPath('assets/sprites/kenney/PNG/Hair/Brown 1/brown1Man2.png'),
            pants: assetPath('assets/sprites/kenney/PNG/Pants/Grey/pantsGrey1.png'),
            shoes: assetPath('assets/sprites/kenney/PNG/Shoes/Brown 1/brownShoe1.png'),
            arm: getKenneyArmPath(shirtColor),
            neck: assetPath('assets/sprites/kenney/PNG/Skin/Tint 1/tint1_neck.png')
        },
        girl1: {
            face: assetPath('assets/sprites/kenney/PNG/Face/Completes/face3.png'),
            hair: assetPath('assets/sprites/kenney/PNG/Hair/Black/blackWoman2.png'),
            pants: assetPath('assets/sprites/kenney/PNG/Pants/Blue 2/pantsBlue21.png'),
            shoes: assetPath('assets/sprites/kenney/PNG/Shoes/Black/blackShoe2.png'),
            arm: getKenneyArmPath(shirtColor),
            neck: assetPath('assets/sprites/kenney/PNG/Skin/Tint 1/tint1_neck.png')
        },
        girl2: {
            face: assetPath('assets/sprites/kenney/PNG/Face/Completes/face4.png'),
            hair: assetPath('assets/sprites/kenney/PNG/Hair/Blonde/blondeWoman2.png'),
            pants: assetPath('assets/sprites/kenney/PNG/Pants/Red/pantsRed1.png'),
            shoes: assetPath('assets/sprites/kenney/PNG/Shoes/Red/redShoe1.png'),
            arm: getKenneyArmPath(shirtColor),
            neck: assetPath('assets/sprites/kenney/PNG/Skin/Tint 1/tint1_neck.png')
        }
    };

    const pick = variants[key] || base;
    return {
        ...pick,
        shirt: getKenneyShirtPath(shirtColor)
    };
}

function getAvatarStateClass(state, teamIndex, now) {
    if (state.status === 'finished') return 'celebrate';
    if (state.stunned && now < state.stunned[teamIndex]) return 'stunned';

    const pulled = state.lastAction?.pulledTeams || [];
    if (pulled.includes(teamIndex) && (now - toMillis(state.lastAction?.time)) < 700) {
        return 'pulling';
    }

    return 'idle';
}

function getTeamMotion(state, teamIndex, mode) {
    if (mode === 'race') {
        const winThresh = state.settings?.winThreshold || SETTINGS.winThreshold;
        const pullStr = state.settings?.pullStrength || SETTINGS.pullStrength;
        const progress = Math.min(1, ((state.teams?.[teamIndex]?.score || 0) * pullStr) / winThresh);
        const maxDist = 360;
        return teamIndex === 0 ? progress * maxDist : -progress * maxDist;
    }

    const rope = Math.max(-220, Math.min(220, (state.rope || 0) * 1.8));
    return teamIndex === 0 ? rope : -rope;
}

function render(state) {
    const gameDiv = document.getElementById('game');
    const now = Date.now();

    const showDebug = state.settings?.showDebug !== false;
    document.body.classList.toggle('debug-hidden', !showDebug);

    if (viewMode !== 'projector') {
        const my = state.teams?.[playerTeam];
        if (!my || !my.name) {
            if (document.getElementById('setupForm')) return;
        }
    }

    gameDiv.innerHTML = '';

    if (viewMode === 'projector') {
        const title = document.createElement('h2');
        title.textContent = '🏆 Bible Tug‑of‑War';
        gameDiv.appendChild(title);

        if (state.status === 'waiting') {
            const card = document.createElement('div');
            card.className = 'card';
            const settings = state.settings || {};

            card.innerHTML = `
                        <h2>⚙️ Match Setup</h2>
                        <div style="display:flex; justify-content:space-around; gap:10px; margin:20px 0; font-size:1.05rem; flex-wrap:wrap;">
                            <div>🔴 Red: ${state.teams?.[0]?.name ? '✅ Ready (' + state.teams[0].name + ')' : '⏳ Joining...'}</div>
                            <div>🔵 Blue: ${state.teams?.[1]?.name ? '✅ Ready (' + state.teams[1].name + ')' : '⏳ Joining...'}</div>
                        </div>
                        <div style="background:rgba(255,255,255,0.55); padding:20px; border-radius:16px; margin-top:20px; text-align:left; border:1px solid var(--border-color);">
                            <div class="setting-row" style="margin-bottom:10px;">
                                <label>🎮 Game Mode:</label>
                                <select id="setupMode">
                                    <option value="tug" ${(settings.gameMode || 'tug') === 'tug' ? 'selected' : ''}>🪢 Tug of War</option>
                                    <option value="race" ${settings.gameMode === 'race' ? 'selected' : ''}>🏁 Race to Center</option>
                                </select>
                            </div>
                            <div class="setting-row" style="margin-bottom:10px;">
                                <label>🏆 Points to Win:</label>
                                <input id="setupWin" type="number" value="${Math.max(1, Math.round((settings.winThreshold || SETTINGS.winThreshold) / (settings.pullStrength || SETTINGS.pullStrength)))}" min="1" max="50">
                            </div>
                            <div class="setting-row" style="margin-bottom:10px;">
                                <label>📚 Questions:</label>
                                <select id="setupCat">
                                    <option value="starter" ${(settings.category || 'starter') === 'starter' ? 'selected' : ''}>Starter Pack</option>
                                    <option value="ot_trivia" ${settings.category === 'ot_trivia' ? 'selected' : ''}>OT Trivia</option>
                                    <option value="gospel_quiz" ${settings.category === 'gospel_quiz' ? 'selected' : ''}>Gospel Quiz</option>
                                </select>
                            </div>
                        </div>
                        <button id="startMatchBtn" class="save-settings-btn" style="margin-top:20px; font-size:1.2rem;">▶ Start Match</button>
                    `;
            gameDiv.appendChild(card);

            const base = window.location.origin + window.location.pathname;
            const redLink = `${base}?MATCH=${matchId}&ROLE=red`;
            const blueLink = `${base}?MATCH=${matchId}&ROLE=blue`;

            const qrDiv = document.createElement('div');
            qrDiv.style.display = "flex";
            qrDiv.style.justifyContent = "space-around";
            qrDiv.style.gap = "16px";
            qrDiv.style.marginTop = "20px";
            qrDiv.style.flexWrap = "wrap";
            qrDiv.style.marginBottom = "18px";


            qrDiv.innerHTML = `
                        <div style="text-align:center;">
                            <p>🔴 Red Team</p>
                            <div id="qrRed"></div>
                        </div>
                        <div style="text-align:center;">
                            <p>🔵 Blue Team</p>
                            <div id="qrBlue"></div>
                        </div>
                    `;
            card.appendChild(qrDiv);

            new QRCode(document.getElementById("qrRed"), redLink);
            new QRCode(document.getElementById("qrBlue"), blueLink);

            const share = document.createElement('button');
            share.textContent = "📤 Share Join Links";
            share.style.marginTop = "18px";
            share.style.padding = "12px 16px";
            share.style.borderRadius = "12px";
            share.style.border = "none";
            share.style.cursor = "pointer";
            share.style.background = "var(--secondary)";
            share.style.color = "white";
            share.style.fontWeight = "800";
            share.onclick = () => {
                navigator.clipboard.writeText(`Red Team: ${redLink}
Blue Team: ${blueLink}`);
                alert("Links copied!");
            };
            card.appendChild(share);

            document.getElementById('startMatchBtn').onclick = () => {
                const mode = document.getElementById('setupMode').value;
                const wins = parseInt(document.getElementById('setupWin').value) || 5;
                const cat = document.getElementById('setupCat').value;

                matchRef.update({
                    status: 'active',
                    'settings.gameMode': mode,
                    'settings.winThreshold': wins * (state.settings?.pullStrength || SETTINGS.pullStrength),
                    'settings.category': cat
                }).then(() => loadNextQuestion());
            };

            ['setupMode', 'setupWin', 'setupCat'].forEach(id => {
                const el = document.getElementById(id);
                if (el) {
                    el.addEventListener('change', (e) => {
                        const val = e.target.value;
                        if (id === 'setupWin') {
                            matchRef.update({ 'settings.winThreshold': (parseInt(val) || 5) * (state.settings?.pullStrength || SETTINGS.pullStrength) });
                        }
                        if (id === 'setupMode') matchRef.update({ 'settings.gameMode': val });
                        if (id === 'setupCat') matchRef.update({ 'settings.category': val });
                    });
                }
            });

            return;
        }

        if (state.status === 'active' && !state.question && state.winner == null) {
            const card = document.createElement('div');
            card.className = 'card';
            card.innerHTML = `
                        <h3>Loading Next Question...</h3>
                        <p>Hang tight, picking a good one!</p>
                        <button onclick="loadNextQuestion()" style="margin-top:20px;padding:12px 16px;border:none;border-radius:12px;background:var(--primary);color:white;font-weight:800;cursor:pointer;">Force Load Question</button>
                    `;
            gameDiv.appendChild(card);

            if (!isLoadingQuestion) loadNextQuestion();
            return;
        }

        // ── Video Tug Arena ──
        const tugContainer = document.createElement('div');
        tugContainer.className = 'tug-container';

        const redAns = (state.answers && state.answers[0] !== null && state.answers[0] !== undefined);
        const blueAns = (state.answers && state.answers[1] !== null && state.answers[1] !== undefined);
        const redName = state.teams?.[0]?.name || 'Red Team';
        const blueName = state.teams?.[1]?.name || 'Blue Team';
        const redScore = state.teams?.[0]?.score || 0;
        const blueScore = state.teams?.[1]?.score || 0;

        const isFinished = state.status === 'finished' && state.winner !== null;

        if (isFinished) {
            // Win video fullscreen overlay
            const winSrc = state.winner === 1 ? 'assets/win_blue.mp4' : 'assets/win_red.mp4';
            const winOverlay = document.createElement('div');
            winOverlay.className = 'tug-win-overlay';
            winOverlay.innerHTML = `
                        <video id="winVideo" src="${winSrc}" autoplay loop muted playsinline
                               style="width:100%;height:100%;object-fit:cover;"></video>
                        <div class="tug-win-badge">
                            <div class="tug-win-emoji">${state.winner === 1 ? '🔵' : '🔴'}</div>
                            <div class="tug-win-title">${state.winner === 1 ? blueName : redName} Wins!</div>
                            <table class="leaderboard-table" style="margin-top:14px;color:white;">
                                <thead><tr><th>Team</th><th>Score</th></tr></thead>
                                <tbody>
                                    ${Object.entries(state.teams || {}).map(([k, v]) =>
                `<tr><td>${v.name || 'Team ' + k}</td><td>${v.score || 0}</td></tr>`
            ).join('')}
                                </tbody>
                            </table>
                        </div>
                    `;
            tugContainer.appendChild(winOverlay);
            gameDiv.appendChild(tugContainer);
            if (typeof confetti === 'function') launchConfetti();
            return;
        }

        // Active match: video arena
        const mode = (state.settings && state.settings.gameMode) || 'tug';
        const arenaEl = document.createElement('div');
        arenaEl.className = 'tug-video-arena';
        arenaEl.innerHTML = `
                    <div class="tug-team-overlay left" style="background:rgba(30,136,229,0.55);">
                        <div class="tug-overlay-score">${blueScore}</div>
                        <div class="tug-overlay-name">${blueName}</div>
                        <div class="tug-overlay-ans">${blueAns ? '✅' : '⏳'}</div>
                    </div>

                    <div class="tug-video-wrapper" id="tugVideoWrapper">
                        <video id="tugVideo" src="assets/main_tug.mp4"
                               autoplay loop muted playsinline></video>
                    </div>

                    <div class="tug-team-overlay right" style="background:rgba(185,28,28,0.55);">
                        <div class="tug-overlay-score">${redScore}</div>
                        <div class="tug-overlay-name">${redName}</div>
                        <div class="tug-overlay-ans">${redAns ? '✅' : '⏳'}</div>
                    </div>

                    <div class="tug-center-line"></div>
                    <div class="tug-flag" id="tugFlag"></div>
                `;

        tugContainer.appendChild(arenaEl);
        gameDiv.appendChild(tugContainer);

        // Kick off rope animation (slides video)
        ropeEl = null; ropeLineEl = null; ropeHighlightEl = null;
        if (mode === 'race') {
            setRopeTarget(0);
        } else {
            setRopeTarget(state.rope || 0);
        }

        if (state.question && state.winner == null) {
            const card = document.createElement('div');
            card.className = 'card';
            card.innerHTML = `
                        <div class="timerBox"></div>
                        <div class="question" style="margin-top:10px;">${state.question.q}</div>
                    `;
            gameDiv.appendChild(card);
        }

        return;
    }

    const opponentIdx = playerTeam === 0 ? 1 : 0;
    const opp = state.teams?.[opponentIdx] || {};
    const my = state.teams?.[playerTeam] || {};

    if (!my || !my.name) {
        const card = document.createElement('div');
        card.className = 'card controller-shell';
        card.id = 'setupForm';
        card.innerHTML = `
                    <h3>Setup Your Team ${playerTeam === 0 ? '🔴Red' : '🔵Blue'}</h3>
                    <div class="setup-form">
                    <!--

                    //     <div class="avatar-preview" id="avatarPreview"></div>
                    //     <div class="gender-toggle" id="genderToggle">
                    //         <button type="button" class="gender-btn active" data-gender="boy">Boy</button>
                    //         <button type="button" class="gender-btn" data-gender="girl">Girl</button>
                    //     </div>
                    //     <div class="avatar-grid" id="avatarGrid"></div>
                    //     <div class="color-picker">
                    //         <label class="color-label">Pick a Team Color</label>
                    //         <div class="color-palette" id="colorPalette"></div>
                    //         <div class="color-custom">
                    //             <span>Custom:</span>
                    //             <input id="colorSel" type="color" value="${SETTINGS.avatarColours[playerTeam] || '#e53935'}" />
                    //             <span id="colorEmoji" class="color-emoji">🔴</span>
                    //         </div>
                    //     </div> -->
                        <input id="nameInp" placeholder="Enter Team Name" />
                        <button id="saveBtn">Join Match </button>
                    </div>
                `;
        gameDiv.appendChild(card);

        const preview = document.getElementById('avatarPreview');
        const genderToggle = document.getElementById('genderToggle');
        const avatarGrid = document.getElementById('avatarGrid');
        const colorSel = document.getElementById('colorSel');
        const colorPalette = document.getElementById('colorPalette');
        const colorEmoji = document.getElementById('colorEmoji');

        const KID_COLORS = [
            { hex: '#ef4444', label: 'Red', emoji: '🔴' },
            { hex: '#f97316', label: 'Orange', emoji: '🟠' },
            { hex: '#facc15', label: 'Yellow', emoji: '🟡' },
            { hex: '#22c55e', label: 'Green', emoji: '🟢' },
            { hex: '#3b82f6', label: 'Blue', emoji: '🔵' },
            { hex: '#a855f7', label: 'Purple', emoji: '🟣' },
            { hex: '#ec4899', label: 'Pink', emoji: '🌸' },
            { hex: '#14b8a6', label: 'Teal', emoji: '🟦' }
        ];

        let selectedGender = 'boy';
        let selectedAvatar = AVATAR_PRESETS[0]?.id || 'player_boy';

        function updatePreview() {
            preview.innerHTML = renderSprite(selectedAvatar, colorSel.value, 'idle', selectedGender);
        }

        function renderAvatarGrid() {
            avatarGrid.innerHTML = '';
            AVATAR_PRESETS.forEach((preset) => {
                const btn = document.createElement('button');
                btn.type = 'button';
                btn.className = `avatar-card ${preset.id === selectedAvatar ? 'active' : ''}`;
                const cardGender = preset.gender || selectedGender;
                btn.innerHTML = `
                            <div class="avatar-thumb">${renderSprite(preset.id, colorSel.value, 'idle', cardGender)}</div>
                            <div class="avatar-name">${preset.label}</div>
                        `;
                btn.addEventListener('click', () => {
                    selectedAvatar = preset.id;
                    renderAvatarGrid();
                    updatePreview();
                });
                avatarGrid.appendChild(btn);
            });
        }

        function setColor(hex) {
            colorSel.value = hex;
            const found = KID_COLORS.find(c => c.hex.toLowerCase() === hex.toLowerCase());
            colorEmoji.textContent = found ? found.emoji : '🎨';
            updatePreview();
            renderAvatarGrid();
        }

        // KID_COLORS.forEach((c) => {
        //     const btn = document.createElement('button');
        //     btn.type = 'button';
        //     btn.className = 'color-swatch';
        //     btn.title = c.label;
        //     btn.innerHTML = `<span class="swatch-dot" style="background:${c.hex}"></span><span class="swatch-emoji">${c.emoji}</span>`;
        //     btn.addEventListener('click', () => setColor(c.hex));
        //     colorPalette.appendChild(btn);
        // });

        // genderToggle.querySelectorAll('.gender-btn').forEach((btn) => {
        //     btn.addEventListener('click', () => {
        //         selectedGender = btn.dataset.gender;
        //         genderToggle.querySelectorAll('.gender-btn').forEach(b => b.classList.remove('active'));
        //         btn.classList.add('active');
        //         updatePreview();
        //         renderAvatarGrid();
        //     });
        // });
        // colorSel.addEventListener('change', (e) => setColor(e.target.value));
        // updatePreview();
        // renderAvatarGrid();
        // setColor(colorSel.value);

        document.getElementById('saveBtn').onclick = () => {
            // const gender = selectedGender;
            // const avatarId = selectedAvatar;
            // const shirt = document.getElementById('colorSel').value;
            const name = document.getElementById('nameInp').value || (viewMode === 'red' ? 'Red' : 'Blue');

            const upd = {};
            // upd[`teams.${playerTeam}.gender`] = gender;
            // upd[`teams.${playerTeam}.avatarId`] = avatarId;
            // upd[`teams.${playerTeam}.shirt`] = shirt;
            upd[`teams.${playerTeam}.name`] = name;

            matchRef.update(upd);
        };

        return;
    }

    const actionCard = document.createElement('div');
    actionCard.className = 'card controller-shell';

    const status = state.status || 'waiting';
    actionCard.innerHTML = `
                <div class="controller-header">
                    <div>
                        <div class="controller-team">${my.name}</div>
                        <div class="controller-sub">
                            ${playerTeam === 0 ? '🔴 Red Team' : '🔵 Blue Team'} • Opponent: ${opp.name || 'Waiting...'}
                        </div>
                    </div>
                    <div class="controller-score">${my.corrects || 0}</div>
                </div>
            `;

    const timerDiv = document.createElement('div');
    timerDiv.className = 'timerBox';
    actionCard.appendChild(timerDiv);

    if (status === 'waiting') {
        const wait = document.createElement('div');
        wait.innerHTML = `
                    <h3>Waiting for Players...</h3>
                    <p>Get ready, ${my.name}!</p>
                    <div style="margin-top:16px; font-size:0.95rem; color:#6b5a42;">
                        Opponent Status: ${opp.name ? '✅ Ready' : '⏳ Joining...'}
                    </div>
                `;
        actionCard.appendChild(wait);
    } else if (status === 'active' && state.question && state.winner == null) {
        const qDiv = document.createElement('div');
        qDiv.className = 'controller-question';
        qDiv.textContent = state.question.q;
        actionCard.appendChild(qDiv);

        const ansDiv = document.createElement('div');
        ansDiv.className = 'answers';

        const ansValue = state.answers ? state.answers[playerTeam] : null;
        const hasAnswered = ansValue !== null && ansValue !== undefined;

        if (hasAnswered) {
            if (!window[`soundPlayed_${state.question.id}_${playerTeam}`]) {
                SoundFX.click();
                window[`soundPlayed_${state.question.id}_${playerTeam}`] = true;
            }

            const msg = document.createElement('div');
            msg.style.gridColumn = '1 / -1';
            msg.style.padding = '18px';
            msg.style.borderRadius = '16px';
            msg.style.background = 'rgba(217, 119, 6, 0.10)';
            msg.style.fontWeight = '800';
            msg.style.color = 'var(--primary)';
            msg.innerHTML = '✅ Answer Submitted<br><small>Waiting for opponent...</small>';
            ansDiv.appendChild(msg);
        } else {
            state.question.a.forEach((opt, i) => {
                const btn = document.createElement('button');
                btn.textContent = opt;
                const disabled = Date.now() < (state.stunned || { 0: 0, 1: 0 })[playerTeam];
                btn.disabled = disabled;
                btn.onclick = () => submitAnswer(i);
                ansDiv.appendChild(btn);
            });
        }

        actionCard.appendChild(ansDiv);

        if (state.stunned && Date.now() < state.stunned[playerTeam]) {
            if (!window[`stunSound_${state.question.id}_${playerTeam}`]) {
                SoundFX.wrong();
                window[`stunSound_${state.question.id}_${playerTeam}`] = true;
            }
            const remaining = Math.ceil((state.stunned[playerTeam] - Date.now()) / 1000);
            const timer = document.createElement('div');
            timer.className = 'stun-timer';
            timer.id = 'stunTimerText';
            timer.innerHTML = `⚡ Stunned! Wait ${remaining}s`;
            actionCard.appendChild(timer);
        }

        const statsDiv = document.createElement('div');
        statsDiv.className = 'stats-panel';
        statsDiv.innerHTML = `
                    <div class="stat-item">
                        <span class="stat-label">Opponent (${opp.name || 'Waiting...'})</span>
                        <div class="stat-value">✅ ${opp.corrects || 0} | ❌ ${opp.wrongs || 0}</div>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">Your Stats</span>
                        <div class="stat-value">✅ ${my.corrects || 0} | ❌ ${my.wrongs || 0}</div>
                    </div>
                `;
        actionCard.appendChild(statsDiv);

        const logDiv = document.createElement('div');
        logDiv.className = 'activity-log';
        if (state.lastAction && (Date.now() - toMillis(state.lastAction.time)) < 3000) {
            logDiv.textContent = state.lastAction.msg;
        }
        actionCard.appendChild(logDiv);

    } else if (status === 'finished') {
        actionCard.innerHTML += `<h2>${state.winner === playerTeam ? '🏁 You Won!' : '💀 Don\'t give up! Try again!'}</h2>`;
    } else {
        actionCard.innerHTML += `
                    <h3>Waiting for Game to Start...</h3>
                    <p>The projector should pick a question soon.</p>
                    <button onclick="loadNextQuestion()" style="margin-top:10px;padding:12px 16px;border:none;border-radius:12px;background:var(--primary);color:white;font-weight:800;cursor:pointer;">Manually Load Question</button>
                `;
    }

    gameDiv.appendChild(actionCard);
}

window.setView = setView;
window.openSettingsModal = openSettingsModal;
window.closeSettingsModal = closeSettingsModal;
window.openLeaderboardModal = openLeaderboardModal;
window.closeLeaderboardModal = closeLeaderboardModal;
window.deleteLeaderboard = deleteLeaderboard;
window.resetMatch = resetMatch;
window.toggleDebugConsole = toggleDebugConsole;
window.loadNextQuestion = loadNextQuestion;
window.saveSettings = saveSettings;

function checkURL() {
    const params = new URLSearchParams(window.location.search);
    const role = params.get('ROLE');
    if (role) {
        setView(role);
    }
}

checkURL();

window.addEventListener('online', () => {
    location.reload();
});

window.addEventListener('offline', () => {
    alert('You are offline.');
});

window.addEventListener('resize', () => {
    requestAnimationFrame(updateRopeLink);
});


