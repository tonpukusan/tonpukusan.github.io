// ===============================
//  Small-Fishing Blog Card Generator
//  Version 1.0
// ===============================

// Utility: escape HTML
function escapeHTML(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// Fetch Blogger JSON Feed for a given URL
async function fetchBloggerData(postUrl) {
  const feedUrl = postUrl.replace(/\/$/, "") + "?alt=json";

  try {
    const res = await fetch(feedUrl);
    if (!res.ok) throw new Error("Feed fetch failed");
    const data = await res.json();
    return data;
  } catch (e) {
    console.error("BlogCard Fetch Error:", e);
    return null;
  }
}

// Generate card HTML
function generateCardHTML({ title, url, thumbnail, summary, date }) {
  return `
    <div class="ton3-blogcard">
      <a href="${url}" class="ton3-blogcard-link" target="_blank" rel="noopener">
        <div class="ton3-blogcard-thumb">
          <img src="${thumbnail}" loading="lazy" alt="${escapeHTML(title)}">
        </div>
        <div class="ton3-blogcard-content">
          <h3 class="ton3-blogcard-title">${escapeHTML(title)}</h3>
          <p class="ton3-blogcard-desc">${escapeHTML(summary)}</p>
          <span class="ton3-blogcard-date">${escapeHTML(date)}</span>
        </div>
      </a>
    </div>
  `;
}

// Main: scan all .ton3-card elements
async function initton3Cards() {
  const cards = document.querySelectorAll(".ton3-card");

  for (const card of cards) {
    const url = card.dataset.url;
    if (!url) continue;

    const data = await fetchBloggerData(url);
    if (!data || !data.entry) {
      card.innerHTML = "<p>カードを読み込めませんでした。</p>";
      continue;
    }

    const entry = data.entry;

    const title = entry.title?.$t || "タイトルなし";
    const summaryRaw = entry.summary?.$t || "";
    const summary = summaryRaw.substring(0, 120) + "…";

    const thumbnail =
      entry["media$thumbnail"]?.url ||
      "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgHhH_s0EKdgNEbOuz4OIQEEWhdgqbpCBk1tLZjXQrnkFsxaP2F1_P9emqbnprxxBWk-A8rJ_cLfmI1NJrW6FAPYNtkhcegw81vhnsV79e2Sa0vqOe2bwGfjbL-K5EwnE0CWV0iq6N998I/s96/ProfilePhoto.jpg";

    const date = entry.published?.$t?.substring(0, 10) || "";

    card.innerHTML = generateCardHTML({
      title,
      url,
      thumbnail,
      summary,
      date,
    });
  }
}

// Run after DOM ready
document.addEventListener("DOMContentLoaded", initton3Cards);
