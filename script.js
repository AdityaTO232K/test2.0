const STORAGE_KEY = "wc27_v12_save";
const THEME_KEY = "wc27_theme";
const PROFILE_LIST_KEY = "wc27_profiles";
const ACTIVE_PROFILE_KEY = "wc27_active_profile";

const XP_TRACK_SIZE = 500;
const RUN_REWARDS = {
  1: { coins: 10, xp: 5 },
  2: { coins: 20, xp: 10 },
  4: { coins: 50, xp: 25 },
  6: { coins: 100, xp: 50 }
};

const LEGENDS_DATA = window.LEGENDS_BY_TEAM || {};

function createInitialState(){
  return {
    userTeam: null,
    userXI: [],
    points: {},
    schedule: [],
    currentMatchIndex: 0,
    started: false,
    lockedXI: false,
    liveMatch: null,
    knockout: null,
    tournamentWinner: null,
    pendingFixture: null,
    otherLeagueRounds: [],
    otherLeagueRoundIndex: 0,
    profile: { coins: 0, xp: 0, winStreak: 0, trophies: 0 },
    matchHistory: [],
    playerTournamentStats: {},
    playerOfTournament: null,
    activeProfile: null,
    unlockedLegendIds: []
  };
}

const state = createInitialState();
let celebrationTimer = null;

const els = {
  teamSelect: document.getElementById("teamSelect"),
  squadList: document.getElementById("squadList"),
  selectedCount: document.getElementById("selectedCount"),
  autoXiBtn: document.getElementById("autoXiBtn"),
  lockXiBtn: document.getElementById("lockXiBtn"),
  unlockXiBtn: document.getElementById("unlockXiBtn"),
  playingXi: document.getElementById("playingXi"),
  legendsMarket: document.getElementById("legendsMarket"),
  startBtn: document.getElementById("startBtn"),
  preStage: document.getElementById("preStage"),
  preIndex: document.getElementById("preIndex"),
  preFixture: document.getElementById("preFixture"),
  preDesc: document.getElementById("preDesc"),
  preMatchScreen: document.getElementById("preMatchScreen"),
  inningsInfoScreen: document.getElementById("inningsInfoScreen"),
  inningsFixture: document.getElementById("inningsFixture"),
  tossInfo: document.getElementById("tossInfo"),
  conditionsInfo: document.getElementById("conditionsInfo"),
  inningsSummary: document.getElementById("inningsSummary"),
  chaseBrief: document.getElementById("chaseBrief"),
  beginChaseBtn: document.getElementById("beginChaseBtn"),
  liveScreen: document.getElementById("liveScreen"),
  resultScreen: document.getElementById("resultScreen"),
  resultTitle: document.getElementById("resultTitle"),
  resultRewards: document.getElementById("resultRewards"),
  resultPerformance: document.getElementById("resultPerformance"),
  continueBtn: document.getElementById("continueBtn"),
  postScreen: document.getElementById("postScreen"),
  restartTournamentBtn: document.getElementById("restartTournamentBtn"),
  liveStage: document.getElementById("liveStage"),
  liveIndex: document.getElementById("liveIndex"),
  liveFixture: document.getElementById("liveFixture"),
  targetLine: document.getElementById("targetLine"),
  phaseBadge: document.getElementById("phaseBadge"),
  dynamicLabelA: document.getElementById("dynamicLabelA"),
  scoreMain: document.getElementById("scoreMain"),
  oversMain: document.getElementById("oversMain"),
  runsNeeded: document.getElementById("runsNeeded"),
  ballsLeft: document.getElementById("ballsLeft"),
  confidenceRing: document.getElementById("confidenceRing"),
  confidenceValue: document.getElementById("confidenceValue"),
  confidenceLabel: document.getElementById("confidenceLabel"),
  battersBox: document.getElementById("battersBox"),
  bowlerBox: document.getElementById("bowlerBox"),
  probBars: document.getElementById("probBars"),
  recentBalls: document.getElementById("recentBalls"),
  commentaryBox: document.getElementById("commentaryBox"),
  scorecardBox: document.getElementById("scorecardBox"),
  bowlingScorecardBox: document.getElementById("bowlingScorecardBox"),
  fallOfWicketsBox: document.getElementById("fallOfWicketsBox"),
  partnershipsBox: document.getElementById("partnershipsBox"),
  manhattanChart: document.getElementById("manhattanChart"),
  wormChart: document.getElementById("wormChart"),
  realTalkBox: document.getElementById("realTalkBox"),
  nextBallBtn: document.getElementById("nextBallBtn"),
  simulateOverBtn: document.getElementById("simulateOverBtn"),
  simulateInningsBtn: document.getElementById("simulateInningsBtn"),
  scheduleList: document.getElementById("scheduleList"),
  pointsTable: document.getElementById("pointsTable"),
  winnerTitle: document.getElementById("winnerTitle"),
  ceremonyStage: document.getElementById("ceremonyStage"),
  knockoutSummary: document.getElementById("knockoutSummary"),
  trophyCabinet: document.getElementById("trophyCabinet"),
  resetBtn: document.getElementById("resetBtn"),
  saveBtn: document.getElementById("saveBtn"),
  loadBtn: document.getElementById("loadBtn"),
  currentProfileLabel: document.getElementById("currentProfileLabel"),
  profileMessage: document.getElementById("profileMessage"),
  showSelectProfileBtn: document.getElementById("showSelectProfileBtn"),
  showCreateProfileBtn: document.getElementById("showCreateProfileBtn"),
  selectProfileForm: document.getElementById("selectProfileForm"),
  createProfileForm: document.getElementById("createProfileForm"),
  profileSelect: document.getElementById("profileSelect"),
  createProfileName: document.getElementById("createProfileName"),
  lightModeBtn: document.getElementById("lightModeBtn"),
  darkModeBtn: document.getElementById("darkModeBtn"),
  selectedTeamBadge: document.getElementById("selectedTeamBadge"),
  selectedTeamName: document.getElementById("selectedTeamName"),
  userMiniBadge: document.getElementById("userMiniBadge"),
  oppMiniBadge: document.getElementById("oppMiniBadge"),
  userMiniCode: document.getElementById("userMiniCode"),
  oppMiniCode: document.getElementById("oppMiniCode"),
  profileLevel: document.getElementById("profileLevel"),
  coinsValue: document.getElementById("coinsValue"),
  xpValue: document.getElementById("xpValue"),
  streakValue: document.getElementById("streakValue"),
  trophyValue: document.getElementById("trophyValue"),
  xpFill: document.getElementById("xpFill"),
  mostRunsTitle: document.getElementById("mostRunsTitle"),
  mostRunsBox: document.getElementById("mostRunsBox"),
  careerRecordsBox: document.getElementById("careerRecordsBox"),
  matchDetailsBox: document.getElementById("matchDetailsBox"),
  celebrationBanner: document.getElementById("celebrationBanner")
};

init();

function init(){
  applySavedTheme();
  initProfiles();
  initPoints();
  buildTeamSelect();
  bindEvents();
  initPullUpAnimations();
  initTournamentStatsForTeam();
  renderPointsTable();
  renderSchedule();
  updateSelectedTeamCard();
  renderProfile();
  renderMostRuns();
  renderCareerRecords();
  renderLegendsMarket();
  renderPreMatchCard();
  updateProfileUI();
  refreshSquadControls();
}

function applySavedTheme(){
  const savedTheme = localStorage.getItem(THEME_KEY) || "light";
  setTheme(savedTheme);
}

function setTheme(theme){
  const nextTheme = theme === "dark" ? "dark" : "light";
  document.body.setAttribute("data-theme", nextTheme);
  if(els.lightModeBtn) els.lightModeBtn.classList.toggle("active", nextTheme === "light");
  if(els.darkModeBtn) els.darkModeBtn.classList.toggle("active", nextTheme === "dark");
  localStorage.setItem(THEME_KEY, nextTheme);
}

function initProfiles(){
  const activeProfile = localStorage.getItem(ACTIVE_PROFILE_KEY);
  if(activeProfile){
    state.activeProfile = activeProfile;
  }
  renderProfileOptions();
}

function getStoredProfiles(){
  try{
    return JSON.parse(localStorage.getItem(PROFILE_LIST_KEY)) || [];
  }catch{
    return [];
  }
}

function saveStoredProfiles(profiles){
  localStorage.setItem(PROFILE_LIST_KEY, JSON.stringify(profiles));
}

function normalizeProfileName(name){
  return name.trim();
}

function getProfileKey(profileName){
  return `${STORAGE_KEY}_${profileName}`;
}

function setProfileMessage(message, type = "info"){
  if(!els.profileMessage) return;
  els.profileMessage.textContent = message;
  els.profileMessage.className = `auth-message ${type}`;
}

function clearProfileMessage(){
  if(!els.profileMessage) return;
  els.profileMessage.textContent = "";
  els.profileMessage.className = "auth-message hidden";
}

function switchProfileTab(mode){
  const selecting = mode === "select";
  els.selectProfileForm.classList.toggle("hidden", !selecting);
  els.createProfileForm.classList.toggle("hidden", selecting);
  els.showSelectProfileBtn.classList.toggle("active", selecting);
  els.showCreateProfileBtn.classList.toggle("active", !selecting);
  clearProfileMessage();
}

function renderProfileOptions(){
  const profiles = getStoredProfiles();
  if(!els.profileSelect) return;

  if(!profiles.length){
    els.profileSelect.innerHTML = `<option value="">No profiles yet</option>`;
    return;
  }

  els.profileSelect.innerHTML = profiles.map(profile => `
    <option value="${profile.name}" ${profile.name === state.activeProfile ? "selected" : ""}>${profile.name}</option>
  `).join("");
}

function updateProfileUI(){
  if(els.currentProfileLabel){
    els.currentProfileLabel.textContent = state.activeProfile || "No Profile Selected";
  }

  if(els.saveBtn){
    els.saveBtn.disabled = !state.activeProfile;
  }

  if(els.loadBtn){
    els.loadBtn.disabled = !state.activeProfile;
  }

  renderProfileOptions();
}

function createProfile(event){
  event.preventDefault();

  const name = normalizeProfileName(els.createProfileName.value);
  if(!name){
    setProfileMessage("Please enter a profile name.", "error");
    return;
  }

  const profiles = getStoredProfiles();
  const exists = profiles.some(profile => profile.name.toLowerCase() === name.toLowerCase());

  if(exists){
    setProfileMessage("Profile already exists. Choose it from Select Profile.", "error");
    return;
  }

  profiles.push({ name, createdAt: Date.now() });
  saveStoredProfiles(profiles);

  state.activeProfile = name;
  localStorage.setItem(ACTIVE_PROFILE_KEY, name);

  els.createProfileForm.reset();
  renderProfileOptions();
  updateProfileUI();
  setProfileMessage(`Profile "${name}" created successfully.`, "success");
  switchProfileTab("select");
}

function selectProfile(event){
  event.preventDefault();

  const selected = els.profileSelect.value;
  if(!selected){
    setProfileMessage("Please select a profile first.", "error");
    return;
  }

  state.activeProfile = selected;
  localStorage.setItem(ACTIVE_PROFILE_KEY, selected);
  updateProfileUI();
  setProfileMessage(`Now using profile "${selected}".`, "success");
}

function initPullUpAnimations(){
  const revealNodes = Array.from(document.querySelectorAll(".pull-up"));
  if(!revealNodes.length) return;

  if(!("IntersectionObserver" in window)){
    revealNodes.forEach(node => node.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.18, rootMargin: "0px 0px -40px 0px" });

  revealNodes.forEach(node => observer.observe(node));
}

function initPoints(){
  state.points = {};
  TEAM_NAMES.forEach(team => {
    state.points[team] = {
      team,
      played: 0,
      won: 0,
      lost: 0,
      points: 0,
      runsFor: 0,
      ballsFor: 0,
      runsAgainst: 0,
      ballsAgainst: 0,
      nrr: 0
    };
  });
}

function getTeamLegendPool(team){
  return Array.isArray(LEGENDS_DATA[team]) ? LEGENDS_DATA[team] : [];
}

function getLegendId(team, playerName){
  return `${team}_${playerName}`.toLowerCase().replace(/[^a-z0-9]+/g, "_");
}

function getUnlockedLegendsForTeam(team){
  return getTeamLegendPool(team).filter(player => state.unlockedLegendIds.includes(getLegendId(team, player.name)));
}

function getCurrentSquad(){
  if(!state.userTeam) return [];
  return [...SQUADS[state.userTeam], ...getUnlockedLegendsForTeam(state.userTeam)];
}

function initTournamentStatsForTeam(){
  state.playerTournamentStats = {};

  TEAM_NAMES.forEach(team => {
    const allPlayers = [...SQUADS[team], ...getTeamLegendPool(team)];
    allPlayers.forEach(player => {
      const key = `${team}_${player.name}`;
      state.playerTournamentStats[key] = {
        key,
        team,
        name: player.name,
        matches: 0,
        runs: 0,
        balls: 0,
        outCount: 0,
        fifties: 0,
        hundreds: 0,
        awards: 0,
        fastestFiftyBalls: null,
        fastestCenturyBalls: null
      };
    });
  });
}

function buildTeamSelect(){
  els.teamSelect.innerHTML = TEAM_NAMES.map(code => `<option value="${code}">${TEAM_FULL[code]}</option>`).join("");
  state.userTeam = els.teamSelect.value || TEAM_NAMES[0];
  els.teamSelect.value = state.userTeam;
  renderSquad();
  renderPlayingXI();
}

function bindEvents(){
  if(els.showSelectProfileBtn){
    els.showSelectProfileBtn.addEventListener("click", () => switchProfileTab("select"));
  }

  if(els.showCreateProfileBtn){
    els.showCreateProfileBtn.addEventListener("click", () => switchProfileTab("create"));
  }

  if(els.selectProfileForm){
    els.selectProfileForm.addEventListener("submit", selectProfile);
  }

  if(els.createProfileForm){
    els.createProfileForm.addEventListener("submit", createProfile);
  }

  if(els.lightModeBtn){
    els.lightModeBtn.addEventListener("click", () => setTheme("light"));
  }

  if(els.darkModeBtn){
    els.darkModeBtn.addEventListener("click", () => setTheme("dark"));
  }

  els.teamSelect.addEventListener("change", () => {
    if(state.started) return;
    state.userTeam = els.teamSelect.value || TEAM_NAMES[0];
    state.userXI = [];
    state.lockedXI = false;
    initTournamentStatsForTeam();
    renderSquad();
    renderPlayingXI();
    updateSelectedTeamCard();
    renderMostRuns();
    renderCareerRecords();
    renderLegendsMarket();
    renderPreMatchCard();
    refreshSquadControls();
  });

  els.autoXiBtn.addEventListener("click", autoPickXI);
  els.lockXiBtn.addEventListener("click", lockXI);
  if(els.unlockXiBtn) els.unlockXiBtn.addEventListener("click", unlockXI);
  els.startBtn.addEventListener("click", startTournament);
  els.beginChaseBtn.addEventListener("click", beginLiveMatch);
  els.nextBallBtn.addEventListener("click", () => playBall());
  els.simulateOverBtn.addEventListener("click", simulateOver);
  els.simulateInningsBtn.addEventListener("click", simulateInnings);
  els.continueBtn.addEventListener("click", continueAfterResult);
  els.resetBtn.addEventListener("click", resetTournament);
  els.saveBtn.addEventListener("click", saveGame);
  els.loadBtn.addEventListener("click", loadGame);
  if(els.restartTournamentBtn) els.restartTournamentBtn.addEventListener("click", restartTournamentRun);

  document.querySelectorAll(".mode-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".mode-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      if(state.liveMatch){
        state.liveMatch.mode = btn.dataset.mode;
        updateProbabilities();
        renderProbBars();
      }
    });
  });
}

function updateSelectedTeamCard(){
  els.selectedTeamBadge.textContent = TEAM_FLAGS[state.userTeam];
  els.selectedTeamName.textContent = TEAM_FULL[state.userTeam];
  els.mostRunsTitle.textContent = "Most Runs in Tournament";
}

function renderProfile(){
  const xpCurrent = state.profile.xp % XP_TRACK_SIZE;
  els.profileLevel.textContent = `${state.profile.xp} XP`;
  els.coinsValue.textContent = `🪙 ${state.profile.coins}`;
  els.xpValue.textContent = `⭐ ${state.profile.xp} XP`;
  els.streakValue.textContent = `🔥 ${state.profile.winStreak}`;
  els.trophyValue.textContent = `🏆 ${state.profile.trophies}`;
  els.xpFill.style.width = `${(xpCurrent / XP_TRACK_SIZE) * 100}%`;
}

function refreshSquadControls(){
  if(els.unlockXiBtn){
    els.unlockXiBtn.disabled = !state.lockedXI || !!state.liveMatch;
  }
  if(els.lockXiBtn){
    els.lockXiBtn.textContent = state.lockedXI ? "Playing XI Locked" : "Lock Playing XI";
  }
}

function renderSquad(){
  const squad = getCurrentSquad();
  els.squadList.innerHTML = squad.map((player, idx) => `
    <label class="player-item">
      <div class="player-meta">
        <span class="player-name">${player.name}${player.isLegend ? " 🌟" : ""}</span>
        <span class="player-role">${prettyRole(player.role)} • RTG ${player.rating} • Form ${player.recentForm}</span>
      </div>
      <input type="checkbox" data-index="${idx}" ${state.userXI.includes(idx) ? "checked" : ""} ${state.lockedXI ? "disabled" : ""}>
    </label>
  `).join("");

  els.squadList.querySelectorAll("input").forEach(input => {
    input.addEventListener("change", e => {
      if(state.lockedXI) return;
      const idx = Number(e.target.dataset.index);
      if(e.target.checked){
        if(state.userXI.length >= 11){
          e.target.checked = false;
          return;
        }
        state.userXI.push(idx);
      } else {
        state.userXI = state.userXI.filter(i => i !== idx);
      }
      updateSelectedCount();
      renderPlayingXI();
    });
  });

  updateSelectedCount();
  refreshSquadControls();
}

function updateSelectedCount(){
  els.selectedCount.textContent = `${state.userXI.length} / 11 selected`;
}

function autoPickXI(){
  if(state.started || state.lockedXI) return;
  const squad = getCurrentSquad();
  const bat = [];
  const ar = [];
  const bowl = [];

  squad.forEach((p, idx) => {
    if(p.role === "batsman") bat.push({ idx, rating: p.rating });
    else if(p.role === "allrounder") ar.push({ idx, rating: p.rating });
    else bowl.push({ idx, rating: p.rating });
  });

  bat.sort((a,b) => b.rating - a.rating);
  ar.sort((a,b) => b.rating - a.rating);
  bowl.sort((a,b) => b.rating - a.rating);

  state.userXI = [
    ...bat.slice(0,4).map(x => x.idx),
    ...ar.slice(0,3).map(x => x.idx),
    ...bowl.slice(0,4).map(x => x.idx)
  ].slice(0,11);

  renderSquad();
  renderPlayingXI();
}

function renderPlayingXI(){
  const squad = getCurrentSquad();
  if(state.userXI.length === 0){
    els.playingXi.innerHTML = `<div class="muted">No players selected yet.</div>`;
    return;
  }

  els.playingXi.innerHTML = state.userXI.map(idx => {
    const p = squad[idx];
    if(!p) return "";
    return `<div class="chip">${p.name} <span class="muted">(${prettyRole(p.role)} • ${p.rating})</span></div>`;
  }).join("");
}

function lockXI(){
  if(state.userXI.length !== 11){
    alert("Select exactly 11 players.");
    return;
  }
  state.lockedXI = true;
  renderSquad();
  alert("Playing XI locked.");
}

function unlockXI(){
  if(!state.lockedXI){
    alert("Your Playing XI is already editable.");
    return;
  }

  if(state.liveMatch){
    alert("Finish the current match before changing your XI.");
    return;
  }

  state.lockedXI = false;
  state.pendingFixture = null;
  renderSquad();
  renderPlayingXI();
  renderPreMatchCard();
  alert("Playing XI unlocked. You can now change your squad.");
}

function renderPreMatchCard(){
  els.preMatchScreen.classList.remove("hidden");
  els.inningsInfoScreen.classList.add("hidden");
  els.liveScreen.classList.add("hidden");
  els.resultScreen.classList.add("hidden");

  if(!state.started){
    els.preStage.textContent = "League Match";
    els.preIndex.textContent = "1 / 9";
    els.preFixture.textContent = "Choose a team and XI first";
    els.preDesc.textContent = "Start your tournament when ready.";
    els.startBtn.textContent = "Start Tournament";
    return;
  }

  const fixture = state.schedule[state.currentMatchIndex];
  if(!fixture){
    els.preStage.textContent = "Tournament";
    els.preIndex.textContent = "-";
    els.preFixture.textContent = "Tournament complete";
    els.preDesc.textContent = "No pending matches.";
    els.startBtn.textContent = "Tournament Complete";
    return;
  }

  els.preStage.textContent = fixture.stage;
  els.preIndex.textContent = fixture.stage === "League Match" ? `${fixture.index} / 9` : fixture.stage;
  els.preFixture.textContent = `${TEAM_FULL[fixture.teamA]} vs ${TEAM_FULL[fixture.teamB]}`;
  els.preDesc.textContent = state.lockedXI
    ? "Your XI is locked. Enter match setup when ready."
    : "Unlock complete. Update your XI and lock it again before continuing.";
  els.startBtn.textContent = "Continue Tournament";
}

function getLegendReward(runs){
  return RUN_REWARDS[runs] || { coins: 0, xp: 0 };
}

function awardShotRewards(runs, batterName){
  const reward = getLegendReward(runs);
  if(!reward.coins && !reward.xp) return;

  state.profile.coins += reward.coins;
  state.profile.xp += reward.xp;
  renderProfile();
  renderLegendsMarket();

  if(runs >= 4){
    showCelebration(`${batterName} earned ${reward.coins} coins and ${reward.xp} XP.`);
  }
}

function renderLegendsMarket(){
  if(!els.legendsMarket) return;

  const legends = getTeamLegendPool(state.userTeam);
  if(!legends.length){
    els.legendsMarket.innerHTML = `<div class="muted">No legends available yet.</div>`;
    return;
  }

  els.legendsMarket.innerHTML = legends.map(player => {
    const legendId = getLegendId(state.userTeam, player.name);
    const unlocked = state.unlockedLegendIds.includes(legendId);
    const canUnlock = state.profile.coins >= player.unlockCoins && state.profile.xp >= player.unlockXp;

    return `
      <div class="legend-item">
        <div class="legend-copy">
          <div class="legend-name">${player.name}</div>
          <div class="legend-meta">${prettyRole(player.role)} • RTG ${player.rating} • Form ${player.recentForm}</div>
          <div class="legend-cost">🪙 ${player.unlockCoins} • ⭐ ${player.unlockXp}</div>
        </div>
        <button
          class="btn ${unlocked ? "ghost" : "primary"}"
          data-legend-id="${legendId}"
          ${unlocked ? "disabled" : ""}
          ${!unlocked && !canUnlock ? "disabled" : ""}
        >
          ${unlocked ? "Unlocked" : "Unlock"}
        </button>
      </div>
    `;
  }).join("");

  els.legendsMarket.querySelectorAll("[data-legend-id]").forEach(btn => {
    btn.addEventListener("click", () => unlockLegend(btn.dataset.legendId));
  });
}

function unlockLegend(legendId){
  const legends = getTeamLegendPool(state.userTeam);
  const player = legends.find(item => getLegendId(state.userTeam, item.name) === legendId);
  if(!player) return;
  if(state.unlockedLegendIds.includes(legendId)) return;

  if(state.profile.coins < player.unlockCoins || state.profile.xp < player.unlockXp){
    alert(`Not enough resources. Need ${player.unlockCoins} coins and ${player.unlockXp} XP.`);
    return;
  }

  state.profile.coins -= player.unlockCoins;
  state.profile.xp -= player.unlockXp;
  state.unlockedLegendIds.push(legendId);

  renderProfile();
  renderLegendsMarket();
  renderSquad();
  renderPlayingXI();
  saveGameSilently();
  showCelebration(`${player.name} unlocked for ${TEAM_FULL[state.userTeam]}.`);
}

function startTournament(){
  if(!state.lockedXI){
    alert("Lock your Playing XI first.");
    return;
  }

  if(!state.started){
    state.started = true;
    state.schedule = buildUserLeagueSchedule(state.userTeam);
    state.otherLeagueRounds = buildOtherLeagueRounds(state.userTeam);
    state.otherLeagueRoundIndex = 0;
    state.currentMatchIndex = 0;
    renderSchedule();
  }

  const fixture = state.schedule[state.currentMatchIndex];
  if(fixture) prepareMatch(fixture);
}

function buildUserLeagueSchedule(userTeam){
  const opponents = TEAM_NAMES.filter(t => t !== userTeam);
  return opponents.map((opp, index) => ({
    id: `league_${index + 1}`,
    stage: "League Match",
    index: index + 1,
    teamA: userTeam,
    teamB: opp,
    played: false,
    resultText: "",
    winner: null,
    stats: null
  }));
}

function buildOtherLeagueRounds(userTeam){
  const teams = TEAM_NAMES.filter(team => team !== userTeam);
  const rotation = [...teams];

  if(rotation.length % 2 === 1){
    rotation.push(null);
  }

  const rounds = [];

  for(let round = 0; round < rotation.length - 1; round++){
    const matches = [];

    for(let i = 0; i < rotation.length / 2; i++){
      const a = rotation[i];
      const b = rotation[rotation.length - 1 - i];
      if(a && b) matches.push([a, b]);
    }

    rounds.push(matches);

    const last = rotation.pop();
    rotation.splice(1, 0, last);
  }

  return rounds;
}

function rolePriority(role){
  if(role === "batsman") return 3;
  if(role === "allrounder") return 2;
  return 1;
}

function simulateAIBattingScorecard(teamCode, total, oversLimit = 50){
  const battingPool = [...SQUADS[teamCode]]
    .sort((a, b) => {
      const scoreA = rolePriority(a.role) * 100 + a.rating + a.recentForm;
      const scoreB = rolePriority(b.role) * 100 + b.rating + b.recentForm;
      return scoreB - scoreA;
    })
    .slice(0, 8);

  const wickets = clamp(rand(2, 8), 0, Math.max(0, battingPool.length - 1));
  const ballsBudget = Math.max(Math.round((oversLimit * 6) * rand(72, 100) / 100), 120);

  let runsLeft = total;
  let ballsLeft = ballsBudget;

  const rawWeights = battingPool.map((p, index) => {
    const base = p.rating + p.recentForm + rolePriority(p.role) * 16;
    return Math.max(10, base - index * 6);
  });

  const weightSum = rawWeights.reduce((a, b) => a + b, 0);

  return battingPool.map((p, index) => {
    const remainingPlayers = battingPool.length - index;
    const share = remainingPlayers === 1
      ? runsLeft
      : Math.max(0, Math.round((total * rawWeights[index]) / weightSum * rand(75, 125) / 100));

    let runs = remainingPlayers === 1 ? runsLeft : Math.min(share, runsLeft);
    if(index === 0) runs = Math.max(runs, Math.min(35, total));
    if(index > 4) runs = Math.min(runs, Math.round(total * 0.18));

    const estimatedBalls = Math.max(
      runs > 0 ? Math.round(runs * rand(85, 145) / 100) : rand(2, 8),
      1
    );

    const balls = remainingPlayers === 1
      ? Math.max(1, ballsLeft)
      : Math.min(estimatedBalls, Math.max(1, ballsLeft - (remainingPlayers - 1)));

    const out = index < wickets;

    runsLeft -= runs;
    ballsLeft -= balls;

    return {
      team: teamCode,
      name: p.name,
      runs,
      balls,
      out
    };
  });
}

function updateTournamentStatsFromAIScorecard(scorecard){
  if(!scorecard || !scorecard.length) return;

  scorecard.forEach(p => {
    const key = `${p.team}_${p.name}`;
    const t = state.playerTournamentStats[key];
    if(!t) return;

    t.matches += 1;
    t.runs += p.runs;
    t.balls += p.balls;
    if(p.out) t.outCount += 1;
    if(p.runs >= 50 && p.runs < 100) t.fifties += 1;
    if(p.runs >= 100) t.hundreds += 1;
  });
}

function prepareMatch(fixture){
  state.pendingFixture = fixture;

  const rain = Math.random() < 0.18;
  const oversLimit = rain ? rand(35, 45) : 50;
  const dew = Math.random() < 0.55;

  const tossWinner = Math.random() < 0.5 ? fixture.teamA : fixture.teamB;
  const tossDecision = decideTossChoice(tossWinner, fixture.teamA, fixture.teamB, dew, oversLimit);
  const firstBatting = tossDecision === "bat" ? tossWinner : (tossWinner === fixture.teamA ? fixture.teamB : fixture.teamA);

  const firstInningsScore = generateTarget(firstBatting, oversLimit) - 1;
  const target = firstInningsScore + 1;

  Object.assign(fixture, {
    tossWinner,
    tossDecision,
    firstBatting,
    secondBatting: firstBatting === fixture.teamA ? fixture.teamB : fixture.teamA,
    firstInningsScore,
    target,
    oversLimit,
    rain,
    dew,
    firstInningsBattingCard: firstBatting === state.userTeam
      ? null
      : simulateAIBattingScorecard(firstBatting, firstInningsScore, oversLimit)
  });

  els.preMatchScreen.classList.add("hidden");
  els.liveScreen.classList.add("hidden");
  els.resultScreen.classList.add("hidden");
  els.postScreen.classList.add("hidden");
  els.inningsInfoScreen.classList.remove("hidden");

  els.inningsFixture.textContent = `${TEAM_FULL[fixture.teamA]} vs ${TEAM_FULL[fixture.teamB]}`;
  els.tossInfo.textContent = `${TEAM_FULL[tossWinner]} won the toss and chose to ${tossDecision} first.`;
  els.conditionsInfo.textContent = `${rain ? `Rain reduced match to ${oversLimit} overs. ` : "Full 50-over match. "}${dew ? "Heavy dew expected later." : "Dry surface, grip on offer."}`;
  els.inningsSummary.innerHTML = `<strong>${TEAM_FULL[firstBatting]}</strong> projected first innings: <strong>${firstInningsScore}/8</strong><br>Overs: <strong>${oversLimit}</strong>`;
  if(firstBatting === state.userTeam){
    els.chaseBrief.innerHTML = `<strong>You bat first.</strong><br>Set a strong total in ${oversLimit} overs. AI will chase.`;
  } else {
    els.chaseBrief.innerHTML = `<strong>You chase.</strong><br>You need <strong>${target}</strong> in ${oversLimit} overs.`;
  }
}

function decideTossChoice(tossWinner, teamA, teamB, dew, oversLimit){
  const strength = TEAM_STRENGTH[tossWinner];
  if(dew) return "bowl";
  if(oversLimit < 45) return "bowl";
  if(strength >= 90 && Math.random() < 0.55) return "bowl";
  return "bat";
}

function beginLiveMatch(){
  const fixture = state.pendingFixture;
  if(!fixture) return;

  const squad = getCurrentSquad();
  const userBatsFirst = fixture.firstBatting === state.userTeam;

  const battingOrder = state.userXI.map(idx => {
    const p = squad[idx];
    return {
      ...p,
      runs: 0,
      balls: 0,
      fours: 0,
      sixes: 0,
      out: false,
      dismissal: "",
      milestonesHit: [],
      fiftyBallMark: null,
      centuryBallMark: null
    };
  });

  const opponentBowling = SQUADS[fixture.teamB]
    .filter(p => p.role === "bowler" || p.role === "allrounder")
    .map(p => ({
      name: p.name,
      bowlingType: p.preferredAgainst,
      rating: p.rating,
      recentForm: p.recentForm,
      balls: 0,
      runs: 0,
      wickets: 0,
      wides: 0,
      noballs: 0
    }));

  state.liveMatch = {
    stage: fixture.stage,
    fixtureIndex: fixture.index || fixture.stage,
    battingTeam: state.userTeam,
    bowlingTeam: fixture.teamB,
    oversLimit: fixture.oversLimit,
    target: userBatsFirst ? null : fixture.target,
    firstInningsScore: fixture.firstInningsScore,
    inningsMode: userBatsFirst ? "set-target" : "chase",
    score: 0,
    wickets: 0,
    balls: 0,
    extras: 0,
    confidence: 50,
    mode: getCurrentMode(),
    probabilities: {0:28,1:34,2:11,4:14,6:7,W:2,WD:2,NB:2},
    recent: [],
    commentary: userBatsFirst
      ? [`You are batting first. Set a total in ${fixture.oversLimit} overs.`]
      : [`${TEAM_FULL[fixture.firstBatting]} posted ${fixture.firstInningsScore}/8.`, `${TEAM_FULL[state.userTeam]} need ${fixture.target} to win.`],
    complete: false,
    battingOrder,
    strikerIndex: 0,
    nonStrikerIndex: 1,
    nextBatterIndex: 2,
    bowlers: opponentBowling.length ? opponentBowling : [{ name:"Default Bowler", bowlingType:"pace", rating:75, recentForm:75, balls:0, runs:0, wickets:0, wides:0, noballs:0 }],
    currentBowlerIndex: 0,
    matchResolved: false,
    playerOfMatch: null,
    wicketEvents: [],
    partnerships: [],
    currentPartnership: { batters:"", runs:0, balls:0 },
    overRuns: [],
    currentOverRuns: 0,
    wormPoints: [],
    aiChaseSummary: null
  };

  updateCurrentPartnershipLabel();

  els.inningsInfoScreen.classList.add("hidden");
  els.liveScreen.classList.remove("hidden");

  els.liveStage.textContent = fixture.stage;
  els.liveIndex.textContent = fixture.stage === "League Match" ? `${fixture.index} / 9` : fixture.stage;
  els.liveFixture.textContent = `${TEAM_FULL[fixture.teamA]} vs ${TEAM_FULL[fixture.teamB]}`;
  els.targetLine.textContent = userBatsFirst ? `Bat first • ${fixture.oversLimit} overs` : `Target: ${fixture.target} runs`;
  els.dynamicLabelA.textContent = userBatsFirst ? "Projected Score" : "Runs Needed";

  els.userMiniBadge.textContent = TEAM_FLAGS[state.userTeam];
  els.oppMiniBadge.textContent = TEAM_FLAGS[fixture.teamB];
  els.userMiniCode.textContent = state.userTeam;
  els.oppMiniCode.textContent = fixture.teamB;

  updateProbabilities();
  renderLiveMatch();
}

function getCurrentMode(){
  const active = document.querySelector(".mode-btn.active");
  return active ? active.dataset.mode : "balanced";
}

function generateTarget(teamCode, oversLimit = 50){
  const strength = TEAM_STRENGTH[teamCode];
  let total = 350 + rand(0, 60) + Math.floor((strength - 70) * 1.1);

  if(total < 350) total = 350;
  if(total > 450) total = 450;

  if(oversLimit < 50){
    total = Math.round(total * (oversLimit / 50));
    if(total < 250) total = 250;
  }
  return total;
}

function simulateOver(){
  for(let i = 0; i < 6; i++){
    if(!state.liveMatch || state.liveMatch.complete) break;
    playBall();
  }
}

function simulateInnings(){
  while(state.liveMatch && !state.liveMatch.complete){
    playBall(true);
  }
  if(state.liveMatch && state.liveMatch.complete && !state.liveMatch.matchResolved){
    resolveCompletedMatch();
  }
}

function playBall(skipResolve = false){
  const m = state.liveMatch;
  if(!m || m.complete) return;

  updateProbabilities();
  const outcome = weightedPick(m.probabilities);
  const striker = m.battingOrder[m.strikerIndex];
  const currentBowler = getCurrentBowler();

  if(outcome === "WD"){
    m.score += 1;
    m.extras += 1;
    m.currentOverRuns += 1;
    m.currentPartnership.runs += 1;
    currentBowler.runs += 1;
    currentBowler.wides += 1;
    m.confidence = clamp(m.confidence + 1, 0, 100);
    pushRecent("Wd");
    addCommentary(`${overString(m.balls)} - Wide ball. Free run.`);
  } else if(outcome === "NB"){
    m.score += 1;
    m.extras += 1;
    m.currentOverRuns += 1;
    m.currentPartnership.runs += 1;
    currentBowler.runs += 1;
    currentBowler.noballs += 1;
    m.confidence = clamp(m.confidence + 2, 0, 100);
    pushRecent("Nb");
    addCommentary(`${overString(m.balls)} - No ball. Bonus run.`);
  } else {
    m.balls += 1;
    striker.balls += 1;
    currentBowler.balls += 1;
    m.currentPartnership.balls += 1;

    if(outcome === "W"){
      m.wickets += 1;
      striker.out = true;
      striker.dismissal = `c / b ${currentBowler.name}`;
      currentBowler.wickets += 1;
      m.confidence = clamp(m.confidence - 9, 0, 100);
      pushRecent("W");
      addCommentary(`${overString(m.balls)} - WICKET! ${striker.name} departs.`);

      m.wicketEvents.push({ score:m.score, wicketNo:m.wickets, batter:striker.name, over:overString(m.balls) });

      closeCurrentPartnership();
      handleWicket();
      updateCurrentPartnershipLabel();
    } else {
      const runs = Number(outcome);
      m.score += runs;
      striker.runs += runs;
      m.currentOverRuns += runs;
      m.currentPartnership.runs += runs;
      currentBowler.runs += runs;
      if(runs === 4) striker.fours += 1;
      if(runs === 6) striker.sixes += 1;

      awardShotRewards(runs, striker.name);
      checkMilestone(striker);
      adjustConfidence(runs);
      pushRecent(String(runs));
      addCommentary(`${overString(m.balls)} - ${striker.name} scores ${runs}.`);

      if(runs % 2 === 1) swapStrike();
      updateCurrentPartnershipLabel();
    }

    if(m.balls % 6 === 0 && !m.complete){
      m.overRuns.push(m.currentOverRuns);
      m.wormPoints.push(m.score);
      m.currentOverRuns = 0;

      swapStrike();
      rotateBowlerByPhase();
      addCommentary(`End of over ${Math.floor(m.balls / 6)}. ${getCurrentBowler().name} continues the pressure.`);
    }
  }

  if(m.score >= currentTarget() || m.wickets >= 10 || m.balls >= m.oversLimit * 6){
    m.complete = true;
    if(m.balls % 6 !== 0 || m.currentOverRuns > 0){
      m.overRuns.push(m.currentOverRuns);
      m.wormPoints.push(m.score);
      m.currentOverRuns = 0;
    }
    closeCurrentPartnership(true);
  }

  renderLiveMatch();

  if(m.complete && !skipResolve){
    resolveCompletedMatch();
  }
}

function currentTarget(){
  const m = state.liveMatch;
  if(m.inningsMode === "set-target") return Infinity;
  return m.target;
}

function updateCurrentPartnershipLabel(){
  const m = state.liveMatch;
  const striker = m.battingOrder[m.strikerIndex];
  const nonStriker = m.battingOrder[m.nonStrikerIndex];
  m.currentPartnership.batters = `${striker.name} & ${nonStriker.name}`;
}

function closeCurrentPartnership(finalClose = false){
  const m = state.liveMatch;
  if(m.currentPartnership.balls === 0 && m.currentPartnership.runs === 0) return;
  m.partnerships.push({
    batters: m.currentPartnership.batters,
    runs: m.currentPartnership.runs,
    balls: m.currentPartnership.balls,
    final: finalClose
  });
  m.currentPartnership = { batters:"", runs:0, balls:0 };
}

function checkMilestone(player){
  const highestMilestone = Math.floor(player.runs / 50) * 50;

  for(let mark = 50; mark <= highestMilestone; mark += 50){
    if(!player.milestonesHit.includes(mark)){
      player.milestonesHit.push(mark);
      if(mark === 50 && !player.fiftyBallMark) player.fiftyBallMark = player.balls;
      if(mark === 100 && !player.centuryBallMark) player.centuryBallMark = player.balls;
      showCelebration(`Congratulations ${player.name}! ${mark} runs completed.`);
    }
  }
}

function showCelebration(text){
  clearTimeout(celebrationTimer);

  els.celebrationBanner.textContent = text;
  els.celebrationBanner.classList.remove("hidden");
  els.celebrationBanner.classList.remove("show");

  void els.celebrationBanner.offsetWidth;

  els.celebrationBanner.classList.add("show");

  celebrationTimer = setTimeout(() => {
    els.celebrationBanner.classList.remove("show");
    els.celebrationBanner.classList.add("hidden");
  }, 2400);
}

function resolveCompletedMatch(){
  const m = state.liveMatch;
  if(!m || m.matchResolved) return;
  m.matchResolved = true;

  if(m.inningsMode === "set-target"){
    const ai = simulateAIChase(m.score + 1, m.oversLimit);
    m.target = m.score + 1;
    m.aiChaseSummary = ai;
  }

  finishMatch();
  showMatchResult();
}

function handleWicket(){
  const m = state.liveMatch;
  if(m.nextBatterIndex < m.battingOrder.length){
    m.strikerIndex = m.nextBatterIndex;
    m.nextBatterIndex += 1;
  }
}

function swapStrike(){
  const m = state.liveMatch;
  [m.strikerIndex, m.nonStrikerIndex] = [m.nonStrikerIndex, m.strikerIndex];
}

function getPhase(){
  const m = state.liveMatch;
  const over = Math.floor(m.balls / 6) + 1;
  if(over <= Math.min(10, Math.floor(m.oversLimit * 0.2))) return "Powerplay";
  if(over >= Math.max(1, m.oversLimit - 5)) return "Death";
  return "Middle Overs";
}

function rotateBowlerByPhase(){
  const m = state.liveMatch;
  const phase = getPhase();

  if(phase === "Powerplay"){
    const preferred = m.bowlers
      .map((b, i) => ({ i, rating:b.rating, type:b.bowlingType }))
      .filter(x => x.type === "pace")
      .sort((a,b) => b.rating - a.rating);
    if(preferred.length){
      const pool = preferred.slice(0, Math.min(3, preferred.length));
      m.currentBowlerIndex = pool[(pool.findIndex(x => x.i === m.currentBowlerIndex) + 1 + pool.length) % pool.length].i;
      return;
    }
  }

  if(phase === "Middle Overs"){
    const preferred = m.bowlers
      .map((b, i) => ({ i, rating:b.rating, type:b.bowlingType }))
      .sort((a,b) => b.rating - a.rating);
    const pool = preferred.slice(0, Math.min(4, preferred.length));
    if(pool.length){
      m.currentBowlerIndex = pool[(pool.findIndex(x => x.i === m.currentBowlerIndex) + 1 + pool.length) % pool.length].i;
      return;
    }
  }

  if(phase === "Death"){
    const preferred = m.bowlers
      .map((b, i) => ({ i, rating:b.rating }))
      .sort((a,b) => b.rating - a.rating);
    const pool = preferred.slice(0, Math.min(3, preferred.length));
    if(pool.length){
      m.currentBowlerIndex = pool[(pool.findIndex(x => x.i === m.currentBowlerIndex) + 1 + pool.length) % pool.length].i;
      return;
    }
  }

  m.currentBowlerIndex = (m.currentBowlerIndex + 1) % m.bowlers.length;
}

function getCurrentBowler(){
  return state.liveMatch.bowlers[state.liveMatch.currentBowlerIndex];
}

function updateProbabilities(){
  const m = state.liveMatch;
  if(!m) return;

  const striker = m.battingOrder[m.strikerIndex];
  const bowler = getCurrentBowler();
  const conf = m.confidence;
  const phase = getPhase();
  let probs;

  if(conf <= 30) probs = {0:38,1:28,2:10,4:10,6:5,W:5,WD:2,NB:2};
  else if(conf <= 70) probs = {0:28,1:34,2:11,4:14,6:7,W:2,WD:2,NB:2};
  else probs = {0:19,1:34,2:14,4:18,6:9,W:2,WD:2,NB:2};

  const batterBoost = Math.floor((striker.rating - 80) / 4);
  probs[4] += Math.max(0, batterBoost);
  probs[1] += Math.max(0, Math.floor((striker.recentForm - 70) / 8));

  if(striker.battingType === "aggressor"){
    probs[6] += 2;
    probs[4] += 1;
    probs.W += 1;
  } else {
    probs[1] += 2;
    probs[2] += 1;
    probs[6] -= 1;
  }

  if(striker.preferredAgainst === bowler.bowlingType){
    probs[4] += 2;
    probs[6] += 1;
    probs[0] -= 1;
  } else {
    probs[0] += 2;
    probs.W += 1;
  }

  const bowlerImpact = Math.floor((bowler.rating - 80) / 5);
  probs[0] += Math.max(0, bowlerImpact);
  probs.W += Math.max(0, Math.floor((bowler.recentForm - 70) / 10));
  probs[4] -= Math.max(0, Math.floor(bowlerImpact / 2));
  probs[6] -= Math.max(0, Math.floor(bowlerImpact / 2));

  if(phase === "Powerplay"){
    probs[4] += 1;
    probs.W += 1;
  } else if(phase === "Middle Overs"){
    probs[1] += 2;
    probs[2] += 1;
  } else if(phase === "Death"){
    probs[4] += 2;
    probs[6] += 2;
    probs.W += 1;
  }

  const rrr = requiredRunRate();
  if(m.inningsMode === "chase"){
    if(rrr > 7.5){
      probs[4] += 3;
      probs[6] += 3;
      probs[1] -= 3;
      probs[0] += 1;
    }
    if(rrr > 9){
      probs[6] += 2;
      probs.W += 1;
    }
  }

  if(m.mode === "aggressive"){
    probs[4] += 4;
    probs[6] += 4;
    probs[1] -= 5;
    probs.W += 2;
  } else if(m.mode === "defensive"){
    probs[1] += 4;
    probs[2] += 2;
    probs[4] -= 3;
    probs[6] -= 3;
    probs.W -= 1;
    probs[0] += 1;
  }

  Object.keys(probs).forEach(k => {
    if(probs[k] < 0) probs[k] = 0;
  });

  normalizeProbs(probs);
  m.probabilities = probs;
}

function normalizeProbs(probs){
  const total = Object.values(probs).reduce((a,b) => a + b, 0);
  let sum = 0;
  Object.keys(probs).forEach(k => {
    probs[k] = Math.round((probs[k] / total) * 100);
    sum += probs[k];
  });
  probs[1] += 100 - sum;
}

function adjustConfidence(runs){
  const m = state.liveMatch;
  if(runs === 0) m.confidence -= 3;
  if(runs === 1) m.confidence += 2;
  if(runs === 2) m.confidence += 3;
  if(runs === 4) m.confidence += 4;
  if(runs === 6) m.confidence += 5;
  m.confidence = clamp(m.confidence, 0, 100);
}

function weightedPick(probabilities){
  let r = Math.random() * 100;
  let cum = 0;
  for(const [key, val] of Object.entries(probabilities)){
    cum += val;
    if(r <= cum) return key;
  }
  return "0";
}

function pushRecent(value){
  const m = state.liveMatch;
  m.recent.unshift(value);
  if(m.recent.length > 12) m.recent.pop();
}

function addCommentary(text){
  const m = state.liveMatch;
  m.commentary.unshift(text);
  if(m.commentary.length > 18) m.commentary.pop();
}

function simulateAIChase(target, oversLimit){
  const squad = getCurrentSquad();
  const bowlers = state.userXI
    .map(idx => squad[idx])
    .filter(p => p.role === "bowler" || p.role === "allrounder")
    .map(p => ({
      name:p.name,
      rating:p.rating,
      type:p.preferredAgainst,
      balls:0,
      runs:0,
      wickets:0
    }));

  const oppStrength = TEAM_STRENGTH[state.pendingFixture.teamB];
  let score = 0, wickets = 0, balls = 0;
  const overRuns = [];
  const wormPoints = [];
  let currentOver = 0;

  while(balls < oversLimit * 6 && wickets < 10 && score < target){
    const over = Math.floor(balls / 6) + 1;
    const phase = over <= Math.min(10, Math.floor(oversLimit * 0.2))
      ? "Powerplay"
      : (over >= oversLimit - 5 ? "Death" : "Middle");

    const bowlerPool = bowlers.sort((a,b) => b.rating - a.rating);
    const bowler = phase === "Death"
      ? bowlerPool[0]
      : (phase === "Powerplay" ? bowlerPool[Math.min(1, bowlerPool.length - 1)] : bowlerPool[Math.min(2, bowlerPool.length - 1)]);

    currentOver = 0;

    for(let i = 0; i < 6; i++){
      if(score >= target || wickets >= 10 || balls >= oversLimit * 6) break;
      balls++;
      bowler.balls++;

      const outcomePool = ["0","1","1","2","4","W"];
      if(oppStrength > 85) outcomePool.push("4","6");
      if(phase === "Death") outcomePool.push("4","6","W");
      if(phase === "Middle") outcomePool.push("1","2");

      const outcome = outcomePool[rand(0, outcomePool.length - 1)];

      if(outcome === "W"){
        wickets++;
        bowler.wickets++;
      } else {
        const runs = Number(outcome);
        score += runs;
        bowler.runs += runs;
        currentOver += runs;
      }
    }

    overRuns.push(currentOver);
    wormPoints.push(score);
  }

  const won = score >= target;
  return {
    target,
    score,
    wickets,
    balls,
    result: won
      ? `${TEAM_FULL[state.pendingFixture.teamB]} chased ${target} with ${10 - wickets} wickets left`
      : `${TEAM_FULL[state.userTeam]} defended by ${target - score - 1} runs`,
    won,
    battingCard: simulateAIBattingScorecard(state.pendingFixture.teamB, score, oversLimit),
    bowling: bowlers.map(b => ({
      name:b.name,
      overs: overString(b.balls),
      runs:b.runs,
      wickets:b.wickets,
      economy:b.balls ? ((b.runs / b.balls) * 6).toFixed(2) : "0.00"
    })),
    overRuns,
    wormPoints
  };
}

function finishMatch(){
  const m = state.liveMatch;
  const fixture = state.schedule[state.currentMatchIndex];

  let winner, loser, resultText;

  if(m.inningsMode === "chase"){
    const chased = m.score >= m.target;
    if(chased){
      winner = m.battingTeam;
      loser = m.bowlingTeam;
      resultText = `${TEAM_FULL[winner]} beat ${TEAM_FULL[loser]} by ${10 - m.wickets} wickets`;
      awardPoints(winner, loser, m.score, m.balls, m.target - 1, fixture.oversLimit * 6);
      setRealTalk("Cold work. Clean chase. Serious finishing.");
      state.profile.winStreak += 1;
    } else {
      winner = m.bowlingTeam;
      loser = m.battingTeam;
      const margin = m.target - m.score;
      resultText = `${TEAM_FULL[winner]} beat ${TEAM_FULL[loser]} by ${margin} runs`;
      awardPoints(winner, loser, m.target - 1, fixture.oversLimit * 6, m.score, m.balls);
      setRealTalk("That one slipped. Too many soft moments.");
      state.profile.winStreak = 0;
    }
  } else {
    const ai = m.aiChaseSummary;
    if(ai.won){
      winner = fixture.teamB;
      loser = state.userTeam;
      resultText = `${TEAM_FULL[winner]} beat ${TEAM_FULL[loser]} by ${10 - ai.wickets} wickets`;
      awardPoints(winner, loser, ai.score, ai.balls, m.score, m.balls);
      setRealTalk("The AI hunted your total down. Needed more scoreboard pressure.");
      state.profile.winStreak = 0;
    } else {
      winner = state.userTeam;
      loser = fixture.teamB;
      resultText = `${TEAM_FULL[winner]} beat ${TEAM_FULL[loser]} by ${m.score - ai.score} runs`;
      awardPoints(winner, loser, m.score, m.balls, ai.score, ai.balls);
      setRealTalk("That’s a proper defend. Built it, protected it, closed it.");
      state.profile.winStreak += 1;
    }
  }

  const pom = computePlayerOfMatch(m);
  m.playerOfMatch = pom;

  const pomKey = `${state.userTeam}_${pom.name}`;
  if(state.playerTournamentStats[pomKey]){
    state.playerTournamentStats[pomKey].awards += 1;
  }

  fixture.played = true;
  fixture.winner = winner;
  fixture.resultText = resultText;
  fixture.stats = buildMatchStatsObject(fixture, m);

  updateTournamentStatsFromMatch(m);
  renderMostRuns();
  renderCareerRecords();

  state.matchHistory.push(fixture.stats);

  addCommentary(`Result: ${resultText}`);
  renderSchedule();
  renderPointsTable();
  renderProfile();
  saveGameSilently();
}

function computePlayerOfMatch(match){
  const sorted = [...match.battingOrder].sort((a,b) => {
    const sA = a.runs + a.fours * 1.5 + a.sixes * 2.5 - (a.out ? 3 : 0);
    const sB = b.runs + b.fours * 1.5 + b.sixes * 2.5 - (b.out ? 3 : 0);
    return sB - sA;
  });
  return sorted[0];
}

function buildMatchStatsObject(fixture, match){
  return {
    id: fixture.id || `${fixture.stage}_${Date.now()}`,
    stage: fixture.stage,
    fixture: `${TEAM_FULL[fixture.teamA]} vs ${TEAM_FULL[fixture.teamB]}`,
    result: fixture.resultText,
    target: match.inningsMode === "chase" ? match.target : match.score + 1,
    score: `${match.score}/${match.wickets}`,
    overs: overString(match.balls),
    extras: match.extras,
    playerOfMatch: match.playerOfMatch ? `${match.playerOfMatch.name} (${match.playerOfMatch.runs})` : "-",
    inningsMode: match.inningsMode,
    scorecard: match.battingOrder.map(p => ({
      name:p.name,
      status:p.out ? p.dismissal : ((p === match.battingOrder[match.strikerIndex] || p === match.battingOrder[match.nonStrikerIndex]) ? "not out" : ""),
      runs:p.runs,
      balls:p.balls,
      strikeRate:p.balls ? ((p.runs / p.balls) * 100).toFixed(1) : "0.0",
      fours:p.fours,
      sixes:p.sixes
    })),
    bowling: match.bowlers.map(b => ({
      name:b.name,
      overs: overString(b.balls),
      runs:b.runs,
      wickets:b.wickets,
      wides:b.wides,
      noballs:b.noballs,
      economy:b.balls ? ((b.runs / b.balls) * 6).toFixed(2) : "0.00"
    })),
    wickets: match.wicketEvents,
    partnerships: match.partnerships,
    overRuns: match.overRuns,
    wormPoints: match.wormPoints,
    aiChaseSummary: match.aiChaseSummary
  };
}

function updateTournamentStatsFromMatch(match){
  match.battingOrder.forEach(p => {
    const key = `${state.userTeam}_${p.name}`;
    const t = state.playerTournamentStats[key];
    if(!t) return;

    t.matches += 1;
    t.runs += p.runs;
    t.balls += p.balls;
    if(p.out) t.outCount += 1;
    if(p.runs >= 50 && p.runs < 100) t.fifties += 1;
    if(p.runs >= 100) t.hundreds += 1;
    if(p.fiftyBallMark && (t.fastestFiftyBalls === null || p.fiftyBallMark < t.fastestFiftyBalls)){
      t.fastestFiftyBalls = p.fiftyBallMark;
    }
    if(p.centuryBallMark && (t.fastestCenturyBalls === null || p.centuryBallMark < t.fastestCenturyBalls)){
      t.fastestCenturyBalls = p.centuryBallMark;
    }
  });

  if(state.pendingFixture?.firstInningsBattingCard){
    updateTournamentStatsFromAIScorecard(state.pendingFixture.firstInningsBattingCard);
  }

  if(match.aiChaseSummary?.battingCard){
    updateTournamentStatsFromAIScorecard(match.aiChaseSummary.battingCard);
  }
}

function renderMostRuns(){
  const rows = Object.values(state.playerTournamentStats)
    .sort((a,b) => b.runs - a.runs)
    .slice(0,5)
    .map(p => {
      const avg = p.outCount ? (p.runs / p.outCount).toFixed(2) : p.runs.toFixed(2);
      return `<tr><td>${p.name}</td><td>${p.team}</td><td>${p.matches}</td><td>${p.runs}</td><td>${avg}</td></tr>`;
    }).join("");

  els.mostRunsBox.innerHTML = `
    <table>
      <thead><tr><th>Player</th><th>Team</th><th>M</th><th>Runs</th><th>Avg</th></tr></thead>
      <tbody>${rows || `<tr><td colspan="5">No runs yet.</td></tr>`}</tbody>
    </table>
  `;
}

function renderCareerRecords(){
  if(!els.careerRecordsBox) return;

  const teamStats = Object.values(state.playerTournamentStats).filter(p => p.team === state.userTeam);

  if(!teamStats.length){
    els.careerRecordsBox.innerHTML = `<div class="muted">No career records yet.</div>`;
    return;
  }

  const topFifties = [...teamStats].sort((a,b) => b.fifties - a.fifties || b.runs - a.runs)[0];
  const topHundreds = [...teamStats].sort((a,b) => b.hundreds - a.hundreds || b.runs - a.runs)[0];
  const fastestFifty = teamStats
    .filter(p => p.fastestFiftyBalls !== null)
    .sort((a,b) => a.fastestFiftyBalls - b.fastestFiftyBalls || b.runs - a.runs)[0];
  const fastestCentury = teamStats
    .filter(p => p.fastestCenturyBalls !== null)
    .sort((a,b) => a.fastestCenturyBalls - b.fastestCenturyBalls || b.runs - a.runs)[0];

  const recordRow = (label, value) => `<tr><td>${label}</td><td>${value}</td></tr>`;

  els.careerRecordsBox.innerHTML = `
    <table>
      <tbody>
        ${recordRow("Most Fifties", topFifties && topFifties.fifties > 0 ? `${topFifties.name} - ${topFifties.fifties}` : "No fifty yet")}
        ${recordRow("Most Centuries", topHundreds && topHundreds.hundreds > 0 ? `${topHundreds.name} - ${topHundreds.hundreds}` : "No century yet")}
        ${recordRow("Fastest Fifty", fastestFifty ? `${fastestFifty.name} - ${fastestFifty.fastestFiftyBalls} balls` : "No fifty yet")}
        ${recordRow("Fastest Century", fastestCentury ? `${fastestCentury.name} - ${fastestCentury.fastestCenturyBalls} balls` : "No century yet")}
      </tbody>
    </table>
  `;
}

function showMatchResult(){
  const m = state.liveMatch;
  els.liveScreen.classList.add("hidden");
  els.resultScreen.classList.remove("hidden");

  const current = state.schedule[state.currentMatchIndex];
  els.resultTitle.textContent = current.resultText;
  els.resultRewards.innerHTML = `
    <div class="result-box"><strong>Rewards</strong><br>Total XP: ${state.profile.xp}<br>Total Coins: ${state.profile.coins}<br>Win streak: ${state.profile.winStreak}</div>
  `;

  let extraText = "";
  if(m.aiChaseSummary){
    extraText = `<br>AI chase: ${m.aiChaseSummary.score}/${m.aiChaseSummary.wickets} in ${overString(m.aiChaseSummary.balls)}`;
  }

  els.resultPerformance.innerHTML = `
    <div class="result-box"><strong>Performance</strong><br>Top scorer: ${m.playerOfMatch.name} - ${m.playerOfMatch.runs}<br>Player of the Match: 🏅 ${m.playerOfMatch.name}<br>Extras earned: ${m.extras}${extraText}</div>
  `;
}

function continueAfterResult(){
  els.resultScreen.classList.add("hidden");
  advanceTournament();
}

function setRealTalk(text){
  els.realTalkBox.textContent = text;
}

function awardPoints(winner, loser, winnerRuns, winnerBalls, loserRuns, loserBalls){
  const w = state.points[winner];
  const l = state.points[loser];

  w.played += 1;
  w.won += 1;
  w.points += 2;
  w.runsFor += winnerRuns;
  w.ballsFor += winnerBalls;
  w.runsAgainst += loserRuns;
  w.ballsAgainst += loserBalls;

  l.played += 1;
  l.lost += 1;
  l.runsFor += loserRuns;
  l.ballsFor += loserBalls;
  l.runsAgainst += winnerRuns;
  l.ballsAgainst += winnerBalls;

  updateNRR(winner);
  updateNRR(loser);
}

function updateNRR(team){
  const p = state.points[team];
  const oversFor = p.ballsFor / 6;
  const oversAgainst = p.ballsAgainst / 6;
  const rrFor = oversFor > 0 ? p.runsFor / oversFor : 0;
  const rrAgainst = oversAgainst > 0 ? p.runsAgainst / oversAgainst : 0;
  p.nrr = Number((rrFor - rrAgainst).toFixed(3));
}

function renderLiveMatch(){
  const m = state.liveMatch;
  if(!m) return;

  const ballsLeft = Math.max(m.oversLimit * 6 - m.balls, 0);

  els.scoreMain.textContent = `${m.score}/${m.wickets}`;
  els.oversMain.textContent = overString(m.balls);
  els.phaseBadge.textContent = getPhase();
  els.confidenceValue.textContent = m.confidence;
  els.confidenceLabel.textContent = confidenceText(m.confidence);

  if(m.inningsMode === "chase"){
    els.dynamicLabelA.textContent = "Runs Needed";
    els.runsNeeded.textContent = Math.max(m.target - m.score, 0);
    els.targetLine.textContent = `Target: ${m.target} runs in ${m.oversLimit} overs`;
  } else {
    els.dynamicLabelA.textContent = "Projected";
    const proj = m.balls > 0 ? Math.round((m.score / m.balls) * (m.oversLimit * 6)) : 0;
    els.runsNeeded.textContent = proj;
    els.targetLine.textContent = `Bat first • ${m.oversLimit} overs`;
  }

  els.ballsLeft.textContent = ballsLeft;

  updateConfidenceRing(m.confidence);
  renderBatters();
  renderBowler();
  renderProbBars();
  renderRecentBalls();
  renderCommentary();
  renderScorecard();
  renderBowlingScorecard();
  renderFallOfWickets();
  renderPartnerships();
  renderManhattanChart();
  renderWormChart();
}

function renderBatters(){
  const m = state.liveMatch;
  const striker = m.battingOrder[m.strikerIndex];
  const nonStriker = m.battingOrder[m.nonStrikerIndex];
  els.battersBox.innerHTML = `${renderPerson(striker, true)}${renderPerson(nonStriker, false)}`;
}

function renderPerson(player, striker){
  return `
    <div class="person-card">
      <div class="avatar">${getInitials(player.name)}</div>
      <div>
        <div class="person-name">${player.name}${striker ? " *" : ""}</div>
        <div class="person-meta">
          ${player.runs} (${player.balls}) • SR: ${player.balls ? ((player.runs / player.balls) * 100).toFixed(1) : "0.0"}<br>
          4s: ${player.fours} • 6s: ${player.sixes} • RTG ${player.rating}
        </div>
      </div>
    </div>
  `;
}

function renderBowler(){
  const bowler = getCurrentBowler();
  els.bowlerBox.innerHTML = `
    <div class="person-card">
      <div class="avatar">${getInitials(bowler.name)}</div>
      <div>
        <div class="person-name">${bowler.name}</div>
        <div class="person-meta">
          Type: ${bowler.bowlingType}<br>
          O: ${overString(bowler.balls)} • R: ${bowler.runs} • W: ${bowler.wickets}<br>
          Phase: ${getPhase()}
        </div>
      </div>
    </div>
  `;
}

function getInitials(name){
  return name.split(" ").map(x => x[0]).slice(0, 2).join("");
}

function renderProbBars(){
  const p = state.liveMatch.probabilities;
  const order = ["0","1","2","4","6","W","WD","NB"];
  els.probBars.innerHTML = order.map(key => `
    <div class="prob-row">
      <div><strong>${key}</strong></div>
      <div class="prob-track"><div class="prob-fill" style="width:${p[key] || 0}%"></div></div>
      <div>${p[key] || 0}%</div>
    </div>
  `).join("");
}

function renderRecentBalls(){
  const balls = state.liveMatch.recent;
  els.recentBalls.innerHTML = balls.map(b => {
    let cls = "";
    if(b === "W") cls = "wicket";
    else if(b === "Wd" || b === "Nb") cls = "extra";
    else if(Number(b) >= 4) cls = "boundary";
    else if(Number(b) === 0) cls = "dot";
    return `<div class="ball ${cls}">${b}</div>`;
  }).join("");
}

function renderCommentary(){
  els.commentaryBox.innerHTML = state.liveMatch.commentary.map(line => `<div class="comment-line">${line}</div>`).join("");
}

function renderScorecard(){
  const m = state.liveMatch;
  const rows = m.battingOrder.map(p => {
    const striker = m.battingOrder[m.strikerIndex];
    const nonStriker = m.battingOrder[m.nonStrikerIndex];
    let status = "";
    if(p.out) status = p.dismissal;
    else if(p === striker || p === nonStriker) status = "not out";
    const sr = p.balls ? ((p.runs / p.balls) * 100).toFixed(1) : "0.0";
    return `<tr><td>${p.name}</td><td>${status}</td><td>${p.runs}</td><td>${p.balls}</td><td>${sr}</td><td>${p.fours}</td><td>${p.sixes}</td></tr>`;
  }).join("");

  els.scorecardBox.innerHTML = `
    <table>
      <thead><tr><th>Batter</th><th>Status</th><th>R</th><th>B</th><th>SR</th><th>4s</th><th>6s</th></tr></thead>
      <tbody>${rows}</tbody>
    </table>
  `;
}

function renderBowlingScorecard(){
  const rows = state.liveMatch.bowlers.map(b => {
    const eco = b.balls ? ((b.runs / b.balls) * 6).toFixed(2) : "0.00";
    return `<tr><td>${b.name}</td><td>${overString(b.balls)}</td><td>${b.runs}</td><td>${b.wickets}</td><td>${b.wides}</td><td>${b.noballs}</td><td>${eco}</td></tr>`;
  }).join("");

  els.bowlingScorecardBox.innerHTML = `
    <table>
      <thead><tr><th>Bowler</th><th>O</th><th>R</th><th>W</th><th>Wd</th><th>Nb</th><th>Econ</th></tr></thead>
      <tbody>${rows}</tbody>
    </table>
  `;
}

function renderFallOfWickets(){
  const list = state.liveMatch.wicketEvents;
  if(!list.length){
    els.fallOfWicketsBox.innerHTML = "No wickets yet.";
    return;
  }
  els.fallOfWicketsBox.innerHTML = list.map(w => `${w.wicketNo}-${w.score} (${w.batter}, ${w.over})`).join("<br>");
}

function renderPartnerships(){
  const items = [...state.liveMatch.partnerships];
  const current = state.liveMatch.currentPartnership;
  if(current.batters && (current.runs > 0 || current.balls > 0)){
    items.push({ ...current, live: true });
  }

  if(!items.length){
    els.partnershipsBox.innerHTML = `<div class="muted">No partnership data yet.</div>`;
    return;
  }

  const rows = items.map(p => {
    const rr = p.balls ? ((p.runs / p.balls) * 6).toFixed(2) : "0.00";
    return `<tr><td>${p.batters}${p.live ? " *" : ""}</td><td>${p.runs}</td><td>${p.balls}</td><td>${rr}</td></tr>`;
  }).join("");

  els.partnershipsBox.innerHTML = `
    <table>
      <thead><tr><th>Pair</th><th>Runs</th><th>Balls</th><th>Rate</th></tr></thead>
      <tbody>${rows}</tbody>
    </table>
  `;
}

function applyCompactChartLayout(container, count){
  const columns = Math.max(count, 1);
  container.style.display = "grid";
  container.style.gridTemplateColumns = `repeat(${columns}, minmax(0, 1fr))`;
  container.style.alignItems = "end";
  container.style.width = "100%";
  container.style.maxWidth = "100%";
  container.style.overflow = "hidden";
}

function renderManhattanChart(){
  const overs = state.liveMatch.overRuns;
  if(!overs.length){
    els.manhattanChart.innerHTML = `<div class="muted">No overs completed yet.</div>`;
    return;
  }

  applyCompactChartLayout(els.manhattanChart, overs.length);

  const max = Math.max(...overs, 1);
  els.manhattanChart.innerHTML = overs.map((r, i) => {
    const h = Math.max(8, (r / max) * 120);
    return `<div class="chart-bar-wrap"><div class="chart-bar" style="height:${h}px"></div><div class="chart-label">${i + 1}</div></div>`;
  }).join("");
}

function renderWormChart(){
  const points = state.liveMatch.wormPoints;
  if(!points.length){
    els.wormChart.innerHTML = `<div class="muted">No worm points yet.</div>`;
    return;
  }

  applyCompactChartLayout(els.wormChart, points.length);

  const max = Math.max(...points, 1);
  els.wormChart.innerHTML = points.map((r, i) => {
    const h = Math.max(10, (r / max) * 120);
    return `<div class="worm-point-wrap"><div class="worm-point" style="margin-bottom:${h}px"></div><div class="chart-label">${i + 1}</div></div>`;
  }).join("");
}

function updateConfidenceRing(value){
  let color = "#39c8ff";
  if(value <= 30) color = "#ff6d6d";
  else if(value > 70) color = "#59e49b";
  const deg = Math.round((value / 100) * 360);
  els.confidenceRing.style.background = `
    radial-gradient(circle at center, #0b1428 55%, transparent 56%),
    conic-gradient(${color} ${deg}deg, rgba(255,255,255,0.08) 0deg)
  `;
}

function renderSchedule(){
  if(state.schedule.length === 0){
    els.scheduleList.innerHTML = `<div class="muted">No matches yet.</div>`;
    return;
  }

  els.scheduleList.innerHTML = state.schedule.map((m, idx) => `
    <div class="schedule-item" data-index="${idx}">
      <strong>${TEAM_FLAGS[m.teamA]} ${TEAM_FULL[m.teamA]} vs ${TEAM_FLAGS[m.teamB]} ${TEAM_FULL[m.teamB]}</strong>
      <div class="muted">${m.stage} • ${m.played ? m.resultText : "Pending"}</div>
    </div>
  `).join("");

  els.scheduleList.querySelectorAll(".schedule-item").forEach(item => {
    item.addEventListener("click", () => {
      const i = Number(item.dataset.index);
      const match = state.schedule[i];
      if(match.played && match.stats){
        openMatchDetails(match.stats);
      } else {
        els.matchDetailsBox.innerHTML = "This match hasn't been played yet.";
      }
    });
  });
}

function openMatchDetails(stats){
  const battingRows = stats.scorecard.map(p => `<tr><td>${p.name}</td><td>${p.runs}</td><td>${p.balls}</td><td>${p.strikeRate}</td></tr>`).join("");
  const bowlRows = stats.bowling.map(b => `<tr><td>${b.name}</td><td>${b.overs}</td><td>${b.runs}</td><td>${b.wickets}</td><td>${b.economy}</td></tr>`).join("");
  const wicketText = stats.wickets.length ? stats.wickets.map(w => `${w.wicketNo}-${w.score} (${w.batter}, ${w.over})`).join("<br>") : "No wickets";
  const partRows = stats.partnerships.length ? stats.partnerships.map(p => `<tr><td>${p.batters}</td><td>${p.runs}</td><td>${p.balls}</td></tr>`).join("") : `<tr><td colspan="3">No data</td></tr>`;

  let aiBlock = "";
  if(stats.aiChaseSummary){
    const aiBowlRows = stats.aiChaseSummary.bowling.map(b => `<tr><td>${b.name}</td><td>${b.overs}</td><td>${b.runs}</td><td>${b.wickets}</td><td>${b.economy}</td></tr>`).join("");
    aiBlock = `
      <div style="margin-top:10px;"><strong>AI Chase Summary</strong><br>${stats.aiChaseSummary.result}</div>
      <div class="table-wrap" style="margin-top:10px;">
        <table>
          <thead><tr><th>Your Bowler</th><th>O</th><th>R</th><th>W</th><th>Econ</th></tr></thead>
          <tbody>${aiBowlRows}</tbody>
        </table>
      </div>
    `;
  }

  els.matchDetailsBox.innerHTML = `
    <strong>${stats.fixture}</strong><br>
    ${stats.result}<br>
    Score: ${stats.score} in ${stats.overs} overs<br>
    Target: ${stats.target}<br>
    Extras: ${stats.extras}<br>
    Player of the Match: 🏅 ${stats.playerOfMatch}
    <div class="table-wrap" style="margin-top:10px;">
      <table>
        <thead><tr><th>Batter</th><th>R</th><th>B</th><th>SR</th></tr></thead>
        <tbody>${battingRows}</tbody>
      </table>
    </div>
    <div class="table-wrap" style="margin-top:10px;">
      <table>
        <thead><tr><th>Bowler</th><th>O</th><th>R</th><th>W</th><th>Econ</th></tr></thead>
        <tbody>${bowlRows}</tbody>
      </table>
    </div>
    <div style="margin-top:10px;"><strong>Fall of Wickets</strong><br>${wicketText}</div>
    <div class="table-wrap" style="margin-top:10px;">
      <table>
        <thead><tr><th>Partnership</th><th>Runs</th><th>Balls</th></tr></thead>
        <tbody>${partRows}</tbody>
      </table>
    </div>
    ${aiBlock}
  `;
}

function renderPointsTable(){
  const rows = Object.values(state.points)
    .sort((a,b) => b.points - a.points || b.nrr - a.nrr)
    .map(row => `<tr class="${row.team === state.userTeam ? "highlight-row" : ""}"><td>${TEAM_FLAGS[row.team]} ${TEAM_FULL[row.team]}</td><td>${row.played}</td><td>${row.won}</td><td>${row.lost}</td><td>${row.points}</td><td>${row.nrr.toFixed(3)}</td></tr>`)
    .join("");

  els.pointsTable.innerHTML = `
    <table>
      <thead><tr><th>Team</th><th>P</th><th>W</th><th>L</th><th>Pts</th><th>NRR</th></tr></thead>
      <tbody>${rows}</tbody>
    </table>
  `;
}

function advanceTournament(){
  if(state.liveMatch) state.liveMatch = null;

  const fixture = state.schedule[state.currentMatchIndex];
  if(!fixture) return;

  if(fixture.stage !== "League Match"){
    handleKnockoutProgress(fixture);
    return;
  }

  if(state.otherLeagueRoundIndex < state.otherLeagueRounds.length){
    simulateOtherLeagueRound(state.otherLeagueRoundIndex);
    state.otherLeagueRoundIndex += 1;
  }

  renderMostRuns();
  renderPointsTable();

  state.currentMatchIndex += 1;
  if(state.currentMatchIndex < state.schedule.length){
    prepareMatch(state.schedule[state.currentMatchIndex]);
  } else {
    finishLeagueAndMoveToKnockouts();
  }
}

function simulateOtherLeagueRound(roundIndex){
  const round = state.otherLeagueRounds[roundIndex];
  if(!round) return;

  round.forEach(([a, b]) => {
    const target = generateTarget(a);
    const firstInningsScore = target - 1;
    const firstCard = simulateAIBattingScorecard(a, firstInningsScore, 50);
    const chase = autoChase(b, target);
    const secondCard = simulateAIBattingScorecard(b, chase.score, 50);

    updateTournamentStatsFromAIScorecard(firstCard);
    updateTournamentStatsFromAIScorecard(secondCard);

    if(chase.win) awardPoints(b, a, chase.score, chase.balls, target - 1, 300);
    else awardPoints(a, b, target - 1, 300, chase.score, chase.balls);
  });
}

function finishLeagueAndMoveToKnockouts(){
  renderMostRuns();
  renderCareerRecords();
  renderPointsTable();
  buildKnockouts();
  saveGameSilently();
}

function autoChase(teamCode, target){
  const strength = TEAM_STRENGTH[teamCode];
  let winChance = 0.35 + ((strength - 70) / 50);
  if(winChance > 0.82) winChance = 0.82;
  const win = Math.random() < winChance;
  if(win) return { win: true, score: target + rand(0,20), balls: rand(250,299) };
  return { win: false, score: Math.max(target - rand(5,55), 180), balls: rand(240,300) };
}

function buildKnockouts(){
  const sorted = Object.values(state.points).sort((a,b) => b.points - a.points || b.nrr - a.nrr);
  const top4 = sorted.slice(0, 4).map(t => t.team);

  state.knockout = {
    top4,
    semi1: { id:"semi1", stage:"Semi Final 1", teamA:top4[0], teamB:top4[3], winner:null, resultText:"", played:false, stats:null },
    semi2: { id:"semi2", stage:"Semi Final 2", teamA:top4[1], teamB:top4[2], winner:null, resultText:"", played:false, stats:null },
    final: null
  };

  if(!top4.includes(state.userTeam)){
    autoSimAllKnockouts();
    return;
  }

  const userSemi = [state.knockout.semi1, state.knockout.semi2].find(m => m.teamA === state.userTeam || m.teamB === state.userTeam);
  state.schedule.push(userSemi);
  state.currentMatchIndex = state.schedule.length - 1;
  prepareMatch(userSemi);
}

function handleKnockoutProgress(fixture){
  const userWon = fixture.winner === state.userTeam;

  if(fixture.stage.startsWith("Semi Final")){
    const otherSemiKey = fixture.stage === "Semi Final 1" ? "semi2" : "semi1";
    const currentSemiKey = fixture.stage === "Semi Final 1" ? "semi1" : "semi2";

    if(!state.knockout[otherSemiKey].winner){
      state.knockout[otherSemiKey] = simulateKnockout(state.knockout[otherSemiKey]);
    }

    state.knockout[currentSemiKey] = {
      ...state.knockout[currentSemiKey],
      winner: fixture.winner,
      resultText: fixture.resultText,
      played: true,
      stats: fixture.stats
    };

    if(userWon){
      const finalOpp = state.knockout[otherSemiKey].winner;
      const finalFixture = { id:"final", stage:"Final", teamA:state.userTeam, teamB:finalOpp, played:false, resultText:"", winner:null, stats:null };
      state.knockout.final = finalFixture;
      state.schedule.push(finalFixture);
      state.currentMatchIndex = state.schedule.length - 1;
      prepareMatch(finalFixture);
    } else {
      const finalSim = simulateKnockout({
        id:"final",
        stage:"Final",
        teamA:state.knockout.semi1.winner,
        teamB:state.knockout.semi2.winner
      });
      state.knockout.final = finalSim;
      state.tournamentWinner = finalSim.winner;
      maybeComputePlayerOfTournament();
      showTournamentWinner();
    }
  } else if(fixture.stage === "Final"){
    state.knockout.final = {
      ...state.knockout.final,
      winner: fixture.winner,
      resultText: fixture.resultText,
      played: true,
      stats: fixture.stats
    };
    state.tournamentWinner = fixture.winner;
    if(fixture.winner === state.userTeam){
      state.profile.trophies += 1;
      showCelebration("World Cup Trophy Unlocked! 🏆");
    }
    maybeComputePlayerOfTournament();
    showTournamentWinner();
  }

  saveGameSilently();
}

function maybeComputePlayerOfTournament(){
  const sorted = Object.values(state.playerTournamentStats)
    .sort((a,b) => (b.runs + b.awards * 20) - (a.runs + a.awards * 20));
  state.playerOfTournament = sorted[0] || null;
}

function autoSimAllKnockouts(){
  state.knockout.semi1 = simulateKnockout(state.knockout.semi1);
  state.knockout.semi2 = simulateKnockout(state.knockout.semi2);
  state.knockout.final = simulateKnockout({
    id:"final",
    stage:"Final",
    teamA:state.knockout.semi1.winner,
    teamB:state.knockout.semi2.winner
  });
  state.tournamentWinner = state.knockout.final.winner;
  showTournamentWinner();
  saveGameSilently();
}

function simulateKnockout(match){
  const a = match.teamA;
  const b = match.teamB;
  const chanceA = TEAM_STRENGTH[a] / (TEAM_STRENGTH[a] + TEAM_STRENGTH[b]);
  const aWins = Math.random() < chanceA;
  const winner = aWins ? a : b;
  const loser = aWins ? b : a;
  const margin = Math.random() < 0.5 ? `${rand(10,65)} runs` : `${rand(2,8)} wickets`;
  return { ...match, winner, resultText: `${TEAM_FULL[winner]} beat ${TEAM_FULL[loser]} by ${margin}`, played:true };
}

function buildCeremonyCaption(){
  if(state.tournamentWinner === state.userTeam){
    return "Your team lifts the World Cup trophy in front of a roaring crowd.";
  }
  return `${TEAM_FULL[state.tournamentWinner]} complete a world champion finish with a proper trophy lift moment.`;
}

function buildConfettiPieces(count = 28){
  const colors = ["#ffcf4f", "#39c8ff", "#ff4fd8", "#ffffff", "#59e49b"];
  return Array.from({ length: count }, (_, i) => {
    const left = rand(2, 98);
    const delay = (i * 0.08).toFixed(2);
    const duration = (2.6 + Math.random() * 1.8).toFixed(2);
    const color = colors[rand(0, colors.length - 1)];
    return `<span class="confetti-piece" style="left:${left}%;background:${color};animation-duration:${duration}s;animation-delay:${delay}s;"></span>`;
  }).join("");
}

function renderCeremonyStage(){
  if(!els.ceremonyStage) return;

  els.ceremonyStage.innerHTML = `
    <div class="ceremony-spotlight left"></div>
    <div class="ceremony-spotlight right"></div>
    <div class="ceremony-confetti">${buildConfettiPieces()}</div>
    <div class="ceremony-center">
      <div class="ceremony-badge">${TEAM_FLAGS[state.tournamentWinner]}</div>
      <div class="ceremony-trophy">🏆</div>
      <div class="ceremony-title">${TEAM_FULL[state.tournamentWinner]} Are World Champions</div>
      <div class="ceremony-subtitle">${buildCeremonyCaption()}</div>
    </div>
    <div class="ceremony-podium"></div>
  `;
}

function showTournamentWinner(){
  els.preMatchScreen.classList.add("hidden");
  els.inningsInfoScreen.classList.add("hidden");
  els.liveScreen.classList.add("hidden");
  els.resultScreen.classList.add("hidden");
  els.postScreen.classList.remove("hidden");

  els.winnerTitle.textContent = `Winner: ${TEAM_FLAGS[state.tournamentWinner]} ${TEAM_FULL[state.tournamentWinner]}`;
  renderCeremonyStage();

  const blocks = [];
  if(state.knockout?.semi1) blocks.push(`<div class="k-card"><strong>${state.knockout.semi1.stage}</strong><div class="muted">${TEAM_FLAGS[state.knockout.semi1.teamA]} ${TEAM_FULL[state.knockout.semi1.teamA]} vs ${TEAM_FLAGS[state.knockout.semi1.teamB]} ${TEAM_FULL[state.knockout.semi1.teamB]}</div><div>${state.knockout.semi1.resultText}</div></div>`);
  if(state.knockout?.semi2) blocks.push(`<div class="k-card"><strong>${state.knockout.semi2.stage}</strong><div class="muted">${TEAM_FLAGS[state.knockout.semi2.teamA]} ${TEAM_FULL[state.knockout.semi2.teamA]} vs ${TEAM_FLAGS[state.knockout.semi2.teamB]} ${TEAM_FULL[state.knockout.semi2.teamB]}</div><div>${state.knockout.semi2.resultText}</div></div>`);
  if(state.knockout?.final) blocks.push(`<div class="k-card"><strong>Final</strong><div class="muted">${TEAM_FLAGS[state.knockout.final.teamA]} ${TEAM_FULL[state.knockout.final.teamA]} vs ${TEAM_FLAGS[state.knockout.final.teamB]} ${TEAM_FULL[state.knockout.final.teamB]}</div><div>${state.knockout.final.resultText}</div></div>`);
  els.knockoutSummary.innerHTML = blocks.join("");

  els.trophyCabinet.innerHTML = `
    <div class="result-box">
      <strong>Trophy Cabinet</strong><br>
      Total trophies: ${state.profile.trophies}<br>
      ${state.tournamentWinner === state.userTeam ? "🏆 You won the World Cup." : "No World Cup trophy this time."}
    </div>
    <div class="result-box">
      <strong>Player of the Tournament</strong><br>
      ${state.playerOfTournament ? `⭐ ${state.playerOfTournament.name} (${state.playerOfTournament.team})<br>Runs: ${state.playerOfTournament.runs}<br>Awards: ${state.playerOfTournament.awards}` : "Not available."}
    </div>
  `;
}

function restartTournamentRun(){
  const savedProfile = { ...state.profile };
  const savedActiveProfile = state.activeProfile;
  const savedUnlockedLegendIds = [...state.unlockedLegendIds];
  const savedUserTeam = state.userTeam;

  Object.assign(state, createInitialState());
  state.profile = savedProfile;
  state.activeProfile = savedActiveProfile;
  state.unlockedLegendIds = savedUnlockedLegendIds;

  initPoints();
  buildTeamSelect();

  if(savedUserTeam){
    state.userTeam = savedUserTeam;
    els.teamSelect.value = savedUserTeam;
  }

  initTournamentStatsForTeam();
  state.userXI = [];
  state.lockedXI = false;
  renderSquad();
  renderPlayingXI();
  updateSelectedTeamCard();
  renderProfile();
  renderMostRuns();
  renderCareerRecords();
  renderPointsTable();
  renderSchedule();
  renderLegendsMarket();
  renderPreMatchCard();
  refreshSquadControls();
  saveGameSilently();
}

function saveGame(){
  if(!state.activeProfile){
    alert("Create or select a profile first.");
    return;
  }
  saveGameSilently();
  alert("Game saved for this profile.");
}

function saveGameSilently(){
  if(!state.activeProfile) return;

  const saveState = {
    ...state,
    activeProfile: state.activeProfile
  };

  localStorage.setItem(getProfileKey(state.activeProfile), JSON.stringify({ state: saveState }));
}

function loadGame(){
  if(!state.activeProfile){
    alert("Select a profile first.");
    return;
  }

  const raw = localStorage.getItem(getProfileKey(state.activeProfile));
  if(!raw){
    alert("No saved game found for this profile.");
    return;
  }

  try{
    const parsed = JSON.parse(raw);
    Object.assign(state, parsed.state);

    if(!Array.isArray(state.unlockedLegendIds)){
      state.unlockedLegendIds = [];
    }

    if(!state.profile || typeof state.profile !== "object"){
      state.profile = { coins: 0, xp: 0, winStreak: 0, trophies: 0 };
    }

    delete state.profile.level;
    state.activeProfile = localStorage.getItem(ACTIVE_PROFILE_KEY) || state.activeProfile;
    syncUIFromLoadedState();
    alert("Saved game loaded.");
  }catch{
    alert("Save file is broken.");
  }
}

function syncUIFromLoadedState(){
  els.teamSelect.value = state.userTeam || TEAM_NAMES[0];
  updateProfileUI();

  if(!Array.isArray(state.otherLeagueRounds) || state.otherLeagueRounds.length === 0){
    state.otherLeagueRounds = buildOtherLeagueRounds(state.userTeam);
  }

  if(typeof state.otherLeagueRoundIndex !== "number"){
    state.otherLeagueRoundIndex = 0;
  }

  updateSelectedTeamCard();
  renderSquad();
  renderPlayingXI();
  renderPointsTable();
  renderSchedule();
  renderProfile();
  renderMostRuns();
  renderCareerRecords();
  renderLegendsMarket();
  refreshSquadControls();

  if(state.tournamentWinner){
    showTournamentWinner();
    return;
  }

  if(state.liveMatch){
    els.preMatchScreen.classList.add("hidden");
    els.inningsInfoScreen.classList.add("hidden");
    els.resultScreen.classList.add("hidden");
    els.postScreen.classList.add("hidden");
    els.liveScreen.classList.remove("hidden");

    els.liveStage.textContent = state.liveMatch.stage;
    els.liveIndex.textContent = state.liveMatch.stage === "League Match" ? `${state.liveMatch.fixtureIndex} / 9` : state.liveMatch.stage;
    els.liveFixture.textContent = `${TEAM_FULL[state.liveMatch.battingTeam]} vs ${TEAM_FULL[state.liveMatch.bowlingTeam]}`;
    els.userMiniBadge.textContent = TEAM_FLAGS[state.userTeam];
    els.oppMiniBadge.textContent = TEAM_FLAGS[state.liveMatch.bowlingTeam];
    els.userMiniCode.textContent = state.userTeam;
    els.oppMiniCode.textContent = state.liveMatch.bowlingTeam;

    document.querySelectorAll(".mode-btn").forEach(btn => {
      btn.classList.toggle("active", btn.dataset.mode === state.liveMatch.mode);
    });

    renderLiveMatch();
    return;
  }

  if(state.pendingFixture){
    prepareLoadedPendingFixture();
    return;
  }

  renderPreMatchCard();
}

function prepareLoadedPendingFixture(){
  const fixture = state.pendingFixture;
  els.preMatchScreen.classList.add("hidden");
  els.liveScreen.classList.add("hidden");
  els.resultScreen.classList.add("hidden");
  els.postScreen.classList.add("hidden");
  els.inningsInfoScreen.classList.remove("hidden");

  els.inningsFixture.textContent = `${TEAM_FULL[fixture.teamA]} vs ${TEAM_FULL[fixture.teamB]}`;
  els.tossInfo.textContent = `${TEAM_FULL[fixture.tossWinner]} won the toss and chose to ${fixture.tossDecision} first.`;
  els.conditionsInfo.textContent = `${fixture.rain ? `Rain reduced match to ${fixture.oversLimit} overs. ` : "Full match conditions. "}${fixture.dew ? "Heavy dew expected later." : "Dry surface."}`;
  els.inningsSummary.innerHTML = `<strong>${TEAM_FULL[fixture.firstBatting]}</strong> projected first innings: <strong>${fixture.firstInningsScore}/8</strong><br>Overs: <strong>${fixture.oversLimit}</strong>`;
  if(fixture.firstBatting === state.userTeam){
    els.chaseBrief.innerHTML = `<strong>You bat first.</strong><br>Set a strong total in ${fixture.oversLimit} overs. AI will chase.`;
  } else {
    els.chaseBrief.innerHTML = `<strong>You chase.</strong><br>You need <strong>${fixture.target}</strong> in ${fixture.oversLimit} overs.`;
  }
}

function resetTournament(){
  if(!state.activeProfile){
    location.reload();
    return;
  }

  localStorage.removeItem(getProfileKey(state.activeProfile));
  location.reload();
}

function requiredRunRate(){
  const m = state.liveMatch;
  if(!m || m.inningsMode !== "chase") return 0;
  const runs = Math.max(m.target - m.score, 0);
  const balls = Math.max(m.oversLimit * 6 - m.balls, 1);
  return (runs / balls) * 6;
}

function overString(balls){
  return `${Math.floor(balls / 6)}.${balls % 6}`;
}

function confidenceText(value){
  if(value <= 30) return "Under Pressure";
  if(value <= 70) return "Settled";
  return "In The Zone";
}

function prettyRole(role){
  if(role === "batsman") return "Batsman";
  if(role === "bowler") return "Bowler";
  return "All-Rounder";
}

function clamp(v, min, max){
  return Math.max(min, Math.min(max, v));
}

function rand(min, max){
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
