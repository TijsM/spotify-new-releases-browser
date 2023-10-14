<script>
  import { onMount } from "svelte";
  import {
    getFavoriteArtists,
    getAlbumsFromArtists,
    getUserFavoriteArtists,
    getAlbumsDetails,
  } from "../lib/fetchSpotify.js";

  import { sortByReleaseDate } from "../lib/sortByReleaseDate.js";
  import { scrollFullPage } from "../lib/scroll";
  import Authorize from "./Authorize.svelte";
  import HorizontalList from "./HorizontalList.svelte";
  import VerticalList from "./VerticalList.svelte";

  let favoriteArtists = [];
  let albums = [];
  let isDiscconnected = false;

  const fetchFavoriteArtists = async () => {
    const realFavArtists = await getUserFavoriteArtists();
    favoriteArtists = realFavArtists;
  };

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

      const sortedAlbums = sortByReleaseDate(albumsWithDetails);

      albums = sortedAlbums;
    }
  };

  onMount(() => {
    scrollFullPage();
    fetchFavoriteArtists();
  });

  $: fetchAlbums(favoriteArtists);
</script>

{#if isDiscconnected && localStorage.getItem("bearer-token")}
  <Authorize />
{:else}
  <VerticalList  {albums} />
{/if}
