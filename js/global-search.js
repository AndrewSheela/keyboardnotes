let globalData = [];

fetch("/data/global-search.json?v=" + Date.now())
  .then(res => {
    if (!res.ok) throw new Error("Global JSON not found");
    return res.json();
  })
  .then(data => {
    console.log("✅ GLOBAL SEARCH JSON LOADED:", data);
    globalData = data;
  })
  .catch(err => console.error("❌ Global Search JSON error:", err));

function runGlobalSearch(){
  const input = document.getElementById("globalSearchInput").value.toLowerCase().trim();
  const resultBox = document.getElementById("globalResults");

  resultBox.innerHTML = "";

  if (!input) return;

  const results = globalData.filter(item =>
    (item.title && item.title.toLowerCase().includes(input)) ||
    (item.album && item.album.toLowerCase().includes(input)) ||
    (item.artist && item.artist.toLowerCase().includes(input)) ||
    (item.language && item.language.toLowerCase().includes(input)) ||
    (item.type && item.type.toLowerCase().includes(input))
  );

  if (!results.length){
    resultBox.innerHTML = "<div class='global-item'>❌ No results found</div>";
    return;
  }

  results.forEach(item => {
    const div = document.createElement("div");
    div.className = "global-item";

    div.innerHTML = `
      <div>
        <a href="${item.url}">${item.title}</a>
        <div class="global-meta">
          ${item.type.toUpperCase()} • ${item.album} • ${item.artist} • ${item.language}
        </div>
      </div>
    `;

    resultBox.appendChild(div);
  });
}
