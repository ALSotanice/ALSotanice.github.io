# Codreamong

Multiplayer coding game lấy cảm hứng từ Among Us và VS Code.

## Cấu trúc thư mục
- `index.html`: Shell ứng dụng.
- `style.css`: Các định dạng CSS tĩnh, keyframes.
- `js/constants.js`: Dữ liệu tĩnh như biến màu sắc, file code, các hằng số.
- `js/state.js`: Object `S` quản lý toàn bộ trạng thái của game.
- `js/network.js`: Tích hợp PeerJS, P2P network, WebRTC.
- `js/game.js`: Logic lõi của game (vòng đời, role, timer, auto run code).
- `js/actions.js`: File kết nối giữa UI events (onclick) và logic.
- `js/ui/`: Các file phụ trách trả về HTML (render function).
