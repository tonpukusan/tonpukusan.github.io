// URLパラメータからURLを受け取る
const params = new URLSearchParams(location.search);
const sharedUrl = params.get("url");

if (sharedUrl) {
  document.getElementById("urlInput").value = sharedUrl;
}

// Amazon / 楽天のURLを正規化
function normalizeUrl(url) {
  try {
    const u = new URL(url);

    // Amazon
    if (u.hostname.includes("amazon")) {
      const asinMatch = u.pathname.match(/\/([A-Z0-9]{10})(?:[/?]|$)/);
      if (asinMatch) {
        return `https://www.amazon.co.jp/dp/${asinMatch[1]}`;
      }
    }

    // 楽天
    if (u.hostname.includes("rakuten")) {
      return url.split("?")[0];
    }

    return url;
  } catch {
    return url;
  }
}

// SNS用メッセージ生成
function generateMessage(url) {
  const n = normalizeUrl(url);

  if (n.includes("amazon")) {
    return `【Amazon】\n${n}\n\n#Amazon #おすすめ`;
  }

  if (n.includes("rakuten")) {
    return `【楽天】\n${n}\n\n#楽天市場 #おすすめ`;
  }

  return `【商品リンク】\n${n}`;
}

// ボタン押下
document.getElementById("generateBtn").addEventListener("click", () => {
  const url = document.getElementById("urlInput").value.trim();
  if (!url) return;

  const msg = generateMessage(url);
  document.getElementById("output").value = msg;
});
