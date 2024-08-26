<script >
  import { onMount } from "svelte";

  export let src;
  export let alt = "";

  let loaded = false;
  let failed = false;
  let loading = false;
  let isVertical = false;

  onMount(() => {
    const img = new Image();
    img.src = src;
    loading = true;

    img.onload = () => {
      loading = false;
      loaded = true;
      isVertical = img.width / img.height < 1;
    };
    
    img.onerror = () => {
      loading = false;
      failed = true;
    };
  });
</script>

{#if loaded}
  {#if isVertical }
    <figure class="is-vertical">
      <img class="has-filter" {src} {alt} />
    </figure>
  {:else}
    <img class="has-filter" {src} {alt} />
  {/if}
<!-- {:else if failed}
  <img src="https://icon-library.com/images/not-found-icon/not-found-icon-20.jpg" alt="Not Found" />
{:else if loading}
  <img src="https://c.tenor.com/On7kvXhzml4AAAAi/loading-gif.gif" alt="Loading..." /> -->
{/if}
