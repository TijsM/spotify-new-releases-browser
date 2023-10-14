<script>
  import { onMount } from "svelte";
  import {
    getAlbumsFromArtists,
    getUserFavoriteArtists,
    getAlbumsDetails,
    getAlbumsFromUser,
  } from "../lib/fetchSpotify.js";

  import { sortByReleaseDate } from "../lib/sortByReleaseDate.js";
  import { scrollFullPage } from "../lib/scroll";
  import Authorize from "./Authorize.svelte";
  import VerticalList from "./VerticalList.svelte";
  import OnGenre from "../components/lists/OnGenre.svelte";
  import OnFavoriteArtists from "../components/lists/OnFavoriteArtists.svelte";

  let favoriteArtists = [];
  let albums = [];
  let isDiscconnected = false;
  let userAlbums = [];

  let firstAlbums = [];
  let secondAlbums = [];
  let restAlbums = [];

  $: {
    if (albums.length > 0) {
      firstAlbums = albums.slice(0, 10);
    }
    if (albums.length > 10) {
      secondAlbums = albums.slice(10, 20);
    }
    if (albums.length > 20) {
      restAlbums = albums.slice(20, albums.length);
    }
  }

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
  const getUserAlbums = async () => {
    const _albums = await getAlbumsFromUser();
    if (_albums === null) {
      isDiscconnected = true;
    }
    userAlbums = [..._albums];
    albumsLoaded = true;
  };

  getUserAlbums();

  onMount(() => {
    scrollFullPage();
    fetchFavoriteArtists();
    getUserAlbums();
  });

  $: fetchAlbums(favoriteArtists);
</script>

{#if isDiscconnected && localStorage.getItem("bearer-token")}
  <Authorize />
{:else}
  <VerticalList
    albums={firstAlbums}
  />
  <OnGenre title="Albums you might like based on your __genres__" />
  <VerticalList
    albums={secondAlbums}
  />
  <OnFavoriteArtists
    title="Albums you might like based on the artists __you often listen to__"
    {userAlbums}
  />
  <VerticalList
  albums={restAlbums}
/>
{/if}
