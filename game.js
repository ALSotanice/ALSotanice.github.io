function doCountdown() {
    if (S._countdownTimer) { clearInterval(S._countdownTimer); S._countdownTimer = null; }
    S.countdown = 3; render();
    S._countdownTimer = setInterval(() => {
        S.countdown--; render();
        if (S.countdown <= 0) {
            clearInterval(S._countdownTimer); S._countdownTimer = null; S.countdown = null;
            startRolePhase();
        }
    }, 1000);
}

function startRolePhase() {
    if (S.isHost) {
        const playerList = S.players;
        const idx = Math.floor(Math.random() * playerList.length);
        const vibeCoderPeerId = playerList[idx].peerId;
        broadcast({ type: 'ROLE_ASSIGN', vibeCoderPeerId });
        applyRoles(vibeCoderPeerId);
    }
}

function applyRoles(vibeCoderPeerId) {
    S.vibeCoderPeerId = vibeCoderPeerId;
    S.myRole = (S.peerId === vibeCoderPeerId) ? 'vibecoder' : 'dev';
    S.phase = 'role'; S.roleTimer = 6;
    if (S._roleTimer) { clearInterval(S._roleTimer); S._roleTimer = null; }
    render();
    S._roleTimer = setInterval(() => {
        S.roleTimer--; render();
        if (S.roleTimer <= 0) {
            clearInterval(S._roleTimer); S._roleTimer = null; S.roleTimer = null;
            S.phase = 'coding'; S.codingTimer = 300; S.codingTimerRunning = false;
            S.fileActivePlayers = {}; S.fileActivePlayers[S.currentFile] = [{ peerId: S.peerId||'local', name: S.myName, color: S.myColor }];
            // Bắt đầu đếm ngược code timer ở đây...
            render();
        }
    }, 1000);
}

function autoRunAllCode() {
    let out = `> AUTO-RUN — Tất cả file (Timer hết)\n\n`;
    Object.keys(files).forEach(fn => {
        out += `── ${fn} (${files[fn].lang.toUpperCase()}) ──\n`;
        out += Math.random() < 0.25 ? `❌ Error: Compilation failed\n\n` : `✅ Compiled successfully!\n\n`;
    });
    out += `\nProcess exited. Code 0`;
    S.terminalOutput = out; S.showRunResult = true; S.runResultSecs = 15; S.voteSkipCounts = 0;
    
    if (S._runResultTimer) clearInterval(S._runResultTimer);
    S._runResultTimer = setInterval(() => {
        S.runResultSecs--; render();
        if (S.runResultSecs <= 0) {
            clearInterval(S._runResultTimer); S._runResultTimer = null; endRunResult();
        }
    }, 1000);
    render();
}

function endRunResult() {
    S.showRunResult = false; S.codingTimer = 300; S.voteSkipCounts = 0; render();
}
