<script>
  import { onMount } from "svelte";
  import {
    getFavoriteArtists,
    getAlbumsFromArtists,
    getUserFavoriteArtists,
    getAlbumsDetails,
  } from "../lib/fetchSpotify.js";
  import { scrollFullPage } from "../lib/scroll";
  import Authorize from "./Authorize.svelte";
  import HorizontalList from "./HorizontalList.svelte";

  let favoriteArtists = [];
  let albums = [];

  const fetchFavoriteArtists = async () => {
    const realFavArtists = await getUserFavoriteArtists();
    favoriteArtists = realFavArtists;
  };

  function sortByReleaseDate(albums) {
    return albums.sort((a, b) => {
      const dateA = new Date(a.release_date);
      const dateB = new Date(b.release_date);

      // Compare release dates
      if (dateA >dateB) return -1;
      if (dateA < dateB) return 1;
      return 0;
    });
  }

  const fetchAlbums = async () => {
    if (favoriteArtists.length > 0) {
      const albumsForArtists = await getAlbumsFromArtists(
        favoriteArtists.map((artist) => artist.id)
      );

      const flattenedAlbums = albumsForArtists.flatMap((albumsForArtist) => {
        return albumsForArtist.items;
      });

      const onlyAlbums = flattenedAlbums.filter(
        (album) => album.album_group === "album"
      );


      const albumsWithDetails = await getAlbumsDetails(
        onlyAlbums.map((a) => a.id)
      );

      console.log(JSON.stringify(albumsWithDetails.slice(0, 1)));

      const sortedAlbums = sortByReleaseDate(albumsWithDetails)

      albums = sortedAlbums
    }
  };

  let isDiscconnected = false;

  onMount(() => {
    scrollFullPage();
    fetchFavoriteArtists();
  });

  $: fetchAlbums(favoriteArtists);
</script>

{#if isDiscconnected && localStorage.getItem("bearer-token")}
  <Authorize />
{:else}
  <HorizontalList title="test" {albums} />
{/if}
