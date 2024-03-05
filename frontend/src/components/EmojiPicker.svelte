<!-- EmojiPicker.svelte -->
<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  const dispatch = createEventDispatcher();

  // ... (other script code)

  function selectEmoji(emoji: any) {
    // Emit the selected emoji
  // Emit the selected emoji
  dispatch(
    'emojiSelect', { emoji });    
  } 
</script>
  
 <button on:click={() => selectEmoji('🙂')}>🙂</button>
<button on:click={() => selectEmoji('🙂')}>🙂</button>
<button on:click={() => selectEmoji('😃')}>😃</button>
<button on:click={() => selectEmoji('😎')}>😎</button>
<button on:click={() => selectEmoji('❤️')}>❤️</button>
<button on:click={() => selectEmoji('👍')}>👍</button>
<button on:click={() => selectEmoji('👏')}>👏</button>
<button on:click={() => selectEmoji('🥰')}>🥰</button>
<button on:click={() => selectEmoji('🤣')}>🤣</button>
<button on:click={() => selectEmoji('🙌')}>🙌</button>
<button on:click={() => selectEmoji('🔥')}>🔥</button>
  <!-- Add buttons for more emojis as needed -->
  