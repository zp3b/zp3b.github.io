const DOWNLOAD_ICON = `<span class="icon icon-download btn-icon"></span> `;

function initObserver() {
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;

                requestAnimationFrame(() => {
                    el.classList.add("active");
                });
                
                observer.unobserve(el);
            }
        });
    }, { threshold: 0.05 });

    document.querySelectorAll(".reveal").forEach(el => observer.observe(el));
}

async function setVersionText() {
    const cacheKey = "bs_version_cache";
    const cacheExpiry = 3600000; // 1 hour
    const now = Date.now();

    let cachedData = null;
    try { 
        cachedData = JSON.parse(localStorage.getItem(cacheKey)); 
    } catch {
        // silent catch for disabled or full localStorage
    }

    // show cached version if it's valid
    if (cachedData && (now - cachedData.timestamp < cacheExpiry)) {
        renderVersion(cachedData.version);
        return;
    }

    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);
        
        const res = await fetch("https://api.github.com/repos/zp3b/Flowerstrap/releases/latest", {
            signal: controller.signal
        });
        clearTimeout(timeoutId);
        
        if (!res.ok) return;

        const data = await res.json();
        const newVersion = data.tag_name;
        if (!newVersion) return;

        const oldVersion = cachedData?.version;
        const isNewUpdate = oldVersion && oldVersion !== newVersion;

        try {
            localStorage.setItem(cacheKey, JSON.stringify({ version: newVersion, timestamp: now }));
        } catch {}

        renderVersion(newVersion, isNewUpdate, oldVersion);
    } catch (err) {
        console.warn("Update check failed.");
    }
}

function diffVersions(oldV, newV) {
    let prefixLen = 0;
    while (prefixLen < oldV.length && prefixLen < newV.length && oldV[prefixLen] === newV[prefixLen]) {
        prefixLen++;
    }

    const oldRest = oldV.slice(prefixLen);
    const newRest = newV.slice(prefixLen);

    let suffixLen = 0;
    while (
        suffixLen < oldRest.length && suffixLen < newRest.length &&
        oldRest[oldRest.length - 1 - suffixLen] === newRest[newRest.length - 1 - suffixLen]
    ) {
        suffixLen++;
    }

    return {
        prefix: oldV.slice(0, prefixLen),
        oldMiddle: oldRest.slice(0, oldRest.length - suffixLen),
        newMiddle: newRest.slice(0, newRest.length - suffixLen),
        suffix: suffixLen > 0 ? oldRest.slice(oldRest.length - suffixLen) : ""
    };
}

function renderVersion(version, shouldAnimate = false, oldVersion = null) {
    const btn = document.getElementById("download-latest");
    if (!btn) return;
    btn.innerHTML = DOWNLOAD_ICON;
    btn.appendChild(document.createTextNode("Download Flowerstrap "));

    if (!shouldAnimate || !oldVersion || oldVersion === version) {
        btn.appendChild(document.createTextNode(version));
        return;
    }

    const { prefix, oldMiddle, newMiddle, suffix } = diffVersions(oldVersion, version);
    btn.appendChild(document.createTextNode(prefix));

    if (oldMiddle || newMiddle) {
        const roll = document.createElement("span");
        roll.className = "version-roll";

        const inner = document.createElement("span");
        inner.className = "version-roll-inner";

        const oldSpan = document.createElement("span");
        oldSpan.className = "version-roll-line";
        oldSpan.textContent = oldMiddle;

        const newSpan = document.createElement("span");
        newSpan.className = "version-roll-line";
        newSpan.textContent = newMiddle;

        inner.append(oldSpan, newSpan);
        roll.appendChild(inner);
        btn.appendChild(roll);

        requestAnimationFrame(() => {
            requestAnimationFrame(() => roll.classList.add("rolling"));
        });
    }

    btn.appendChild(document.createTextNode(suffix));
}

function handleRedirect() {
    const params = new URLSearchParams(location.search);
    const placeId = params.get("placeId");
    if (!placeId || !/^\d+$/.test(placeId)) return; 

    const overlay = document.createElement("div");
    overlay.id = "join-overlay";
    overlay.innerHTML = `
        <div class="loader"></div>
        <h1 id="join-status">Launching Roblox…</h1>
        <p style="opacity:.6;margin-bottom:20px;">Launching via Bubblestrap Protocol</p>
        <a id="manualJoinButton" class="btn" href="#" style="display:inline-flex">Click if not redirected</a>
    `;
    document.body.appendChild(overlay);
    const mainSite = document.getElementById("main-site");
    if (mainSite) mainSite.style.display = "none";
    const accessCode = params.get("accessCode");
    const gameInstanceId = params.get("gameInstanceId");
    let robloxUrl = `roblox://placeId=${placeId}`;
    if (accessCode) {
        robloxUrl += `&accessCode=${encodeURIComponent(accessCode)}`;
    } else if (gameInstanceId) {
        robloxUrl += `&gameInstanceId=${encodeURIComponent(gameInstanceId)}`;
    }

    document.getElementById("manualJoinButton").href = robloxUrl;
    setTimeout(() => { location.href = robloxUrl; }, 1500);
}

window.addEventListener("DOMContentLoaded", () => {
    initObserver();
    handleRedirect();
    setVersionText();
});
