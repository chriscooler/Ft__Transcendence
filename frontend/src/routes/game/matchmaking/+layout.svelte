<script lang="ts">
  import { onMount } from "svelte";
  import { launchedGame } from "$lib/store/store";

</script>

<div class="game-header">
  <div class="left-player">
 
    <span>Left Player: </span>
  </div>
  <div class="right-player">
    <span>Right Player: </span>
  </div>
</div>

<div class="game-content">
  <slot />
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
</style>
