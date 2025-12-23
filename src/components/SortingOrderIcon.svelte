<script>
  let { sortState = { field: "", order: 0 }, field } = $props();
</script>

<!-- {#if sortState.field == field}
  {#if sortState.order == 1}
    🔼
  {/if}
  {#if sortState.order == 2}
    🔽
  {/if}
{/if} -->
