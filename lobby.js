
    // ... Bê nguyên nội dung hàm renderLobby(), renderCreateModal(), renderJoinModal() từ file gốc ...
    function renderLobby() {
    const publicRooms = [
        { id:'123456', name:'Battle Royale #001', cur:3, max:5 },
        { id:'789012', name:'Code Duel #042',     cur:1, max:5 },
        { id:'345678', name:'Speed Code VIP',     cur:4, max:5 },
    ];

    const modal = S.modal === 'create' ? renderCreateModal()
                : S.modal === 'join'   ? renderJoinModal()
                : '';

    return `
    <div style="height:36px;background:#323233;display:flex;align-items:center;padding:0 12px;border-bottom:1px solid #1e1e1e;flex-shrink:0;gap:12px;">
        <div style="display:flex;gap:6px;">
            <div style="width:12px;height:12px;background:#ef4444;border-radius:50%;"></div>
            <div style="width:12px;height:12px;background:#f59e0b;border-radius:50%;"></div>
            <div style="width:12px;height:12px;background:#22c55e;border-radius:50%;"></div>
        </div>
        <span style="flex:1;text-align:center;font-size:12px;color:#cccccc;">🎮 CodeAmong — Multiplayer Coding Game</span>
        <div id="peer-status-bar" style="display:flex;align-items:center;gap:6px;"></div>
        <span style="font-size:11px;color:#858585;">${S.myName}</span>
    </div>

    <div style="display:flex;flex:1;overflow:hidden;">
        <div style="width:48px;background:#2d2d2e;display:flex;flex-direction:column;align-items:center;padding:8px 0;gap:16px;flex-shrink:0;">
            <div style="width:32px;height:32px;display:flex;align-items:center;justify-content:center;border-radius:8px;cursor:pointer;font-size:16px;" title="Lobby">🏠</div>
            <div style="width:32px;height:32px;display:flex;align-items:center;justify-content:center;border-radius:8px;cursor:pointer;font-size:16px;" title="Network">🌐</div>
        </div>

        <div style="width:220px;background:#252526;border-right:1px solid #1e1e1e;display:flex;flex-direction:column;flex-shrink:0;">
            <div style="padding:8px 12px;font-size:10px;color:#858585;text-transform:uppercase;letter-spacing:0.1em;border-bottom:1px solid #1e1e1e;">
                Phòng Công Khai
            </div>
            <div style="flex:1;overflow:auto;">
                ${publicRooms.map(r => `
                <div onclick="prefillJoin('${r.id}')" style="padding:10px 12px;font-size:11px;cursor:pointer;border-bottom:1px solid #1a1a1a;display:flex;justify-content:space-between;align-items:center;" 
                     onmouseover="this.style.background='#2d2d2e'" onmouseout="this.style.background='transparent'">
                    <div>
                        <div style="color:#cccccc;margin-bottom:2px;">${r.name}</div>
                        <div style="color:#555;font-size:9px;">ID: ${r.id}</div>
                    </div>
                    <div style="font-size:10px;padding:2px 6px;border-radius:6px;background:#1a3a1a;color:#22c55e;">${r.cur}/${r.max}</div>
                </div>`).join('')}
            </div>
            <div style="padding:8px;border-top:1px solid #1e1e1e;">
                <div style="font-size:9px;color:#555;margin-bottom:4px;">DEBUG LOG</div>
                <pre id="debug-log" style="font-size:8px;color:#444;max-height:80px;overflow:auto;margin:0;white-space:pre-wrap;word-break:break-all;">${S.debugLog.slice(0,12).join('\n')}</pre>
            </div>
        </div>

        <div style="flex:1;display:flex;overflow:hidden;">
            <div style="flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;background:#1e1e1e;padding:24px;">
                <div style="width:100%;max-width:340px;">
                    <div style="text-align:center;margin-bottom:32px;">
                        <div style="font-size:48px;margin-bottom:8px;">👾</div>
                        <div style="font-size:22px;font-weight:600;color:#007acc;margin-bottom:4px;">CodeAmong</div>
                        <div style="font-size:11px;color:#858585;">Multiplayer coding battle</div>
                    </div>

                    <div style="font-size:9px;color:#858585;text-transform:uppercase;letter-spacing:0.12em;margin-bottom:6px;padding:0 4px;">Start</div>
                    <div style="background:#252526;border:1px solid #2d2d2e;border-radius:10px;overflow:hidden;">
                        <div class="vscode-item" onclick="openModal('create')" style="border-bottom:1px solid #1e1e1e;">
                            <span style="color:#007acc;font-size:15px;width:20px;text-align:center;">➕</span>
                            <div>
                                <div style="font-size:13px;color:white;">Tạo phòng mới</div>
                                <div style="font-size:9px;color:#858585;">Create a new game room</div>
                            </div>
                        </div>
                        <div class="vscode-item" onclick="openModal('join')" style="border-bottom:1px solid #1e1e1e;">
                            <span style="color:#007acc;font-size:15px;width:20px;text-align:center;">🔑</span>
                            <div>
                                <div style="font-size:13px;color:white;">Tham gia phòng</div>
                                <div style="font-size:9px;color:#858585;">Enter Room ID to connect</div>
                            </div>
                        </div>
                    </div>

                    <div style="margin-top:16px;background:#252526;border:1px solid #2d2d2e;border-radius:10px;padding:12px;">
                        <div style="font-size:9px;color:#858585;margin-bottom:6px;">📡 Room ID / Peer ID của bạn</div>
                        ${S.peerId ? `
                        <div style="display:flex;align-items:center;gap:8px;">
                            <code style="font-size:18px;color:#22c55e;flex:1;word-break:break-all;line-height:1.4;letter-spacing:0.1em;text-align:center;">${S.peerId}</code>
                            <span class="copy-btn" onclick="copyText('${S.peerId}')">Copy</span>
                        </div>` : `
                        <div style="font-size:10px;color:#f59e0b;display:flex;align-items:center;gap:6px;">
                            <span class="peer-dot peer-wait"></span> Đang tạo ID phòng...
                        </div>`}
                    </div>
                </div>
            </div>

            <div style="width:220px;background:#252526;border-left:1px solid #1e1e1e;padding:16px;display:flex;flex-direction:column;flex-shrink:0;">
                <div style="font-size:9px;color:#858585;text-transform:uppercase;letter-spacing:0.1em;margin-bottom:12px;">Player Setup</div>
                
                <div style="margin-bottom:12px;">
                    <div style="font-size:10px;color:#858585;margin-bottom:4px;">Nickname</div>
                    <input type="text" id="my-name" value="${S.myName}" maxlength="16" placeholder="Your name"
                        onchange="S.myName=this.value;">
                </div>

                <div style="margin-bottom:16px;">
                    <div style="font-size:10px;color:#858585;margin-bottom:8px;">Màu sắc</div>
                    <div style="display:flex;gap:8px;flex-wrap:wrap;">
                        ${COLORS.map((c,i) => `
                        <div onclick="S.myColor='${c}';S.myAvatar='${AVATARS[i]}';render()"
                             style="width:28px;height:28px;border-radius:50%;background:${c};cursor:pointer;
                             border:2px solid ${S.myColor===c?'white':'transparent'};transition:border 0.1s;"></div>`).join('')}
                    </div>
                </div>

                <div style="background:#1e1e1e;border-radius:10px;padding:10px;margin-bottom:auto;">
                    <div style="font-size:9px;color:#555;margin-bottom:6px;">Preview</div>
                    <div class="player-row" style="background:#252526;">
                        <div style="width:32px;height:32px;border-radius:8px;background:${S.myColor};display:flex;align-items:center;justify-content:center;font-size:16px;">${S.myAvatar}</div>
                        <div style="font-size:12px;color:white;">${S.myName}</div>
                    </div>
                </div>

                <div style="margin-top:12px;font-size:9px;color:#333;">CodeAmong v3.0 · PeerJS WebRTC</div>
            </div>
        </div>
    </div>
    ${modal}`;


    return `
    <div onclick="if(event.target===this)closeModal()" style="position:fixed;inset:0;background:rgba(0,0,0,0.75);display:flex;align-items:center;justify-content:center;z-index:50;">
        <div class="modal-anim" style="background:#252526;border-radius:16px;padding:24px;width:380px;border:1px solid #3d3d3d;box-shadow:0 24px 60px #000a;">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;">
                <span style="font-size:15px;font-weight:600;color:white;">➕ Tạo Phòng Mới</span>
                <span onclick="closeModal()" style="cursor:pointer;color:#858585;font-size:18px;">✕</span>
            </div>
            <div style="display:flex;flex-direction:column;gap:12px;">
                <div>
                    <div style="font-size:10px;color:#858585;margin-bottom:4px;">Mã Phòng (Room ID)</div>
                    <div style="display:flex;gap:8px;">
                        <input type="text" id="cr-id" value="${S.peerId || 'Đang lấy...'}" style="text-align:center;font-size:18px;letter-spacing:0.12em;color:#22c55e;" readonly>
                    </div>
                </div>
                <div>
                    <div style="font-size:10px;color:#858585;margin-bottom:4px;">Tên phòng</div>
                    <input type="text" id="cr-name" placeholder="My Awesome Room" maxlength="30">
                </div>
                <div>
                    <div style="font-size:10px;color:#858585;margin-bottom:4px;">Số người tối đa (2–5)</div>
                    <input type="number" id="cr-max" value="5" min="2" max="5">
                </div>
                <div style="background:#1a2a1a;border:1px solid #22c55e30;border-radius:8px;padding:10px;font-size:10px;color:#22c55e;">
                    💡 Room ID của bạn gồm 6 chữ số. Hãy gửi ID này cho bạn bè để họ nhập vào và Join phòng.
                </div>
                <div style="display:flex;gap:10px;margin-top:4px;">
                    <button class="btn btn-gray" style="flex:1;" onclick="closeModal()">Hủy</button>
                    <button class="btn btn-blue" style="flex:1;" onclick="doCreateRoom()">✅ Tạo phòng</button>
                </div>
            </div>
        </div>
    </div>`;



    return `
    <div onclick="if(event.target===this)closeModal()" style="position:fixed;inset:0;background:rgba(0,0,0,0.75);display:flex;align-items:center;justify-content:center;z-index:50;">
        <div class="modal-anim" style="background:#252526;border-radius:16px;padding:24px;width:400px;border:1px solid #3d3d3d;box-shadow:0 24px 60px #000a;">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;">
                <span style="font-size:15px;font-weight:600;color:white;">🔑 Tham Gia Phòng</span>
                <span onclick="closeModal()" style="cursor:pointer;color:#858585;font-size:18px;">✕</span>
            </div>
            <div style="display:flex;flex-direction:column;gap:12px;">
                <div>
                    <div style="font-size:10px;color:#858585;margin-bottom:4px;">Room ID (6 chữ số)</div>
                    <input type="text" id="join-peer-id" placeholder="Ví dụ: 123456" style="font-size:14px;letter-spacing:0.1em;text-align:center;">
                </div>
                <div>
                    <div style="font-size:10px;color:#858585;margin-bottom:4px;">Nickname của bạn</div>
                    <input type="text" id="join-name" value="${S.myName}" maxlength="16">
                </div>
                <div style="background:#1a1a2a;border:1px solid #3b82f630;border-radius:8px;padding:10px;font-size:10px;color:#93c5fd;">
                    ℹ️ Kết nối WebRTC P2P trực tiếp — không cần server game.<br>
                    Hoạt động qua internet (khác mạng) nhờ TURN relay.
                </div>
                <div style="display:flex;gap:10px;margin-top:4px;">
                    <button class="btn btn-gray" style="flex:1;" onclick="closeModal()">Hủy</button>
                    <button class="btn btn-blue" style="flex:1;" onclick="doJoinRoom()">🚀 Kết Nối</button>
                </div>
            </div>
        </div>
    </div>`;
    
    return ``;
}
