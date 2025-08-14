// ==UserScript==
// @name         YT Whitelist Collector (Android)
// @namespace    https://github.com/fajrulcore/tampermonkey-scripts/tree/main/yt-whitelist-collector
// @version      1.2
// @description  Collect whitelist links from YouTube Watch Later easily, support version for Firefox Android
// @author       fajrulcore
// @match        https://m.youtube.com/playlist?list=WL
// @updateURL    https://raw.githubusercontent.com/fajrulcore/tampermonkey-scripts/main/yt-whitelist-collector/fireandro.user.js
// @downloadURL  https://raw.githubusercontent.com/fajrulcore/tampermonkey-scripts/main/yt-whitelist-collector/fireandro.user.js
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    // Extract the clean YouTube video URL from a link
    function cleanURL(href) {
        const match = href.match(/\/watch\?v=([^&]+)/);
        return match ? `https://www.youtube.com/watch?v=${match[1]}` : null;
    }

    // Fetch all video URLs from the current page
    function fetchAllURL() {
        let links;
        if (location.host.startsWith("m.")) {
            links = document.querySelectorAll('a[href^="/watch?v="]');
        } else {
            links = document.querySelectorAll('a#video-title');
        }

        const urls = Array.from(links)
            .map(link => cleanURL(link.getAttribute('href')))
            .filter(url => url !== null);

        return [...new Set(urls)]; // Remove duplicates
    }

    // Open collected URLs in a new tab with download option
    function openInNewTab(dataArray) {
        const urlList = dataArray.join('\n');
        const base64Data = btoa(unescape(encodeURIComponent(urlList)));
    
        const newTab = window.open('', '_blank');
        newTab.document.write(`
            <html>
            <head>
                <title>Download Whitelist URLs</title>
                <meta name="viewport" content="width=device-width, initial-scale=1">
                <style>
                    body {
                        font-family: sans-serif;
                        background: #000;
                        color: #fff;
                        padding: 20px;
                        text-align: center;
                        margin: 0;
                    }
                    h2 {
                        color: #ff0000;
                        font-size: 1.5em;
                    }
                    textarea {
                        width: 100%;
                        height: 200px;
                        font-size: 14px;
                        margin-bottom: 20px;
                        background: #1e1e1e;
                        color: #fff;
                        border: 1px solid #333;
                        border-radius: 6px;
                        padding: 10px;
                        box-sizing: border-box;
                    }
                    #whitelist-btn {
                        display: none;
                    }
                    .custombutton {
                        width: 100%;
                        padding: 12px;
                        font-size: 16px;
                        border-radius: 6px;
                        cursor: pointer;
                        border: none;
                        margin: 5px 0;
                        transition: background 0.3s;
                        box-sizing: border-box;
                    }
                    .download0 {
                        background: #ff0000;
                        color: white;
                    }
                    .download0:hover {
                        background: #cc0000;
                    }
                    .close {
                        background: #333;
                        color: white;
                    }
                    .close:hover {
                        background: #444;
                    }
                    @media (min-width: 600px) {
                        button {
                            width: auto;
                            display: inline-block;
                        }
                    }
                </style>
            </head>
            <body>
                <h2>Whitelist URLs (${dataArray.length} URLs)</h2>
                <textarea readonly>${urlList}</textarea><br>
                <button class="download0 custombutton" onclick="downloadFile()">Download .txt</button>
                <button class="close custombutton" onclick="window.close()">Close Tab</button>
                <script>
                    function downloadFile() {
                        const link = document.createElement('a');
                        link.href = 'data:text/plain;base64,${base64Data}';
                        link.download = 'whitelist-url.txt';
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                    }
                </script>
            </body>
            </html>
        `);
        newTab.document.close();
    }
    
    // Add floating download button to the page
    function addButton() {
        if (document.getElementById('whitelist-btn')) return;

        const button = document.createElement('button');
        button.id = 'whitelist-btn';
        button.textContent = '📥 Download All WL';
        button.style.position = 'fixed';
        button.style.bottom = '20px';
        button.style.right = '20px';
        button.style.zIndex = '999999';
        button.style.padding = '12px 18px';
        button.style.backgroundColor = '#ff0000';
        button.style.color = '#fff';
        button.style.border = 'none';
        button.style.borderRadius = '8px';
        button.style.cursor = 'pointer';
        button.style.fontSize = '14px';

        button.onclick = () => {
            const urls = fetchAllURL();
            if (urls.length > 0) {
                openInNewTab(urls);
            } else {
                alert('❌ No URLs found.');
            }
        };

        document.body.appendChild(button);
    }

    // Check if the current page is the Watch Later playlist and add the button
    setInterval(() => {
        if (location.href.includes('playlist?list=WL')) {
            addButton();
        }
    }, 1000);

})();
