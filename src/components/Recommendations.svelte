<script lang="ts">
  import { onMount } from "svelte";
  import {
    getFavoriteArtists,
    getAlbumsFromArtists,
  } from "../lib/fetchSpotify.js";
  import { scrollFullPage } from "../lib/scroll";
  import Authorize from "./Authorize.svelte";
  import HorizontalList from "./HorizontalList.svelte";

  let favoriteArtists = [];
  let albums = [];

  const fetchFavoriteArtists = async () => {
    const response = await getFavoriteArtists(10, "medium_term");
    favoriteArtists = response.items;
  };

  const fetchAlbums = async ([...random]) => {
    if (favoriteArtists.length > 0) {
      const albumsForArtists = await getAlbumsFromArtists(
        favoriteArtists.map((artist) => artist.id)
      );

      const flattenedAlbums = albumsForArtists.flatMap((albumsForArtist) => {
        console.log(albumsForArtist.items);
        return albumsForArtist.items;
      });

      albums = flattenedAlbums;
    }
  };

  let isDiscconnected = false;

  onMount(() => {
    scrollFullPage();
    fetchFavoriteArtists();
  });

  $: fetchAlbums(favoriteArtists);
  $: console.log(albums);
</script>

{#if isDiscconnected && localStorage.getItem("bearer-token")}
  <Authorize />
{:else}
  <HorizontalList
    title="test"
    albums={albums}
  />
{/if}
