const defaultTasks = [
  { id: "water", title: "Drink a glass of water", detail: "Your body gets a little thank you." },
  { id: "sunshine", title: "Find a bit of light", detail: "Window, doorway, garden, street — it all counts." },
  { id: "song", title: "Play one feel-good song", detail: "Give your mood a friendly nudge." },
  { id: "breathe", title: "Take three proud breaths", detail: "In slowly. Out gently. You are here." },
  { id: "kind", title: "Say one kind thing to yourself", detail: "Something simple, true, and encouraging." },
  { id: "tinywin", title: "Do one tiny useful thing", detail: "A cup, a plate, a message, a sock — tiny wins matter." }
];

const affirmations = [
  "Small steps count. Every single one.",
  "You do not need a perfect day to have a good moment.",
  "Today can be lighter, one tiny win at a time.",
  "You are allowed to feel proud of simple things.",
  "A gentle start is still a strong start.",
  "You got this — one easy win at a time."
];

const journalPrompts = [
  "What’s one thing I can feel good about today?",
  "What tiny win deserves more credit?",
  "Where did I show up, even a little?",
  "What helped today feel a bit brighter?",
  "What would I like to thank myself for?",
  "What good moment do I want to remember?"
];

const celebrationMessages = [
  { title: "That counts. Honestly.", text: "One tick is not nothing. It is proof you gave yourself a little care." },
  { title: "Tiny win, real momentum.", text: "You just made the day a little more on your side." },
  { title: "Look at you showing up.", text: "No pressure, no perfection — just a positive step." },
  { title: "That’s a proper little glow-up.", text: "The small stuff is where better days often begin." },
  { title: "You got this.", text: "Keep collecting the little bits of good. They add up." }
];

const moods = [
  { emoji: "😊", label: "Good" },
  { emoji: "🙂", label: "Okay" },
  { emoji: "😌", label: "Calm" },
  { emoji: "😐", label: "Flat" },
  { emoji: "😔", label: "Low" },
  { emoji: "😰", label: "Anxious" },
  { emoji: "😴", label: "Tired" },
  { emoji: "✨", label: "Hopeful" }
];

const els = {
  todayLabel: document.querySelector("#todayLabel"),
  dailyAffirmation: document.querySelector("#dailyAffirmation"),
  checklist: document.querySelector("#checklist"),
  template: document.querySelector("#taskTemplate"),
  completedCount: document.querySelector("#completedCount"),
  remainingCount: document.querySelector("#remainingCount"),
  progressPercent: document.querySelector("#progressPercent"),
  ringFill: document.querySelector("#ringFill"),
  dayMood: document.querySelector("#dayMood"),
  moodGrid: document.querySelector("#moodGrid"),
  addForm: document.querySelector("#addForm"),
  newTask: document.querySelector("#newTask"),
  journalText: document.querySelector("#journalText"),
  journalPrompt: document.querySelector("#journalPrompt"),
  promptButton: document.querySelector("#promptButton"),
  wordCount: document.querySelector("#wordCount"),
  saveStatus: document.querySelector("#saveStatus"),
  positiveSaveButton: document.querySelector("#positiveSaveButton"),
  resetButton: document.querySelector("#resetButton"),
  breathButton: document.querySelector("#breathButton"),
  themeToggle: document.querySelector("#themeToggle"),
  toast: document.querySelector("#toast"),
  celebrationTitle: document.querySelector("#celebrationTitle"),
  celebrationText: document.querySelector("#celebrationText"),
  tabButtons: document.querySelectorAll(".tab-button"),
  tabPanels: document.querySelectorAll(".tab-panel"),
  journalDate: document.querySelector("#journalDate"),
  journalDaySummary: document.querySelector("#journalDaySummary"),
  personalJournalText: document.querySelector("#personalJournalText"),
  personalWordCount: document.querySelector("#personalWordCount"),
  personalSaveButton: document.querySelector("#personalSaveButton"),
  personalSaveStatus: document.querySelector("#personalSaveStatus"),
  summaryGrid: document.querySelector("#summaryGrid"),
  historyList: document.querySelector("#historyList"),
  openTabButtons: document.querySelectorAll("[data-open-tab]"),
  topActionButtons: document.querySelectorAll(".top-action-button[data-open-tab]"),
  shareButton: document.querySelector("#shareButton"),
  appAccessGate: document.querySelector("#appAccessGate"),
  accessPassword: document.querySelector("#accessPassword"),
  accessButton: document.querySelector("#accessButton"),
  accessStatus: document.querySelector("#accessStatus"),
  privacyLock: document.querySelector("#privacyLock"),
  pinInput: document.querySelector("#pinInput"),
  unlockButton: document.querySelector("#unlockButton"),
  lockStatus: document.querySelector("#lockStatus"),
  newPin: document.querySelector("#newPin"),
  setPinButton: document.querySelector("#setPinButton"),
  lockNowButton: document.querySelector("#lockNowButton"),
  removePinButton: document.querySelector("#removePinButton"),
  pinStatus: document.querySelector("#pinStatus")
};

const themeKey = "grounded-glow:theme";
const keyPrefix = "grounded-glow:";
const pinKey = "you-got-this:pin-lock";
const appAccessKey = "you-got-this:access-granted:v1";

// Change this word in GitHub when you want to change the shared access word.
// Leave it blank ("") only if you want the app to open without an access word.
const appAccessPassword = "yougotthis";
let toastTimer;
let selectedJournalDate = getLocalDateKey();
let state = loadDayState(getLocalDateKey());

function getLocalDateKey(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function storageKey(dateKey) {
  return `${keyPrefix}${dateKey}`;
}

function legacyStorageKey(dateKey) {
  return `grounded-journal:${dateKey}`;
}

function makeFreshState(dateKey) {
  return {
    tasks: defaultTasks.map(task => ({ ...task, done: false, custom: false })),
    journal: "",
    personalJournal: "",
    mood: "",
    checkedIn: false,
    promptIndex: getDailyIndex(journalPrompts.length, dateKey),
    updatedAt: new Date().toISOString()
  };
}

function normaliseState(parsed, dateKey) {
  return {
    tasks: Array.isArray(parsed.tasks) ? parsed.tasks : defaultTasks.map(task => ({ ...task, done: false, custom: false })),
    journal: parsed.journal || "",
    personalJournal: parsed.personalJournal || "",
    mood: parsed.mood || "",
    checkedIn: Boolean(parsed.checkedIn),
    promptIndex: Number.isInteger(parsed.promptIndex) ? parsed.promptIndex : getDailyIndex(journalPrompts.length, dateKey),
    updatedAt: parsed.updatedAt || new Date().toISOString()
  };
}

function loadDayState(dateKey) {
  const saved = localStorage.getItem(storageKey(dateKey)) || localStorage.getItem(legacyStorageKey(dateKey));
  if (saved) {
    try {
      return normaliseState(JSON.parse(saved), dateKey);
    } catch {
      localStorage.removeItem(storageKey(dateKey));
      localStorage.removeItem(legacyStorageKey(dateKey));
    }
  }
  return makeFreshState(dateKey);
}

function saveDayState(dateKey, dayState) {
  dayState.updatedAt = new Date().toISOString();
  localStorage.setItem(storageKey(dateKey), JSON.stringify(dayState));
}

function saveTodayState() {
  saveDayState(getLocalDateKey(), state);
}

function getDailyIndex(length, dateKey = getLocalDateKey()) {
  const seed = dateKey.split("").reduce((total, char) => total + char.charCodeAt(0), 0);
  return seed % length;
}

function formatDisplayDate(dateKey, options = { weekday: "long", day: "numeric", month: "long" }) {
  const [year, month, day] = dateKey.split("-").map(Number);
  return new Date(year, month - 1, day).toLocaleDateString(undefined, options);
}

function showToast(message) {
  clearTimeout(toastTimer);
  els.toast.textContent = message;
  els.toast.classList.add("show");
  toastTimer = setTimeout(() => els.toast.classList.remove("show"), 1900);
}

function updateTodayHeader() {
  const todayKey = getLocalDateKey();
  els.todayLabel.textContent = formatDisplayDate(todayKey);
  els.dailyAffirmation.textContent = affirmations[getDailyIndex(affirmations.length, todayKey)];
}

function setCelebration(completed) {
  const message = celebrationMessages[Math.max(0, (completed - 1) % celebrationMessages.length)];
  els.celebrationTitle.textContent = completed ? message.title : "You’re allowed to count the small stuff.";
  els.celebrationText.textContent = completed ? message.text : "This app is about noticing progress, not being perfect.";
}

function renderMoods() {
  els.moodGrid.innerHTML = "";
  moods.forEach(mood => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "mood-button";
    button.classList.toggle("selected", state.mood === mood.label);
    button.setAttribute("aria-pressed", String(state.mood === mood.label));
    button.innerHTML = `<span>${mood.emoji}</span><small>${mood.label}</small>`;
    button.addEventListener("click", () => {
      state.mood = mood.label;
      saveTodayState();
      renderMoods();
      renderProgress();
      renderJournalDaySummary();
      renderHistory();
      showToast(`${mood.emoji} Noted. However you feel, you are welcome here.`);
    });
    els.moodGrid.appendChild(button);
  });
}

function renderTasks() {
  els.checklist.innerHTML = "";
  state.tasks.forEach(task => {
    const node = els.template.content.firstElementChild.cloneNode(true);
    const toggle = node.querySelector(".check-button");
    const title = node.querySelector("h3");
    const detail = node.querySelector("p");
    const deleteButton = node.querySelector(".delete-button");

    node.classList.toggle("done", task.done);
    title.textContent = task.title;
    detail.textContent = task.detail || "Your own positive step for today.";
    deleteButton.hidden = !task.custom;

    toggle.setAttribute("aria-pressed", String(task.done));
    toggle.addEventListener("click", () => {
      const wasDone = task.done;
      task.done = !task.done;
      saveTodayState();
      renderToday();

      if (!wasDone && task.done) {
        const completed = state.tasks.filter(item => item.done).length;
        showToast(completed === state.tasks.length ? "Full glow achieved — be proud of that ✨" : "Nice. That’s another win collected ✨");
      }
    });

    deleteButton.addEventListener("click", () => {
      state.tasks = state.tasks.filter(item => item.id !== task.id);
      saveTodayState();
      renderToday();
      showToast("Removed — keeping today light.");
    });

    els.checklist.appendChild(node);
  });
}

function renderProgress() {
  const total = state.tasks.length;
  const completed = state.tasks.filter(task => task.done).length;
  const remaining = Math.max(total - completed, 0);
  const percent = total ? Math.round((completed / total) * 100) : 0;
  const circumference = 113;
  const offset = circumference - (percent / 100) * circumference;

  els.completedCount.textContent = completed;
  els.remainingCount.textContent = remaining;
  els.progressPercent.textContent = `${percent}%`;
  els.ringFill.style.strokeDashoffset = offset;
  setCelebration(completed);

  if (state.mood) {
    els.dayMood.textContent = state.mood;
  } else if (percent === 100) {
    els.dayMood.textContent = "Glowing";
  } else if (percent >= 67) {
    els.dayMood.textContent = "Proud";
  } else if (percent >= 34) {
    els.dayMood.textContent = "Bright";
  } else {
    els.dayMood.textContent = state.checkedIn ? "Ready" : "Hopeful";
  }
}

function renderPositiveJournal() {
  els.journalText.value = state.journal || "";
  els.journalPrompt.textContent = journalPrompts[state.promptIndex % journalPrompts.length];
  updateWordCount();
}

function updateWordCount() {
  const words = els.journalText.value.trim().split(/\s+/).filter(Boolean).length;
  els.wordCount.textContent = `${words} ${words === 1 ? "word" : "words"}`;
}

function renderToday() {
  updateTodayHeader();
  renderMoods();
  renderTasks();
  renderProgress();
  renderPositiveJournal();
}

function addCustomTask(title) {
  const cleanTitle = title.trim();
  if (!cleanTitle) return;

  state.tasks.push({
    id: `custom-${Date.now()}`,
    title: cleanTitle,
    detail: "A personal win you chose for yourself.",
    done: false,
    custom: true
  });

  saveTodayState();
  renderToday();
  showToast("Added. Future you will appreciate this.");
}

function getAllDayEntries() {
  const entries = [];
  for (let index = 0; index < localStorage.length; index += 1) {
    const key = localStorage.key(index);
    if (!key || !key.startsWith(keyPrefix)) continue;
    const dateKey = key.replace(keyPrefix, "");
    if (!/^\d{4}-\d{2}-\d{2}$/.test(dateKey)) continue;
    try {
      entries.push({ dateKey, state: normaliseState(JSON.parse(localStorage.getItem(key)), dateKey) });
    } catch {
      // Ignore broken saved entries.
    }
  }
  return entries.sort((a, b) => b.dateKey.localeCompare(a.dateKey));
}

function countWords(text) {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

function renderJournalDaySummary() {
  const dayState = selectedJournalDate === getLocalDateKey() ? state : loadDayState(selectedJournalDate);
  const completed = dayState.tasks.filter(task => task.done).length;
  const mood = dayState.mood ? `Mood: ${dayState.mood}` : "Mood not chosen yet";
  const positive = dayState.journal ? "Positive note saved" : "No positive note yet";
  els.journalDaySummary.innerHTML = `
    <div><strong>${formatDisplayDate(selectedJournalDate)}</strong><span>${mood}</span></div>
    <div><strong>${completed}</strong><span>wins collected</span></div>
    <div><strong>${countWords(dayState.personalJournal)}</strong><span>journal words</span></div>
    <div><strong>${positive}</strong><span>for this day</span></div>
  `;
}

function loadPersonalJournalForSelectedDate() {
  const dayState = selectedJournalDate === getLocalDateKey() ? state : loadDayState(selectedJournalDate);
  els.personalJournalText.value = dayState.personalJournal || "";
  updatePersonalWordCount();
  renderJournalDaySummary();
}

function savePersonalJournal() {
  const dayState = selectedJournalDate === getLocalDateKey() ? state : loadDayState(selectedJournalDate);
  dayState.personalJournal = els.personalJournalText.value;
  saveDayState(selectedJournalDate, dayState);
  if (selectedJournalDate === getLocalDateKey()) state = dayState;
  els.personalSaveStatus.textContent = `Saved ${new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
  renderJournalDaySummary();
  renderHistory();
  showToast("Personal journal saved privately.");
}

function updatePersonalWordCount() {
  const words = countWords(els.personalJournalText.value);
  els.personalWordCount.textContent = `${words} ${words === 1 ? "word" : "words"}`;
}

function renderHistory() {
  const entries = getAllDayEntries();
  const today = new Date();
  const weekAgo = new Date(today);
  weekAgo.setDate(today.getDate() - 6);
  const monthAgo = new Date(today);
  monthAgo.setDate(today.getDate() - 29);

  const inRange = (dateKey, start) => {
    const [y, m, d] = dateKey.split("-").map(Number);
    const date = new Date(y, m - 1, d);
    date.setHours(0, 0, 0, 0);
    start.setHours(0, 0, 0, 0);
    return date >= start && date <= today;
  };

  const weekEntries = entries.filter(entry => inRange(entry.dateKey, new Date(weekAgo)));
  const monthEntries = entries.filter(entry => inRange(entry.dateKey, new Date(monthAgo)));

  const totalWins = list => list.reduce((sum, entry) => sum + entry.state.tasks.filter(task => task.done).length, 0);
  const journalDays = list => list.filter(entry => entry.state.journal || entry.state.personalJournal).length;
  const moodDays = list => list.filter(entry => entry.state.mood).length;

  els.summaryGrid.innerHTML = `
    <article><strong>${totalWins(weekEntries)}</strong><span>wins this week</span></article>
    <article><strong>${journalDays(weekEntries)}</strong><span>journal days this week</span></article>
    <article><strong>${totalWins(monthEntries)}</strong><span>wins this month</span></article>
    <article><strong>${moodDays(monthEntries)}</strong><span>mood check-ins this month</span></article>
  `;

  if (!entries.length) {
    els.historyList.innerHTML = `<article class="empty-state"><h3>No saved days yet</h3><p>Once you save a note, choose a mood, or tick a win, your days will appear here.</p></article>`;
    return;
  }

  els.historyList.innerHTML = "";
  entries.forEach(entry => {
    const completed = entry.state.tasks.filter(task => task.done).length;
    const snippet = entry.state.personalJournal || entry.state.journal || "A saved day is waiting here.";
    const card = document.createElement("article");
    card.className = "history-card";
    card.innerHTML = `
      <div>
        <strong>${formatDisplayDate(entry.dateKey, { weekday: "short", day: "numeric", month: "short" })}</strong>
        <p>${snippet.slice(0, 120)}${snippet.length > 120 ? "…" : ""}</p>
      </div>
      <div class="history-meta">
        <span>${entry.state.mood || "✨"}</span>
        <span>${completed} wins</span>
      </div>
    `;
    card.addEventListener("click", () => {
      selectedJournalDate = entry.dateKey;
      els.journalDate.value = selectedJournalDate;
      loadPersonalJournalForSelectedDate();
      switchTab("journal");
    });
    els.historyList.appendChild(card);
  });
}

function switchTab(tabName) {
  els.tabButtons.forEach(button => button.classList.toggle("active", button.dataset.tab === tabName));
  els.topActionButtons.forEach(button => button.classList.toggle("active", button.dataset.openTab === tabName));
  els.tabPanels.forEach(panel => panel.classList.toggle("active", panel.id === `${tabName}Panel`));
  if (tabName === "journal") loadPersonalJournalForSelectedDate();
  if (tabName === "history") renderHistory();
}

function setTheme(theme) {
  const isDark = theme === "dark";
  document.documentElement.classList.toggle("dark", isDark);

  const icon = els.themeToggle.querySelector(".theme-icon");
  const label = els.themeToggle.querySelector(".theme-label");

  icon.textContent = isDark ? "☼" : "☾";
  label.textContent = isDark ? "Light mode" : "Dark mode";
  els.themeToggle.setAttribute("aria-label", isDark ? "Switch to light mode" : "Switch to dark mode");

  localStorage.setItem(themeKey, theme);
}

function initTheme() {
  const saved = localStorage.getItem(themeKey);
  const legacy = localStorage.getItem("grounded-journal:theme");
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  setTheme(saved || legacy || (prefersDark ? "dark" : "light"));
}

function getShareUrl() {
  const url = new URL(window.location.href);
  url.hash = "";
  return url.toString();
}

async function shareAppLink() {
  const shareData = {
    title: "You Got This",
    text: "A quiet daily grounding app with positive check-ins, private journaling and support info.",
    url: getShareUrl()
  };

  try {
    if (navigator.share) {
      await navigator.share(shareData);
      return;
    }

    await navigator.clipboard.writeText(shareData.url);
    showToast("Link copied. You can paste it into a message.");
  } catch {
    showToast("Could not send link just now. Copy the address from the browser.");
  }
}

function makeSalt() {
  const bytes = new Uint8Array(12);
  if (window.crypto && window.crypto.getRandomValues) {
    window.crypto.getRandomValues(bytes);
  } else {
    bytes.forEach((_, index) => bytes[index] = Math.floor(Math.random() * 256));
  }
  return Array.from(bytes).map(byte => byte.toString(16).padStart(2, "0")).join("");
}

async function digestText(value) {
  if (window.crypto && window.crypto.subtle && window.TextEncoder) {
    const data = new TextEncoder().encode(value);
    const hash = await window.crypto.subtle.digest("SHA-256", data);
    return Array.from(new Uint8Array(hash)).map(byte => byte.toString(16).padStart(2, "0")).join("");
  }

  return btoa(unescape(encodeURIComponent(value)));
}

async function hashPin(pin, salt) {
  return digestText(`${salt}:${pin}`);
}

function getPinRecord() {
  const saved = localStorage.getItem(pinKey);
  if (!saved) return null;

  try {
    const parsed = JSON.parse(saved);
    return parsed && parsed.salt && parsed.hash ? parsed : null;
  } catch {
    localStorage.removeItem(pinKey);
    return null;
  }
}

function appAccessRequired() {
  return appAccessPassword.trim().length > 0;
}

function hasAppAccess() {
  return !appAccessRequired() || localStorage.getItem(appAccessKey) === "yes";
}

function showAppAccessGate() {
  if (!els.appAccessGate) return;
  els.appAccessGate.classList.remove("hidden");
  document.body.classList.add("app-locked");
  setTimeout(() => els.accessPassword?.focus(), 80);
}

function hideAppAccessGate() {
  if (!els.appAccessGate) return;
  els.appAccessGate.classList.add("hidden");
  document.body.classList.remove("app-locked");
  if (els.accessPassword) els.accessPassword.value = "";
}

function unlockAppAccess() {
  if (!appAccessRequired()) {
    hideAppAccessGate();
    return true;
  }

  const entered = els.accessPassword.value.trim();

  if (entered === appAccessPassword.trim()) {
    localStorage.setItem(appAccessKey, "yes");
    hideAppAccessGate();
    if (getPinRecord()) {
      showPrivacyLock();
    } else {
      showToast("App opened. You got this.");
    }
    return true;
  }

  els.accessStatus.textContent = "That access word did not match. Check it and try again.";
  els.accessPassword.select();
  return false;
}

function initAppAccessGate() {
  if (hasAppAccess()) {
    hideAppAccessGate();
    return true;
  }

  showAppAccessGate();
  return false;
}

function showPrivacyLock() {
  if (!els.privacyLock) return;
  els.privacyLock.classList.remove("hidden");
  els.lockStatus.textContent = "Enter your PIN to unlock this device.";
  setTimeout(() => els.pinInput?.focus(), 80);
}

function hidePrivacyLock() {
  if (!els.privacyLock) return;
  els.privacyLock.classList.add("hidden");
  if (els.pinInput) els.pinInput.value = "";
}

function updatePrivacyUi() {
  if (!els.pinStatus) return;
  const enabled = Boolean(getPinRecord());
  els.pinStatus.textContent = enabled ? "PIN lock is on for this device." : "PIN lock is off.";
  els.setPinButton.textContent = enabled ? "Change PIN" : "Set PIN";
  els.lockNowButton.hidden = !enabled;
  els.removePinButton.hidden = !enabled;
}

async function setPrivacyPin() {
  const pin = els.newPin.value.trim();

  if (!/^\d{4,8}$/.test(pin)) {
    els.pinStatus.textContent = "Choose a PIN using 4 to 8 numbers.";
    els.newPin.focus();
    return;
  }

  const salt = makeSalt();
  const hash = await hashPin(pin, salt);
  localStorage.setItem(pinKey, JSON.stringify({ salt, hash, updatedAt: new Date().toISOString() }));
  els.newPin.value = "";
  updatePrivacyUi();
  showToast("PIN lock is now on.");
}

async function unlockPrivacy() {
  const record = getPinRecord();
  if (!record) {
    hidePrivacyLock();
    return;
  }

  const pin = els.pinInput.value.trim();
  const hash = await hashPin(pin, record.salt);

  if (hash === record.hash) {
    hidePrivacyLock();
    showToast("Unlocked.");
  } else {
    els.lockStatus.textContent = "That PIN did not match. Try again.";
    els.pinInput.select();
  }
}

function removePrivacyPin() {
  const confirmed = window.confirm("Remove the PIN lock from this device?");
  if (!confirmed) return;

  localStorage.removeItem(pinKey);
  updatePrivacyUi();
  hidePrivacyLock();
  showToast("PIN lock removed.");
}


els.tabButtons.forEach(button => {
  button.addEventListener("click", () => switchTab(button.dataset.tab));
});

els.openTabButtons.forEach(button => {
  button.addEventListener("click", () => {
    switchTab(button.dataset.openTab);
    document.querySelector(".tab-bar").scrollIntoView({ behavior: "smooth", block: "start" });
  });
});


els.addForm.addEventListener("submit", event => {
  event.preventDefault();
  addCustomTask(els.newTask.value);
  els.newTask.value = "";
});

els.journalText.addEventListener("input", () => {
  state.journal = els.journalText.value;
  saveTodayState();
  updateWordCount();
  els.saveStatus.textContent = "Autosaved. Press save when you’re done.";
});

els.positiveSaveButton.addEventListener("click", () => {
  state.journal = els.journalText.value;
  saveTodayState();
  els.saveStatus.textContent = `Saved ${new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
  renderHistory();
  showToast("Positive note saved. That good moment counts.");
});

els.promptButton.addEventListener("click", () => {
  state.promptIndex = (state.promptIndex + 1) % journalPrompts.length;
  saveTodayState();
  renderPositiveJournal();
});

els.resetButton.addEventListener("click", () => {
  const keepCustom = state.tasks.filter(task => task.custom).map(task => ({ ...task, done: false }));

  state = {
    ...makeFreshState(getLocalDateKey()),
    tasks: [
      ...defaultTasks.map(task => ({ ...task, done: false, custom: false })),
      ...keepCustom
    ],
    mood: state.mood,
    personalJournal: state.personalJournal
  };

  saveTodayState();
  renderToday();
  loadPersonalJournalForSelectedDate();
  els.breathButton.innerHTML = '<span class="button-kicker">After your breath</span><span>I’m here — I’ve got this</span>';
  showToast("Fresh start. No guilt carried over.");
});

els.breathButton.addEventListener("click", () => {
  state.checkedIn = true;
  saveTodayState();
  els.breathButton.innerHTML = '<span class="button-kicker">Nice. Breath done.</span><span>I’m grounded and ready</span>';
  renderProgress();
  showToast("Good. You arrived back with yourself.");
});

els.journalDate.addEventListener("change", () => {
  selectedJournalDate = els.journalDate.value || getLocalDateKey();
  loadPersonalJournalForSelectedDate();
});

els.personalJournalText.addEventListener("input", () => {
  updatePersonalWordCount();
  els.personalSaveStatus.textContent = "Not saved yet — press save when ready.";
});

els.personalSaveButton.addEventListener("click", savePersonalJournal);

els.themeToggle.addEventListener("click", () => {
  const isDark = document.documentElement.classList.contains("dark");
  setTheme(isDark ? "light" : "dark");
});

els.shareButton.addEventListener("click", shareAppLink);

els.accessButton?.addEventListener("click", unlockAppAccess);

els.accessPassword?.addEventListener("keydown", event => {
  if (event.key === "Enter") unlockAppAccess();
});

els.setPinButton.addEventListener("click", setPrivacyPin);

els.unlockButton.addEventListener("click", unlockPrivacy);

els.pinInput.addEventListener("keydown", event => {
  if (event.key === "Enter") unlockPrivacy();
});

els.newPin.addEventListener("keydown", event => {
  if (event.key === "Enter") setPrivacyPin();
});

els.lockNowButton.addEventListener("click", showPrivacyLock);

els.removePinButton.addEventListener("click", removePrivacyPin);


if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./service-worker.js");
  });
}

initTheme();
const appAccessReady = initAppAccessGate();
updatePrivacyUi();
if (appAccessReady && getPinRecord()) showPrivacyLock();
els.journalDate.value = selectedJournalDate;
renderToday();
loadPersonalJournalForSelectedDate();
renderHistory();
if (state.checkedIn) els.breathButton.innerHTML = '<span class="button-kicker">Nice. Breath done.</span><span>I’m grounded and ready</span>';
