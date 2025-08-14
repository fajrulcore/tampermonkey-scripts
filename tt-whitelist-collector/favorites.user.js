// ==UserScript==
// @name         TikTok Favorites URL Collector
// @namespace    https://github.com/fajrulcore/tiktok-url-collector
// @version      1.1
// @description  Collect favorite TikTok video links easily on Chrome & Firefox Desktop
// @author       fajrulcore
// @match        https://www.tiktok.com/*
// @updateURL    https://raw.githubusercontent.com/fajrulcore/tt-whitelist-collector/main/favorites.user.js
// @downloadURL  https://raw.githubusercontent.com/fajrulcore/tt-whitelist-collector/main/favorites.user.js
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    function fetchAllURL() {
        const div = document.querySelector('div[data-e2e="favorites-item-list"][mode="compact"].css-gamknx-DivVideoFeedV2.ecyq5ls0');

        if (div) {
            const links = div.querySelectorAll('a');
            const urls = Array.from(links)
                .map(link => link.href)
                .filter(href => href.startsWith('https://www.tiktok.com/'));
            return urls;
        } else {
            return [];
        }
    }

    function downloadTxt(dataArray, fileName = 'tiktok-url.txt') {
        const blob = new Blob([dataArray.join('\n')], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

        URL.revokeObjectURL(url);
    }

    function CreateButton() {
        const button = document.createElement('button');
        button.textContent = 'Download URL';
        Object.assign(button.style, {
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            zIndex: '9999',
            padding: '10px 15px',
            backgroundColor: '#ff0050',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(0,0,0,0.3)'
        });

        button.onclick = () => {
            const urls = fetchAllURL();
            if (urls.length > 0) {
                downloadTxt(urls);
            } else {
                alert('No TikTok URLs found in targeted elements.');
            }
        };

        document.body.appendChild(button);
    }

    window.addEventListener('load', () => {
        setTimeout(CreateButton, 3000);
    });

})();
