<script>
  import HighlightedTitle from '../HighlightedTitle.svelte'
  import Skeleton from "../albumWithDetails/AlbumWithDetails.loading.svelte"
  import AlbumWithDetails from '../albumWithDetails/AlbumWithDetails.loading.svelte';

  export let title;
  export let albums;
  export let loading;
</script>

<section>
  {#if title} <HighlightedTitle {title} /> {/if}
  <div class="verticalList">
    {#if loading}
      {#each Array(10) as _}
        <Skeleton />
      {/each}
    {:else}
      {#each albums as album}
        <AlbumWithDetails albumData={album} />
      {/each}
    {/if}
  </div>
</section>

<style>
  .verticalList {
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    overflow-x: scroll;
    padding: 0px;
    margin: 0px;
    margin-top: 20px;
    margin-bottom: 100px;
    max-width: 98vw;
  }
</style>
