<script>
  import { onMount } from "svelte";

  let { src, alt = "" } = $props();

  let loaded = $state(false);
  let failed = $state(false);
  let loading = $state(false);
  let isVertical = $state(false);

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
{/if}
