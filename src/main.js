import { getFile } from "./github.js";

// Навігацыя паміж раздзеламі
document.querySelectorAll(".nav-link").forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    const section = link.dataset.section;

    document
      .querySelectorAll(".nav-link")
      .forEach((l) => l.classList.remove("active"));
    document
      .querySelectorAll(".section")
      .forEach((s) => s.classList.remove("active"));

    link.classList.add("active");
    document.getElementById(`section-${section}`).classList.add("active");
  });
});

// Загрузка навін
async function loadNews() {
  document.getElementById("section-news").innerHTML = `
    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:24px;">
      <h1 style="font-size:20px; font-weight:900; text-transform:uppercase; letter-spacing:0.1em;">Навіны</h1>
      <button id="add-news-btn" style="background:#dc2626; color:#fff; border:none; padding:10px 20px; font-size:12px; font-weight:700; text-transform:uppercase; letter-spacing:0.1em; cursor:pointer;">
        + Дадаць навіну
      </button>
    </div>
    <div id="news-list">Загрузка...</div>
  `;

  try {
    const { json: news } = await getFile("public/locales/news-be.json");
    const sorted = news.sort((a, b) => b.id - a.id);

    document.getElementById("news-list").innerHTML = sorted
      .map(
        (item) => `
      <div style="display:flex; justify-content:space-between; align-items:center; padding:16px; border:1px solid #222; margin-bottom:8px; background:#111;">
        <div>
          <div style="font-size:11px; color:#dc2626; font-weight:700; margin-bottom:4px;">${item.date}</div>
          <div style="font-size:14px; font-weight:600;">${item.title}</div>
        </div>
        <button data-id="${item.id}" class="edit-btn" style="background:transparent; border:1px solid #333; color:#999; padding:6px 14px; font-size:11px; cursor:pointer;">
          Рэдагаваць
        </button>
      </div>
    `,
      )
      .join("");
  } catch (e) {
    document.getElementById("news-list").innerHTML =
      `<p style="color:#dc2626;">Памылка загрузкі: ${e.message}</p>`;
  }
}

loadNews();
