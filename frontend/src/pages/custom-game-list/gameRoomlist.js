/**
 * 방 상태에 따른 스타일(테두리 색상과 텍스트 색상)을 반환합니다.
 * @param room {object} 게임 방의 정보
 * @returns {object} 스타일 정보를 담은 객체
 */
let getRoomStyle = (room) => {
  let borderColor = room.roomStatus === "대기중" ? "#08F6B0" : "#FF79C5";
  let textColor = borderColor; // 텍스트 색상을 테두리 색상과 동일하게 설정
  // HEX 색상에서 RGB 값으로 변환
  let r = parseInt(borderColor.substring(1, 3), 16);
  let g = parseInt(borderColor.substring(3, 5), 16);
  let b = parseInt(borderColor.substring(5, 7), 16);

  // RGBA 그림자 색상 생성
  let shadowColor = `rgba(${r}, ${g}, ${b}, 0.3)`; // 0.3은 투명도

  return { borderColor, textColor, shadowColor };
};

/**
 * 비밀방 여부에 따른 HTML 문자열을 반환합니다.
 * @param room {object} 게임 방의 정보
 * @returns {string} 비밀방 여부에 따른 HTML 문자열
 */
let getSecretRoomHTML = (room) => {
  return room.isSecret
    ? `<div class="game-room-list is-secret">
                <img class="game-room-list" src="${room.isSecret}" alt="is-secret">
             </div>`
    : "";
};

export default function gameRoomList(room) {
  let isSecretHTML = getSecretRoomHTML(room);
  let { borderColor, textColor, shadowColor } = getRoomStyle(room);

  return `
            <div class="game-room-list room-info" id="room-content" style="color: rgb(255, 255, 255); font-family: Galmuri11, serif; border: 1px solid ${borderColor}; box-shadow: 0 0 1rem 0.5rem ${shadowColor}; border-radius: 10px; width: 100%;">
                <div class="game-room-list column">
                    <div class="game-room-list game-mode">
                        <img class="game-room-list" id= "game-mode-image" src="${room.gameModeImage}" alt="game-mode">
                    </div>
                </div>
                <div class="game-room-list column">
                    <div class="game-room-list row">
                        <div class="game-room-list room-title">
                            ${room.roomTitle}
                        </div>
                        ${isSecretHTML}
                    </div>
                    <div class="game-room-list row">
                        <div class="game-room-list count-of-players">
                            ${room.countOfPlayers}
                        </div>
                        <div class="game-room-list game-mode-name">
                            ${room.gameMode}
                        </div>
                        <div class="game-room-list room-status" style="color: ${textColor};">
                            ${room.roomStatus}
                        </div>
                    </div>
                </div>
            </div>
        `;
}
