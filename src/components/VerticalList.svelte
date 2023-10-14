<script>
  import AlbumWithDetails from "./AlbumWithDetails.svelte";
  import HighlightedTitle from "./HighlightedTitle.svelte";

  export let title;
  export let albums;
</script>

<section>
  {#if title} <HighlightedTitle {title} /> {/if}
  <div class="verticalList">
    {#each albums as album}
      <AlbumWithDetails albumData={album} />
    {/each}
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
