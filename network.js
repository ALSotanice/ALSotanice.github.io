function genId() { return Math.floor(100000 + Math.random() * 900000).toString(); }

function initPeer() {
    dbg('Initializing PeerJS...');
    updateStatus('connecting');
    const numericId = genId(); 

    const peer = new Peer(numericId, {
        host: '0.peerjs.com', port: 443, path: '/', secure: true, debug: 1,
        config: {
            iceServers: [
                { urls: 'stun:stun.l.google.com:19302' },
                { urls: 'stun:stun1.l.google.com:19302' },
                { urls: 'stun:stun2.l.google.com:19302' },
                { urls: 'turn:openrelay.metered.ca:80',   username: 'openrelayproject', credential: 'openrelayproject' },
                { urls: 'turn:openrelay.metered.ca:443',  username: 'openrelayproject', credential: 'openrelayproject' },
                { urls: 'turn:openrelay.metered.ca:443?transport=tcp', username: 'openrelayproject', credential: 'openrelayproject' },
            ]
        }
    });

    S.peer = peer;

    peer.on('open', id => {
        S.peerId = id; updateStatus('ready');
        dbg('✅ Peer ready. ID = ' + id); render();
    });

    peer.on('connection', conn => { dbg('📥 Incoming connection: ' + conn.peer); setupConn(conn); });

    peer.on('error', err => {
        dbg('❌ Peer error: ' + err.type + ' — ' + err.message);
        if (err.type === 'peer-unavailable') { notify('❌ Không tìm thấy phòng. Kiểm tra lại Room ID.', true); }
        else if (err.type === 'network' || err.type === 'server-error') { notify('⚠️ Mất kết nối. Thử reload trang.', true); updateStatus('error'); }
        else { notify('⚠️ ' + err.type, true); }
        render();
    });

    peer.on('disconnected', () => {
        dbg('⚠️ Disconnected. Reconnecting...'); updateStatus('connecting');
        setTimeout(() => { if (!S.peer.destroyed) S.peer.reconnect(); }, 2000);
    });
}

function updateStatus(s) { S.peerStatus = s; renderStatusBar(); }

function setupConn(conn) {
    conn.on('data', data => { dbg('📨 Received: ' + data.type + ' from ' + conn.peer); handleMsg(data, conn.peer); });
    conn.on('close', () => {
        dbg('🔌 Connection closed: ' + conn.peer);
        delete S.connections[conn.peer];
        S.players = S.players.filter(p => p.peerId !== conn.peer);
        if (S.isHost) broadcast({ type:'PLAYERS_UPDATE', players: S.players });
        addChat('🔴 Một người chơi đã rời phòng', 'system');
        render();
    });
    conn.on('error', e => dbg('Conn error: ' + e));

    const initOpen = () => { dbg('🔗 Connection open: ' + conn.peer); S.connections[conn.peer] = conn; };
    if (conn.open) initOpen(); else conn.on('open', initOpen);
}

function connectToPeer(targetId, onOpen) {
    if (!S.peer || S.peer.destroyed) { notify('❌ Peer chưa sẵn sàng!', true); return; }
    if (S.peerStatus !== 'ready') { notify('❌ Chờ kết nối mạng xong đã!', true); return; }
    const conn = S.peer.connect(targetId, { reliable: true, serialization: 'json' });
    setupConn(conn);
    conn.on('open', () => onOpen(conn));
    conn.on('error', e => notify('❌ Không thể kết nối: ' + e, true));
    setTimeout(() => { if (!conn.open) notify('❌ Timeout. Phòng không phản hồi.', true); }, 8000);
}

function send(peerId, data) { const c = S.connections[peerId]; if (c && c.open) { c.send(data); } }
function broadcast(data) { Object.keys(S.connections).forEach(id => send(id, data)); }

function handleMsg(data, fromPeer) {
    switch(data.type) {
        case 'JOIN_REQUEST':
            if (!S.isHost) return;
            if (S.players.length >= S.maxPlayers) { send(fromPeer, { type:'JOIN_DENIED', reason:'Phòng đầy!' }); return; }
            const p = { peerId:fromPeer, name:data.name, color:data.color, avatar:data.avatar, isHost:false, readyVote:false };
            S.players.push(p);
            send(fromPeer, { type:'JOIN_ACCEPTED', players:S.players, roomName:S.roomName, maxPlayers:S.maxPlayers, roomId:S.roomId });
            broadcast({ type:'PLAYERS_UPDATE', players:S.players });
            addChat('🟢 ' + data.name + ' đã vào phòng', 'system');
            render(); break;
        case 'JOIN_ACCEPTED':
            S.players = data.players; S.roomName = data.roomName; S.maxPlayers = data.maxPlayers; S.roomId = data.roomId;
            S.phase = 'waiting'; notify('✅ Đã vào phòng: ' + data.roomName); render(); break;
        case 'JOIN_DENIED': notify('❌ Từ chối: ' + data.reason, true); break;
        case 'PLAYERS_UPDATE': S.players = data.players; render(); break;
        case 'CHAT': addChat(data.name + ': ' + data.msg, 'player', data.color); break;
        case 'START_COUNTDOWN': doCountdown(); break;
        case 'SETTINGS_UPDATE': S.roundTime = data.roundTime; S.meetingTime = data.meetingTime; render(); break;
        case 'ROLE_ASSIGN': applyRoles(data.vibeCoderPeerId); break;
        case 'FILE_SWITCH':
            if (!S.fileActivePlayers) S.fileActivePlayers = {};
            Object.keys(S.fileActivePlayers).forEach(f => { S.fileActivePlayers[f] = (S.fileActivePlayers[f]||[]).filter(p => p.peerId !== data.peerId); });
            if (!S.fileActivePlayers[data.file]) S.fileActivePlayers[data.file] = [];
            S.fileActivePlayers[data.file].push({ peerId: data.peerId, name: data.name, color: data.color });
            render(); // Cập nhật Explorer UI
            break;
        case 'VOTE_REQUEST':
            if (!S.isHost) return;
            S.players = S.players.map(p => p.peerId === fromPeer ? {...p, readyVote:true} : p);
            broadcast({ type:'PLAYERS_UPDATE', players:S.players });
            const votes = S.players.filter(p => p.readyVote).length;
            const needed = Math.ceil(S.players.length * 0.8);
            if (votes >= needed && S.players.length >= 2) { broadcast({ type:'START_COUNTDOWN' }); doCountdown(); }
            render(); break;
    }
}
