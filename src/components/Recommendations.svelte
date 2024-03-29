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
  import VerticalList from "./list/VerticalList.svelte";
  import OnGenre from "./collection/OnGenre.svelte";
  import OnFavoriteArtists from "./collection/OnFavoriteArtists.svelte";
  import HighlightedTitle from "./HighlightedTitle.svelte";

  let favoriteArtists = [];
  let albums = [];
  let isDiscconnected = false;
  let userAlbums = [];
  let loading = true;

  let firstAlbums = [];
  let secondAlbums = [];
  let restAlbums = [];

  $: {
    if (albums.length > 0) {
      loading = false;
      firstAlbums = albums.slice(0, 10);
    }
    if (albums.length > 10) {
      secondAlbums = albums.slice(10, 20);
    }
    if (albums.length > 20) {
      restAlbums = albums.slice(20, albums.length);
    }
  }

  $: fetchAlbums(favoriteArtists);

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

  onMount(() => {
    scrollFullPage();
    fetchFavoriteArtists();
    getUserAlbums();
  });
</script>

{#if isDiscconnected && localStorage.getItem("bearer-token")}
  <Authorize />
{:else}
  <HighlightedTitle title="The latests albums from your saved artists" />
  <VerticalList {loading} albums={firstAlbums} />
  <OnGenre title="Albums you might like based on your favorite genres" />
  <VerticalList {loading} albums={secondAlbums} />
  <OnFavoriteArtists
    title="Albums you might like based on the artists you often listen to"
    {userAlbums}
  />
  <VerticalList {loading} albums={restAlbums} />
{/if}
