let S = {
    peer: null,
    peerId: null,
    peerStatus: 'connecting',
    connections: {},
    myName: 'Player',
    myColor: COLORS[0], // Lấy từ constants.js
    myAvatar: AVATARS[0],
    phase: 'lobby',
    isHost: false,
    roomId: null,
    roomName: '',
    maxPlayers: 5,
    players: [],
    modal: null,
    showChat: false,
    showMeetingChat: false,
    voiceActive: false,
    chatMessages: [],
    meetingChatMessages: [{from:'System',msg:'Meeting started!',color:'#858585'}],
    currentFile: 'main.game.js',
    tabsMinimized: false,
    showTerminal: false,
    terminalOutput: '',
    showMeeting: false,
    selectedVote: null,
    roundTime: 60,
    meetingTime: 30,
    notification: null,
    countdown: null,
    debugLog: [],
    
    // Role phase
    myRole: null,          
    vibeCoderPeerId: null, 
    roleTimer: null,       
    
    // Coding timer
    codingTimer: 300,      
    codingTimerRunning: false,
    showRunResult: false,
    runResultTimer: null,  
    runResultSecs: 15,
    voteSkipCounts: 0,     
    
    // File tracking
    fileActivePlayers: {},
    
    // Private intervals mapping
    _countdownTimer: null,
    _roleTimer: null,
    _codingTimerInterval: null,
    _runResultTimer: null
};

let mediaStream = null;
