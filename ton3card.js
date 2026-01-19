// ===============================
//  ton3 Blog Card Generator
//  Version 2.0 (Blogger spec compliant)
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

// Fetch Blogger JSON Feed for a given URL (Blogger official spec)
async function fetchBloggerData(postUrl) {
  try {
    const u = new URL(postUrl);

    // Blogger official single-post JSON endpoint
    const feedUrl =
      `${u.origin}/feeds/posts/default?alt=json&path=${encodeURIComponent(u.pathname)}`;

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

    // Blogger spec: entry is inside feed.entry[0]
    if (!data || !data.feed || !data.feed.entry || !data.feed.entry.length) {
      card.innerHTML = "<p>カードを読み込めませんでした。</p>";
      continue;
    }

    const entry = data.feed.entry
