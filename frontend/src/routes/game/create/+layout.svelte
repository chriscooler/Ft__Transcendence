<script lang=ts>
    import { userLogin, InvitedUserLogin, winnerScore, leftPlayerUsername, rightPlayerUsername} from "$lib/store/store";

    let login: string = "";
    leftPlayerUsername.subscribe((a)=> {
        login = a;
    })

    let invited: string; 
    rightPlayerUsername.subscribe((a) => {
      invited = a;
    })

    let socreToWin: number;
    winnerScore.subscribe((a) => {
      socreToWin = a;
    })

    // console.log("layout: Left Player: {login}", login);
    // console.log("layout: Right Player:{invited}", invited);

  </script>
  <div class="game-header">
    <div class="left-player">
      <span>Left Player: '{login}'</span>
    </div>
    <div class="right-player">
      <span>Right Player: '{invited}' </span>
    </div>
  </div>

  <div class="scoreToWin">
    <span>Score To Win: '{socreToWin}' </span>
  </div>
  
  <div class="game-content">
    <slot></slot>
  </div>
  
  <style>
    .game-header {
      display: flex;
      justify-content: space-between;
      background-color: #333;
      color: white;
      padding: 10px;
    }
  
    .left-player,
    .right-player {
      flex: 1;
      text-align: center;
    }

    .scoreToWin {
      flex: 1;
      text-align: center;
      justify-content: space-between;
    }
  </style>
  