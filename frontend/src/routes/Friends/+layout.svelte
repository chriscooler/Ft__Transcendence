<script>

</script>

<div class="friend-layout">
    <div class="friend-header">
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <!-- svelte-ignore a11y-no-static-element-interactions -->
      <div class="find-friend">
        <span>Find friends</span>
      </div>
    </div>
  
    <slot></slot>
</div>
 <style>

    .friend-layout {
        background-image: url("/images/chat_background.jpg");
        background-repeat: no-repeat;
        background-size: cover;
        background-position: center;
        min-height: 100vh;
        min-width: 100%;
        display: flex;
        flex-direction: column;
        position: absolute;
      }

    .friend-header {
      display: flex;
      justify-content: space-between;
      background-color: #333;
      color: white;
      padding: 10px;
      font-family: fantasy;
    }
  
    .find-friend {
      flex: 1;
      text-align: center;
      font-family: fantasy;
    }
  </style>
  