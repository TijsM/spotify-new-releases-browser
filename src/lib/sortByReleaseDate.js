export function sortByReleaseDate(albums) {
  return albums.sort((a, b) => {
    const dateA = new Date(a.release_date);
    const dateB = new Date(b.release_date);

    // Compare release dates
    if (dateA > dateB) return -1;
    if (dateA < dateB) return 1;
    return 0;
  });
}
