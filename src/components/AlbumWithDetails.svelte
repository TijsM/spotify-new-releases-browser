<script>
  export let albumData;

  console.log(albumData);
</script>

{#if albumData}
  <a href={albumData.external_urls.spotify} class="container">
    <img src={albumData.images[0].url} alt="album cover" />
    <div class="albumInfo">
      <div class="album">{albumData.artists[0].name}</div>
      <div class="artist">{albumData.name}</div>
      <div class="date">{albumData.release_date}</div>
    </div>
  </a>
{/if}

<style>
  .container {
    flex-shrink: 0;
    width: 100%;
    padding: 16px;
    margin-bottom: 0px;
    display: flex;
    box-sizing: border-box;
    overflow-x: hidden;
  }

  img {
    width: 50%;
    margin-bottom: 15px;
    max-width: 300px;
  }
  .albumInfo {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    padding-left: 24px;
  }

  .album {
    font-size: 1.3em;
    font-weight: bold;
    text-align: left;
  }
  .artist {
    font-size: 1em;
    text-align: left;
    opacity: 0.8;
  }

  .date {
    font-size: 1em;
    text-align: left;
    opacity: 0.8;
    margin-top: 16px;

  }
</style>
