<script>
  import { getFavoriteArtists, getAlbumsFromArtist } from "../../lib/fetchSpotify.js";
  import { AMOUNT_OF_ALBUMS_TO_FETCH } from '../../constants.js'
  import { getRandom } from "../../lib/getRandom.js";
  import HorizontalList from '../list/HorizontalList.svelte'

  export let title
  export let period

  let favoriteArtists = [];
  let albums = [];

  const AMOUNT_OF_ARTISTS = period?25:40

  const fetchFavoriteArtists = async () => {
    favoriteArtists = await getFavoriteArtists(AMOUNT_OF_ARTISTS, period);
    favoriteArtists = favoriteArtists.items
  };

  const getData = async () => {
    if(favoriteArtists.length === 0){
      await fetchFavoriteArtists()
    }

    const randomArtistIndex = getRandom(favoriteArtists.length)
    const randomArtist = favoriteArtists[randomArtistIndex]

    let artistAlbums = await getAlbumsFromArtist(randomArtist.id)

    artistAlbums = artistAlbums.items
    const randomAlbumIndex = getRandom(artistAlbums.length)

    const tempArray = albums;
      tempArray.push(artistAlbums[randomAlbumIndex])
      albums = [...tempArray]

  };

  const loadAlbums = () => {
    for (let i = 0; i < AMOUNT_OF_ALBUMS_TO_FETCH; i++) {
      getData();
    }
  };

  loadAlbums();
</script>


<HorizontalList {title} loadMore={loadAlbums} albums={albums}/>
