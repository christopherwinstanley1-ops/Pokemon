const SYSTEM = "gba";
const ROMS_ENDPOINT = `/roms/${SYSTEM}`;
const DATA_PATH = "/data/";
const BIOS = { gba: "/bios/gba_bios.bin" };

const romListEl = document.getElementById("rom-list");
const searchInput = document.getElementById("searchInput");
let ROMS = [];

window.addEventListener("load", async () => {
  await loadRoms();
  wireUI();
});

async function loadRoms() {
  // This assumes your server lists ROM files (works if using Express or simple JSON list)
  try {
    const res = await fetch(ROMS_ENDPOINT);
    ROMS = await res.json();
  } catch {
    // fallback manual list if directory listing is disabled
    ROMS = ["Pokemon FireRed.gba", "Metroid Fusion.gba"];
  }
  renderList(ROMS);
}

function renderList(list) {
  romListEl.innerHTML = "";
  list.forEach(file => {
    const name = beautifyName(file);
    const card = document.createElement("div");
    card.className = "pokedex-card";
    card.onclick = () => playRom(SYSTEM, file);

    const img = document.createElement("img");
    img.src = `/images/${name}.jpg`;
    img.onerror = () => img.src = "https://upload.wikimedia.org/wikipedia/commons/5/52/Pok%C3%A9_Ball_icon.svg";
    img.alt = name;
    img.className = "pokedex-thumb";

    const body = document.createElement("div");
    body.className = "pokedex-body";
    const title = document.createElement("div");
    title.className = "pokedex-title";
    title.textContent = name;
    const badge = document.createElement("span");
    badge.className = "badge";
    badge.textContent = "GBA";

    body.appendChild(title);
    body.appendChild(badge);
    card.appendChild(img);
    card.appendChild(body);
    romListEl.appendChild(card);
  });
}

function beautifyName(f) {
  return f.replace(/_/g, " ").replace(/\.(gba|zip)$/i, "").trim();
}

function playRom(system, rom) {
  const url = `/play.html?system=${system}&rom=${encodeURIComponent(rom)}`;
  window.open(url, "_blank");
}

function wireUI() {
  searchInput.oninput = e => {
    const q = e.target.value.toLowerCase();
    renderList(ROMS.filter(r => beautifyName(r).toLowerCase().includes(q)));
  };
}
