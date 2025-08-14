// ==UserScript==
// @name         YT Mix URL Collector
// @namespace    https://github.com/fajrulcore/tampermonkey-scripts/tree/main/yt-mix-collector
// @version      1.1
// @description  Collect all video URLs from YouTube Mix playlist
// @author       fajrulcore
// @match        https://www.youtube.com/watch*
// @updateURL    https://raw.githubusercontent.com/fajrulcore/tampermonkey-scripts/main/yt-mix-url-collector/mix-collector.user.js
// @downloadURL  https://raw.githubusercontent.com/fajrulcore/tampermonkey-scripts/main/yt-mix-url-collector/mix-collector.user.js
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    function cleanURL(href) {
        const match = href.match(/\/watch\?v=([^&]+)/);
        return match ? `https://www.youtube.com/watch?v=${match[1]}` : null;
    }

    function fetchAllURL() {
        // Playlist Mix links ada di panel samping
        const links = document.querySelectorAll('a#wc-endpoint.yt-simple-endpoint.style-scope.ytd-playlist-panel-video-renderer');
        const urls = Array.from(links)
            .map(link => cleanURL(link.getAttribute('href')))
            .filter(url => url !== null);
        return [...new Set(urls)];
    }

    function downloadTxt(dataArray, namaFile = 'mix-url.txt') {
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

    function button() {
        const tombol = document.createElement('button');
        tombol.textContent = '📥 Download Mix URL';
        Object.assign(tombol.style, {
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            zIndex: '9999',
            padding: '10px 15px',
            backgroundColor: '#ff0000',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(0,0,0,0.3)'
        });

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

    window.addEventListener('load', () => {
        setTimeout(button, 3000);
    });
})();
