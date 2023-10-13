const token = localStorage.getItem("bearer-token");

export const getUserData = async () => {
  const userData = await fetch(`https://api.spotify.com/v1/me`, {
    headers: {
      Authorization: "Bearer " + token,
    },
  });

  const user = await userData.json();

  localStorage.setItem("user-name", user.display_name);
  return user;
};

export const getRelatedArtists = async (artistId) => {
  const artistData = await fetch(
    `https://api.spotify.com/v1/artists/${artistId}/related-artists`,
    {
      headers: {
        Authorization: "Bearer " + token,
      },
    }
  );

  return await artistData.json();
};

export const getAlbumsFromArtist = async (artistId) => {
  const artistData = await fetch(
    `https://api.spotify.com/v1/artists/${artistId}/albums`,
    {
      headers: {
        Authorization: "Bearer " + token,
      },
    }
  );

  return await artistData.json();
};

export const getAlbumsFromArtists = async (artistIds) => {
  return Promise.all(
    artistIds.map((artistId) => {
      return getAlbumsFromArtist(artistId);
    })
  );
};

export const getFavoriteArtists = async (
  limit = 30,
  period = "medium_term"
) => {
  const favArtists = await fetch(
    `https://api.spotify.com/v1/me/top/artists?limit=${limit}&time_range=${period}`,
    {
      headers: {
        Authorization: "Bearer " + token,
      },
    }
  );
  return await favArtists.json();
};

export const getUserFavoriteArtists = async (limit = 50) => {
  let allFavArtists = [];
  let after = null;

  do {
    const url = `https://api.spotify.com/v1/me/following?type=artist&limit=50${
      after ? `&after=${after}` : ""
    }`;

    const favArtistsResponse = await fetch(url, {
      headers: {
        Authorization: "Bearer " + token,
      },
    });

    if (!favArtistsResponse.ok) {
      throw new Error("Failed to fetch favorite artists.");
    }

    const favArtistsData = await favArtistsResponse.json();
    const artists = favArtistsData.artists.items;

    if (artists.length === 0) {
      break; // No more artists to fetch
    }

    allFavArtists = [...allFavArtists, ...artists];
    after = favArtistsData.artists.cursors.after;
  } while (after);

  return allFavArtists;
};

export const getAlbumsFromGenre = async (genres, artists) => {
  const genresString = encodeURI(genres.join(","));
  const artistsString = encodeURI(artists.join(","));

  const albumsOnGenre = await fetch(
    `https://api.spotify.com/v1/recommendations/?seed_genres=${genresString}&seed_artists=${artistsString}`,
    {
      headers: {
        Authorization: "Bearer " + token,
      },
    }
  );

  return await albumsOnGenre.json();
};

let fetched = 0;
let albums = [];
export const getAlbumsFromUser = async () => {
  let total = 0;
  const userAlbums = await fetch(
    `https://api.spotify.com/v1/me/albums?offset=${fetched}&limit=50`,
    {
      headers: {
        Authorization: "Bearer " + token,
      },
    }
  );

  const data = await userAlbums.json();

  if (data.error) {
    return null;
  }

  data.items.forEach((album) => {
    albums.push(album.album);
    albums = [...albums];
  });

  //recursivly get all albums
  fetched += 50;
  total = data.total;

  if (fetched < total) {
    return getAlbumsFromUser();
  } else {
    return albums;
  }
};

export const getAlbumsDetailsOf20Albums = async (ids) => {
  if (ids.length > 20) {
    throw new Error("Maximum allowed album IDs is 20.");
  }

  // Convert array of IDs to a comma-separated string
  const encodedIds = ids.join(",");

  const albumsDetails = await fetch(
    `https://api.spotify.com/v1/albums/?ids=${encodedIds}`,
    {
      headers: {
        Authorization: "Bearer " + token,
      },
    }
  );

  return await albumsDetails.json();
};

export const getAlbumsDetails = async (ids) => {
  const chunks = splitIdsIntoSubarrays(ids, 20);
  const albums = await Promise.all(
    chunks.map((chunk) => getAlbumsDetailsOf20Albums(chunk))
  );

  return albums.flatMap((a) => a.albums);
};

const splitIdsIntoSubarrays = (ids, subArrayLenth) => {
  const result = [];

  for (let i = 0; i < ids.length; i += subArrayLenth) {
    result.push(ids.slice(i, i + subArrayLenth));
  }

  return result;
};
