<script>
  export let albumData;
</script>

{#if albumData}
<a href="{albumData.external_urls.spotify}" class="container">
  <img src="{albumData.images[0].url}" alt="album cover" />
  <div class="albumContainer">
    <div class="album">{albumData.artists[0].name}</div>
    <div class="artist">{albumData.name}</div>
  </div>
</a>
{/if}

<style>
  .container {
    flex-shrink: 0;
    max-width: 80%;
    width: 300px;
    max-width: 70%;
    margin: auto;
    margin: 25px;
  }

  img {
    width: 100%;
    margin-bottom: 15px;
  }

  .album {
    font-size: 1.4em;
    font-weight: bold;
    text-align: left;
  }
  .artist {
    text-align: left;
    opacity: 0.8;
  }
  .albumContainer {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
  }
</style>
