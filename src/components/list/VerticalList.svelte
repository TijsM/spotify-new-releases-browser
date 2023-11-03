<script>
  import HighlightedTitle from '../HighlightedTitle.svelte'
  import HorizontalAlbumCardSkeleton from "../horizontalAlbumCard/HorizontalAlbumCard.loading.svelte"
  import HorizontalAlbumCard from '../horizontalAlbumCard/HorizontalAlbumCard.svelte';

  export let title;
  export let albums;
  export let loading;
</script>

<section>
  {#if title} <HighlightedTitle {title} /> {/if}
  <div class="verticalList">
    {#if loading}
      {#each Array(10) as _}
        <HorizontalAlbumCardSkeleton />
      {/each}
    {:else}
      {#each albums as album}
        <HorizontalAlbumCard albumData={album} />
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
