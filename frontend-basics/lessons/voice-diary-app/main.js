const STORAGE_KEY = "voice-diary-app-entries";
const MAX_DEMO_SECONDS = 24;

const state = {
  entries: loadEntries(),
  selectedMood: "Calm",
  isRecording: false,
  startedAt: 0,
  timerId: null,
  seconds: 0,
  mediaRecorder: null,
  chunks: [],
  audioUrl: "",
  supportsRecording: typeof navigator !== "undefined" &&
    typeof navigator.mediaDevices !== "undefined" &&
    typeof navigator.mediaDevices.getUserMedia === "function" &&
    typeof MediaRecorder !== "undefined",
};

const entryCount = document.querySelector("#entryCount");
const recordingStateLabel = document.querySelector("#recordingStateLabel");
const todayLabel = document.querySelector("#todayLabel");
const timerLabel = document.querySelector("#timerLabel");
const waveform = document.querySelector("#waveform");
const modeBadge = document.querySelector("#modeBadge");
const recorderLabel = document.querySelector("#recorderLabel");
const recorderHint = document.querySelector("#recorderHint");
const recordButton = document.querySelector("#recordButton");
const entryForm = document.querySelector("#entryForm");
const titleInput = document.querySelector("#titleInput");
const noteInput = document.querySelector("#noteInput");
const moodGroup = document.querySelector("#moodGroup");
const formMessage = document.querySelector("#formMessage");
const clearButton = document.querySelector("#clearButton");
const wipeButton = document.querySelector("#wipeButton");
const timelineList = document.querySelector("#timelineList");
const entryTemplate = document.querySelector("#entryTemplate");

buildWaveform(waveform, 24, true);
todayLabel.textContent = new Intl.DateTimeFormat("ja-JP", {
  month: "short",
  day: "numeric",
}).format(new Date());
modeBadge.textContent = state.supportsRecording ? "Mic ready" : "Demo mode";

updateStatus();
renderEntries();

recordButton.addEventListener("click", async () => {
  if (state.isRecording) {
    stopRecording();
    return;
  }

  clearMessage();

  if (state.supportsRecording) {
    const started = await startRealRecording();
    if (started) return;
  }

  startDemoRecording();
});

entryForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const title = titleInput.value.trim() || createFallbackTitle();
  const note = noteInput.value.trim() || "声の余韻だけを残した、短いメモ。";

  if (!state.audioUrl && state.seconds === 0) {
    showMessage("先に録音ボタンを押して、音声日記をひとつ作ってみてください。");
    return;
  }

  const entry = {
    id: crypto.randomUUID(),
    title,
    note,
    mood: state.selectedMood,
    createdAt: new Date().toISOString(),
    duration: formatTime(Math.max(state.seconds, 3)),
    audioUrl: state.audioUrl || "",
    source: state.audioUrl ? "recorded" : "demo",
  };

  state.entries.unshift(entry);
  saveEntries();
  renderEntries();
  showMessage("音声日記を保存しました。");
  resetComposer(true);
});

clearButton.addEventListener("click", () => {
  resetComposer(false);
  showMessage("入力内容をリセットしました。");
});

wipeButton.addEventListener("click", () => {
  if (state.entries.length === 0) return;
  const confirmed = window.confirm("保存した音声日記をすべて削除しますか？");
  if (!confirmed) return;
  state.entries = [];
  saveEntries();
  renderEntries();
});

moodGroup.addEventListener("click", (event) => {
  const target = event.target;
  if (!(target instanceof HTMLButtonElement)) return;
  const { mood } = target.dataset;
  if (!mood) return;

  state.selectedMood = mood;
  for (const chip of moodGroup.querySelectorAll(".mood-chip")) {
    chip.classList.toggle("is-active", chip === target);
  }
});

function loadEntries() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveEntries() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state.entries));
}

function updateStatus() {
  entryCount.textContent = String(state.entries.length);
  timerLabel.textContent = formatTime(state.seconds);
  recordingStateLabel.textContent = state.isRecording ? "recording" : "standby";
  recordButton.classList.toggle("is-recording", state.isRecording);
  recordButton.setAttribute("aria-pressed", String(state.isRecording));
  recorderLabel.textContent = state.isRecording ? "録音中です" : "タップして録音スタート";
  recorderHint.textContent = state.isRecording
    ? "もう一度押すと録音が止まり、保存用の音声日記になります。"
    : state.supportsRecording
      ? "マイク録音に対応しています。短いボイスメモを残してみましょう。"
      : "このブラウザではデモ録音として保存されます。見た目と流れはそのまま試せます。";

  for (const bar of waveform.children) {
    const height = state.isRecording
      ? 18 + Math.floor(Math.random() * 180)
      : 20 + Math.floor(Math.random() * 60);
    bar.style.height = `${height}px`;
    bar.style.animationDelay = `${Math.random() * 700}ms`;
  }
}

function renderEntries() {
  timelineList.innerHTML = "";

  if (state.entries.length === 0) {
    const empty = document.createElement("article");
    empty.className = "empty-state";
    empty.innerHTML = `
      <h3>まだ音声日記はありません</h3>
      <p>1本目のボイスメモを保存すると、ここにタイムライン形式で並びます。</p>
    `;
    timelineList.appendChild(empty);
    updateStatus();
    return;
  }

  for (const entry of state.entries) {
    const fragment = entryTemplate.content.cloneNode(true);
    const card = fragment.querySelector(".diary-card");
    const date = fragment.querySelector(".diary-date");
    const title = fragment.querySelector(".diary-title");
    const mood = fragment.querySelector(".diary-mood");
    const note = fragment.querySelector(".diary-note");
    const duration = fragment.querySelector(".diary-duration");
    const playButton = fragment.querySelector(".play-button");
    const miniWave = fragment.querySelector(".mini-wave");

    date.textContent = new Intl.DateTimeFormat("ja-JP", {
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(entry.createdAt));
    title.textContent = entry.title;
    mood.textContent = entry.mood;
    note.textContent = entry.note;
    duration.textContent = `${entry.duration}  /  ${entry.source === "recorded" ? "recorded" : "demo"}`;

    buildWaveform(miniWave, 18, false);

    playButton.addEventListener("click", () => {
      if (entry.audioUrl) {
        const audio = new Audio(entry.audioUrl);
        audio.play().catch(() => {
          showMessage("この環境では音声の再生を開始できませんでした。");
        });
        return;
      }

      card.animate(
        [
          { transform: "translateY(0)", boxShadow: "0 0 0 rgba(0,0,0,0)" },
          { transform: "translateY(-4px)", boxShadow: "0 14px 24px rgba(214,95,56,0.16)" },
          { transform: "translateY(0)", boxShadow: "0 0 0 rgba(0,0,0,0)" },
        ],
        { duration: 650, easing: "ease-out" },
      );
      showMessage("デモ音声なので、カードのアニメーションで再生感だけ表現しています。");
    });

    timelineList.appendChild(fragment);
  }

  updateStatus();
}

async function startRealRecording() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    state.chunks = [];
    state.mediaRecorder = new MediaRecorder(stream);
    state.mediaRecorder.addEventListener("dataavailable", (event) => {
      if (event.data.size > 0) {
        state.chunks.push(event.data);
      }
    });
    state.mediaRecorder.addEventListener("stop", () => {
      const blob = new Blob(state.chunks, { type: "audio/webm" });
      state.audioUrl = URL.createObjectURL(blob);
      for (const track of stream.getTracks()) {
        track.stop();
      }
    });
    state.mediaRecorder.start();
    beginRecordingLoop();
    modeBadge.textContent = "Live recording";
    return true;
  } catch {
    modeBadge.textContent = "Demo mode";
    return false;
  }
}

function startDemoRecording() {
  beginRecordingLoop();
  modeBadge.textContent = "Demo mode";
}

function beginRecordingLoop() {
  state.isRecording = true;
  state.startedAt = Date.now();
  state.seconds = 0;
  state.audioUrl = "";
  if (state.timerId) {
    window.clearInterval(state.timerId);
  }
  state.timerId = window.setInterval(() => {
    state.seconds = Math.min(
      Math.floor((Date.now() - state.startedAt) / 1000),
      MAX_DEMO_SECONDS,
    );
    updateStatus();
  }, 250);
  updateStatus();
}

function stopRecording() {
  state.isRecording = false;
  if (state.timerId) {
    window.clearInterval(state.timerId);
    state.timerId = null;
  }
  state.seconds = Math.max(state.seconds, 3 + Math.floor(Math.random() * 8));
  if (state.mediaRecorder && state.mediaRecorder.state !== "inactive") {
    state.mediaRecorder.stop();
  }
  state.mediaRecorder = null;
  updateStatus();
  showMessage("録音を止めました。タイトルとメモを入れて保存できます。");
}

function resetComposer(keepMessage) {
  if (state.timerId) {
    window.clearInterval(state.timerId);
    state.timerId = null;
  }
  state.isRecording = false;
  state.seconds = 0;
  state.startedAt = 0;
  state.mediaRecorder = null;
  state.chunks = [];
  titleInput.value = "";
  noteInput.value = "";
  state.selectedMood = "Calm";
  for (const chip of moodGroup.querySelectorAll(".mood-chip")) {
    chip.classList.toggle("is-active", chip.dataset.mood === "Calm");
  }
  updateStatus();
  if (!keepMessage) {
    clearMessage();
  }
}

function createFallbackTitle() {
  return `Voice note ${new Intl.DateTimeFormat("ja-JP", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date())}`;
}

function showMessage(message) {
  formMessage.textContent = message;
}

function clearMessage() {
  formMessage.textContent = "";
}

function formatTime(seconds) {
  const mins = String(Math.floor(seconds / 60)).padStart(2, "0");
  const secs = String(seconds % 60).padStart(2, "0");
  return `${mins}:${secs}`;
}

function buildWaveform(container, count, animated) {
  container.innerHTML = "";
  for (let index = 0; index < count; index += 1) {
    const bar = document.createElement("span");
    const height = animated
      ? 20 + Math.floor(Math.random() * 170)
      : 8 + Math.floor(Math.random() * 34);
    bar.style.height = `${height}px`;
    if (animated) {
      bar.style.animationDelay = `${index * 50}ms`;
    }
    container.appendChild(bar);
  }
}
