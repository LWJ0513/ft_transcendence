import { click } from "../../utils/clickEvent.js";
import { importCss } from "../../utils/importCss.js";
import roomCreateModal from "./room-create-modal.js";
import { hoverToggle } from "../../utils/hoverEvent.js";
import passwordModal from "./password-modal.js";
import useState from "../../utils/useState.js";
import gameRoomList from "./gameRoomlist.js";

export default function CustomGameList($container) {
  const init = () => {
    renderLayout();
    this.renderGameRoomList();
  };

  const renderLayout = () => {
    importCss("../../../assets/css/customGameList.css");

    $container.innerHTML = `
            <div class="custom-game-list" id="content-wrapper">
                <div class="custom-game-list" id="game-room-list-wrapper">
									<div class="game-room-list" id="list-wrapper"></div>
                </div>
                <div class="custom-game-list" id="pagination-arrow-wrapper">
                    <div class="custom-game-list" id="pagination-arrow-left" style="color: rgb(255, 255, 255); font-family: Galmuri11, serif;">
                        <
                    </div>
                    <div class="custom-game-list" id="pagination-arrow-right" style="color: rgb(255, 255, 255); font-family: Galmuri11, serif;" role="button" >
                        >
                    </div>
                </div>
            </div>
            <footer class="custom-game-list" id="game-room-options-wrapper">
              <div class="custom-game-list" id="quick-join" style="color: rgb(255, 255, 255); font-family: Galmuri11, serif;">신속히 입장</div>
              <div class="custom-game-list" id="create-room" style="color: rgb(255, 255, 255); font-family: Galmuri11, serif;">방 만들기</div>
              <div class="custom-game-list" id="room-filter" style="color: rgb(255, 255, 255); font-family: Galmuri11, serif;">
                  <div class="histories game-mode-toggle" id="toggle">
                      <ul class="histories">
                          <li>1 vs 1 모드</li>
                          <li>토너먼트 모드</li>
                      </ul>
                  </div>
                  <div class="custom-game-list" id="room-filter">
                      방 걸러보기
                  </div> 
              </div>
            </footer>
						${roomCreateModal()}
						${passwordModal()}
        `;
  };
  /**
   * 사용자 지정 게임 방의 게임 방 리스트를 렌더링합니다.
   * @description $listWrapper {HTMLElement} 게임 방 리스트를 렌더링할 <div> 엘리먼트
   */
  this.renderGameRoomList = () => {
    let $listWrapper = $container.querySelector("#list-wrapper");
    $listWrapper.innerHTML = "";
    let curGameRoomList = getGameRoomList();
    for (let data of curGameRoomList) {
      $listWrapper.insertAdjacentHTML(
        "afterbegin",
        `
                <div class="game-room-list room-wrapper">
                    ${gameRoomList(data)}
                </div>
            `,
      );
    }
  };

  const addEventListenersToLayout = () => {
    // querySelectorAll로 룸 리스트 각각의 요소들을 담은 변수
    const $roomContents = document.querySelectorAll(
      ".game-room-list.room-info",
    );
    // 아직 사용하지는 않았지만 페이지네이션 오른쪽, 왼쪽 요소를 담고 있는 변수
    const $paginationBefore = document.getElementById("pagination-arrow-left");
    const $paginationAfter = document.getElementById("pagination-arrow-right");
    // 방만들기 버튼 요소
    const $createRoomButton = document.getElementById("create-room");
    // 방만들기 모달 요소
    const $roomCreateModal = document.getElementById(
      "room-create-modal-wrapper",
    );
    // 방만들기 모달 닫기 아이콘
    const $roomCreateModalClose = document.getElementById(
      "room-create-modal-close",
    );
    // 걸러보기 아이콘
    const $roomSearchFilter = document.getElementById("room-filter");
    // 걸러보기 토글
    const $modeFilterToggle = document.getElementById("toggle");
    // 패스워드 모달 요소
    const $passwordModal = document.getElementById("password-modal-wrapper");
    // 패스워드 모달 닫기 아이콘
    const $passwordModalClose = document.getElementById("password-modal-close");

    // 방만들기 모달 열기
    click($createRoomButton, () => {
      $roomCreateModal.style.display = "block";
    });

    // 방만들기 모달 닫기
    click($roomCreateModalClose, () => {
      $roomCreateModal.style.display = "none";
    });

    // 방 걸러보기 토글
    hoverToggle($roomSearchFilter, $modeFilterToggle, "block");

    // 대기중 && 자물쇠가 걸려있는 방 일때 패스워드 모달 열기
    // roomContant에 마우스가 들어갈 떄 hover event 적용
    $roomContents.forEach(($roomContent) => {
      click($roomContent, () => {
        const $roomWrapper = $roomContent.closest(".room-wrapper");

        // isSecret: '.is-secret' 클래스를 가진 요소의 존재 여부로 비밀방인지 판단
        const isSecret = $roomWrapper.querySelector(".is-secret") !== null;

        // isWaiting: roomStatus 요소의 텍스트 내용으로 '대기중'인지 판단
        const roomStatusElement = $roomWrapper.querySelector(".room-status");
        const isWaiting =
          roomStatusElement &&
          roomStatusElement.textContent.trim() === "대기중";

        // 비밀방이며 대기중인 경우, 패스워드 모달을 표시
        if (isSecret && isWaiting) {
          $passwordModal.style.display = "block";
        }
      });

      // mouseenter 이벤트 리스너
      $roomContent.addEventListener("mouseenter", function () {
        const style = window.getComputedStyle(this);
        const borderColor = style.borderColor;

        // RGB 색상에서 RGBA 색상으로 변환하여 배경색으로 설정 (20% 투명도 적용)
        const backgroundColor = borderColor
          .replace("rgb", "rgba")
          .replace(")", ", 0.2)");

        // 수정된 부분: 요소의 style 속성에 직접 backgroundColor 설정
        this.style.backgroundColor = backgroundColor;
      });

      // mouseleave 이벤트 리스너
      $roomContent.addEventListener("mouseleave", function () {
        // 배경색을 원래 상태(투명)로 되돌림
        this.style.backgroundColor = ""; // 또는 초기 설정한 배경색으로 지정
      });
    });

    // 패스워드 모달 닫기
    click($passwordModalClose, () => {
      $passwordModal.style.display = "none";
    });
  };

  // 임시 gameRoomList 오브젝트

  let gameRoomListInput = [
    {
      gameMode: "1 vs 1",
      gameModeImage: "../../../assets/images/1vs1_logo.png",
      countOfPlayers: "1/2",
      roomTitle: "핑포로로로롱",
      roomStatus: "대기중",
      isSecret: "../../assets/images/password.png",
    },
    {
      gameMode: "1 vs 1",
      gameModeImage: "../../../assets/images/1vs1_logo.png",
      countOfPlayers: "2/2",
      roomTitle: "너만 오면 ㄱ",
      roomStatus: "게임중",
      isSecret: "../../assets/images/password.png",
    },
    {
      gameMode: "토너먼트",
      gameModeImage: "../../../assets/images/tournament_logo.png",
      roomTitle: "Im king of pingpong lalalalaalalalala",
      countOfPlayers: "1/4",
      roomStatus: "대기중",
    },
    {
      gameMode: "토너먼트",
      gameModeImage: "../../../assets/images/tournament_logo.png",
      roomTitle: "다 뎀비라!",
      countOfPlayers: "4/4",
      roomStatus: "게임중",
    },
  ];

  let [getGameRoomList, setGameRoomList] = useState(
    gameRoomListInput,
    this,
    "renderGameRoomList",
  );
  init();
  addEventListenersToLayout();
}
