<script>
</script>

<div class="game-layout">
  <div class="game-header">
    <div class="original-pong" >
      <span>Matchmaking game original Pong (1972)</span>
    </div>
</div>

<slot></slot>
  </div>
  <style>

    .game-layout {
        background-image: url("/images/game_background.png");
        background-repeat: no-repeat;
        background-size: cover;
        background-position: center;
        min-height: 100vh;
        min-width: 100%;
        display: flex;
        flex-direction: column;
        position: absolute;
      }
    .game-header {
      display: flex;
      justify-content: space-between;
      background-color: #333;
      color: white;
      padding: 10px;
      font-family: fantasy;
    }
  
    .original-pong
	  {
      flex: 1;
      text-align: center;
      font-family: fantasy;
    }
  </style>
  