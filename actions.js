function notify(msg, isErr=false) { S.notification = { msg, isErr }; render(); setTimeout(() => { S.notification = null; render(); }, 3500); }
function dbg(msg) { S.debugLog.unshift('[' + new Date().toLocaleTimeString() + '] ' + msg); if(S.debugLog.length > 50) S.debugLog.pop(); render(); }
function addChat(msg, type='player', color=null) { S.chatMessages.push({ msg, type, color, ts: Date.now() }); render(); }
function sendChat(msg) { addChat(S.myName + ': ' + msg, 'player', S.myColor); broadcast({ type:'CHAT', name:S.myName, msg, color:S.myColor }); }
function copyText(text) { navigator.clipboard.writeText(text).then(() => notify('✅ Đã copy!')); }

async function toggleVoice() {
    if (S.voiceActive) {
        if (mediaStream) { mediaStream.getTracks().forEach(t=>t.stop()); mediaStream=null; }
        S.voiceActive = false; notify('🔇 Mic đã tắt');
    } else {
        try { mediaStream = await navigator.mediaDevices.getUserMedia({ audio:true, video:false }); S.voiceActive = true; notify('🎙️ Mic đang hoạt động'); } 
        catch(e) { notify('❌ Không truy cập mic: ' + e.message, true); }
    }
    render();
}

function doVoteSkip() {
    S.voteSkipCounts++; const needed = Math.max(1, S.players.length || 1);
    notify(`⏭️ Đã vote skip (${S.voteSkipCounts}/${needed})`);
    if (S.voteSkipCounts >= needed) {
        if (S._runResultTimer) { clearInterval(S._runResultTimer); S._runResultTimer = null; }
        endRunResult();
    }
    render();
}

function switchFile(fn) {
    const ta = document.querySelector('#code-editor-area'); if (ta) files[S.currentFile].content = ta.value;
    Object.keys(S.fileActivePlayers).forEach(f => { S.fileActivePlayers[f] = (S.fileActivePlayers[f]||[]).filter(p => p.peerId !== (S.peerId||'local')); });
    if (!S.fileActivePlayers[fn]) S.fileActivePlayers[fn] = [];
    S.fileActivePlayers[fn].push({ peerId: S.peerId||'local', name: S.myName, color: S.myColor });
    S.currentFile = fn; render();
    broadcast({ type:'FILE_SWITCH', file: fn, peerId: S.peerId, name: S.myName, color: S.myColor });
}

function doCreateRoom() { /* Logic tạo room ... */ }
function prefillJoin(id) { S.modal = 'join'; render(); setTimeout(() => { document.getElementById('join-peer-id').value = id; }, 40); }
function quickGame() { notify('⚡ Quick game: Tạo phòng mới để thử...'); setTimeout(() => { S.modal='create'; render(); }, 600); }
function doExitRoom() { Object.values(S.connections).forEach(c => c.close()); S.connections={}; S.players=[]; S.isHost=false; S.roomId=null; S.phase='lobby'; S.modal=null; render(); }
