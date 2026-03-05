import { getFile, saveFile } from "./github.js";

export async function loadGallery() {
  document.getElementById("section-gallery").innerHTML = `
    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:24px;">
      <h1 style="font-size:20px; font-weight:900; text-transform:uppercase; letter-spacing:0.1em;">Галерэя</h1>
      <button id="add-gallery-btn" style="background:#dc2626; color:#fff; border:none; padding:10px 20px; font-size:12px; font-weight:700; text-transform:uppercase; letter-spacing:0.1em; cursor:pointer;">
        + Дадаць фота
      </button>
    </div>
    <div id="gallery-list">Загрузка...</div>
  `;

  try {
    const { json: gallery, sha } = await getFile("public/data/gallery.json");

    document.getElementById("gallery-list").innerHTML = gallery
      .map(
        (item, idx) => `
  <div style="display:flex; justify-content:space-between; align-items:center; padding:16px; border:1px solid #222; margin-bottom:8px; background:#111;">
    <div style="font-size:14px; color:#fff;">${item.src}</div>
    <div style="font-size:12px; color:#666; flex:1; padding:0 16px;">${item.alt}</div>
    <div style="display:flex; gap:8px;">
      <button data-idx="${idx}" class="edit-gallery-btn" style="background:transparent; border:1px solid #333; color:#999; padding:6px 14px; font-size:11px; cursor:pointer;">Рэд.</button>
      <button data-idx="${idx}" class="delete-gallery-btn" style="background:transparent; border:1px solid #333; color:#666; padding:6px 14px; font-size:11px; cursor:pointer;">Выд.</button>
    </div>
  </div>
`,
      )
      .join("");

    document
      .getElementById("gallery-list")
      .addEventListener("click", async (e) => {
        const editBtn = e.target.closest(".edit-gallery-btn");
        const deleteBtn = e.target.closest(".delete-gallery-btn");

        if (editBtn) {
          const idx = parseInt(editBtn.dataset.idx);
          openGalleryEditor(gallery[idx], gallery, sha, idx);
        }

        if (deleteBtn) {
          if (!confirm("Выдаліць фота?")) return;
          const idx = parseInt(deleteBtn.dataset.idx);
          const updated = gallery.filter((_, i) => i !== idx);
          try {
            await saveFile("public/data/gallery.json", updated, sha);
            loadGallery();
          } catch (e) {
            console.error(e);
          }
        }
      });

    document.getElementById("add-gallery-btn").addEventListener("click", () => {
      openGalleryEditor(
        { src: "", alt: "", width: 1000, height: 1000 },
        gallery,
        sha,
        -1,
      );
    });
  } catch (e) {
    document.getElementById("gallery-list").innerHTML =
      `<p style="color:#dc2626;">Памылка загрузкі: ${e.message}</p>`;
  }
}

function openGalleryEditor(item, gallery, sha, idx) {
  document.getElementById("section-gallery").innerHTML = `
    <div style="display:flex; align-items:center; gap:16px; margin-bottom:24px;">
      <button id="back-btn" style="background:transparent; border:1px solid #333; color:#999; padding:8px 16px; font-size:12px; cursor:pointer;">← Назад</button>
      <h1 style="font-size:20px; font-weight:900; text-transform:uppercase; letter-spacing:0.1em;">${idx === -1 ? "Дадаць фота" : "Рэдагаваць фота"}</h1>
    </div>
    <div style="display:flex; flex-direction:column; gap:16px; max-width:800px;">
      <label style="font-size:11px; color:#666; text-transform:uppercase; letter-spacing:0.1em;">Назва файла
        <div style="display:flex; align-items:center; margin-top:6px;">
          <span style="padding:10px; background:#1a1a1a; border:1px solid #333; border-right:none; color:#666; font-size:13px; white-space:nowrap;">/img/gallery/</span>
          <input id="f-src" value="${item.src}" style="flex:1; padding:10px; background:#111; border:1px solid #333; color:#fff; font-size:14px;">
        </div>
      </label>
      <label style="font-size:11px; color:#666; text-transform:uppercase; letter-spacing:0.1em;">Апісанне (alt)
        <input id="f-alt" value="${item.alt}" style="display:block; width:100%; margin-top:6px; padding:10px; background:#111; border:1px solid #333; color:#fff; font-size:14px;">
      </label>
      <button id="save-btn" style="background:#dc2626; color:#fff; border:none; padding:12px 24px; font-size:13px; font-weight:700; text-transform:uppercase; letter-spacing:0.1em; cursor:pointer; width:fit-content;">Захаваць</button>
    </div>
  `;

  document.getElementById("back-btn").addEventListener("click", loadGallery);

  document.getElementById("save-btn").addEventListener("click", async () => {
    const btn = document.getElementById("save-btn");
    btn.textContent = "Захоўваю...";
    btn.disabled = true;

    const updatedItem = {
      src: document.getElementById("f-src").value,
      alt: document.getElementById("f-alt").value,
      width: item.width || 1000,
      height: item.height || 1000,
    };

    const updated =
      idx === -1
        ? [...gallery, updatedItem]
        : gallery.map((g, i) => (i === idx ? updatedItem : g));

    try {
      const result = await saveFile("public/data/gallery.json", updated, sha);
      btn.textContent = "Захавана ✓";
      setTimeout(() => loadGallery(), 2000);
    } catch (e) {
      btn.textContent = "Памылка!";
      btn.disabled = false;
      console.error(e);
    }
  });
}
