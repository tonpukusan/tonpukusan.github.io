function escapeHTML(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

async function fetchBloggerData(postUrl) {
  try {
    var u = new URL(postUrl);
    var feedUrl =
      u.origin +
      "/feeds/posts/default?alt=json&path=" +
      encodeURIComponent(u.pathname);

    var res = await fetch(feedUrl);
    if (!res.ok) throw new Error("Feed fetch failed");

    var data = await res.json();
    return data;
  } catch (e) {
    console.error("BlogCard Fetch Error:", e);
    return null;
  }
}

function generateCardHTML(obj) {
  var html = "";
  html += '<div class="ton3-blogcard">';
  html += '<a href="' + obj.url + '" class="ton3-blogcard-link" target="_blank" rel="noopener">';
  html += '<div class="ton3-blogcard-thumb">';
  html += '<img src="' + obj.thumbnail + '" loading="lazy" alt="' + escapeHTML(obj.title) + '">';
  html += '</div>';
  html += '<div class="ton3-blogcard-content">';
  html += '<h3 class="ton3-blogcard-title">' + escapeHTML(obj.title) + '</h3>';
  html += '<p class="ton3-blogcard-desc">' + escapeHTML(obj.summary) + '</p>';
  html += '<span class="ton3-blogcard-date">' + escapeHTML(obj.date) + '</span>';
  html += '</div>';
  html += '</a>';
  html += '</div>';
  return html;
}

async function initton3Cards() {
  var cards = document.querySelectorAll(".ton3-card");

  for (var i = 0; i < cards.length; i++) {
    var card = cards[i];
    var url = card.dataset.url;
    if (!url) continue;

    var data = await fetchBloggerData(url);

    if (!data || !data.feed || !data.feed.entry || !data.feed.entry.length) {
      card.innerHTML = "<p>カードを読み込めませんでした。</p>";
      continue;
    }

    var entry = data.feed.entry[0];

    var title = entry.title ? entry.title.$t : "タイトルなし";

    var summaryRaw = entry.summary ? entry.summary.$t : "";
    var summaryText = summaryRaw.replace(/<[^>]+>/g, "");
    var summary = summaryText.substring(0, 120) + "…";

    var thumbnail = entry["media$thumbnail"]
      ? entry["media$thumbnail"].url.replace(/s\d+-c/, "s320")
      : "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgHhH_s0EKdgNEbOuz4OIQEEWhdgqbpCBk1tLZjXQrnkFsxaP2F1_P9emqbnprxxBWk-A8rJ_cLfmI1NJrW6FAPYNtkhcegw81vhnsV79e2Sa0vqOe2bwGfjbL-K5EwnE0CWV0iq6N998I/s96/ProfilePhoto.jpg";

    var date = entry.published ? entry.published.$t.substring(0, 10) : "";

    card.innerHTML = generateCardHTML({
      title: title,
      url: url,
      thumbnail: thumbnail,
      summary: summary,
      date: date
    });
  }
}

document.addEventListener("DOMContentLoaded", initton3Cards);
