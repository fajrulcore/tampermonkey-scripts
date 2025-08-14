// ==UserScript==
// @name         YT Whitelist Collector (desktop)
// @namespace    https://github.com/fajrulcore/tampermonkey-scripts
// @version      1.2
// @description  Collect whitelist links from YouTube Watch Later easily, support version for Chrome & Firefox Desktop
// @author       fajrulcore
// @match        https://www.youtube.com/playlist?list=WL
// @updateURL    https://raw.githubusercontent.com/fajrulcore/tampermonkey-scripts/main/yt-whitelist-collector/collector.user.js
// @downloadURL  https://raw.githubusercontent.com/fajrulcore/tampermonkey-scripts/main/yt-whitelist-collector/collector.user.js
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    // Function to clean URLs to https://www.youtube.com/watch?v=...
    function cleanURL(href) {
        const match = href.match(/\/watch\?v=([^&]+)/);
        return match ? `https://www.youtube.com/watch?v=${match[1]}` : null;
    }

    // Function to retrieve all URLs
    function fetchAllURL() {
        const links = document.querySelectorAll('a#video-title');
        const urls = Array.from(links)
            .map(link => cleanURL(link.getAttribute('href')))
            .filter(url => url !== null);
        return urls;
    }

    // Functions for creating and downloading files
    function downloadTxt(dataArray, namaFile = 'whitelist-url.txt') {
        const blob = new Blob([dataArray.join('\n')], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = namaFile;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

        URL.revokeObjectURL(url);
    }

    // Add a button to a YouTube page
    function button() {
        const tombol = document.createElement('button');
        tombol.textContent = '📥 Download URL WL';
        tombol.style.position = 'fixed';
        tombol.style.bottom = '20px';
        tombol.style.right = '20px';
        tombol.style.zIndex = '9999';
        tombol.style.padding = '10px 15px';
        tombol.style.backgroundColor = '#ff0000';
        tombol.style.color = '#fff';
        tombol.style.border = 'none';
        tombol.style.borderRadius = '8px';
        tombol.style.cursor = 'pointer';
        tombol.style.boxShadow = '0 2px 8px rgba(0,0,0,0.3)';

        tombol.onclick = () => {
            const urls = fetchAllURL();
            if (urls.length > 0) {
                downloadTxt(urls);
            } else {
                alert('❌ No URL found.');
            }
        };

        document.body.appendChild(tombol);
    }

    // Wait for the page to finish loading
    window.addEventListener('load', () => {
        setTimeout(button, 3000); // Add button after 3 seconds
    });
})();

