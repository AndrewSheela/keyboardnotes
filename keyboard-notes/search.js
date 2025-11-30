function filterSongs() {
  const input = document.getElementById("searchInput").value.toLowerCase().trim();

  if (input === "") {
    currentPage = 1;
    renderSongs(songs, currentPage);
    return;
  }

  filteredSongs = songs.filter(song =>
    song.title.toLowerCase().includes(input) ||
    song.album.toLowerCase().includes(input) ||
    song.artist.toLowerCase().includes(input) ||
    song.language.toLowerCase().includes(input)
  );

  currentPage = 1;
  renderSongs(filteredSongs, currentPage);
}
