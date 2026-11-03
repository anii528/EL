function saveBookConfig(data) {
    localStorage.setItem('book_config', JSON.stringify(data));
}

function getBookConfig() {
    const data = localStorage.getItem('book_config');
    return data ? JSON.parse(data) : { title: 'BRAILLE_BOOK_01', lineTime: 3000, totalPages: 4 };
}

function saveAudioTrack(pageNum, event) {
    const file = event.target.files[0];
    if (file) {
        console.log(`Audio stored for page ${pageNum}: ${file.name}`);
    }
}

function toggleStream() {
    const ip = document.getElementById('camIp').value.trim();
    const box = document.getElementById('streamBox');
    const feed = document.getElementById('streamFeed');

    if (!ip) {
        alert("Enter ESP32 IP address first!");
        return;
    }

    if (box.style.display === 'none') {
        feed.src = `http://${ip}:81/stream`;
        box.style.display = 'block';
    } else {
        feed.src = "";
        box.style.display = 'none';
    }
}

async function downloadSDZip() {
    const config = getBookConfig();
    const zip = new JSZip();
    const folder = zip.folder("books").folder(config.title);

    let indexContent = `[BOOK_METADATA]\nTITLE=${config.title}\nTOTAL_PAGES=${config.totalPages}\nBASE_LINE_DURATION_MS=${config.lineTime}\n\n`;

    for (let p = 1; p <= config.totalPages; p++) {
        indexContent += `[PAGE_${p}]\nAUDIO_FILE=page${p}.mp3\nTOTAL_LINES=3\nLINE_TIMESTAMPS_MS=0,${config.lineTime},${config.lineTime * 2}\nTEXT_CONTENT="Sample Braille page content"\n\n`;
    }

    folder.file("index.txt", indexContent);

    const blob = await zip.generateAsync({ type: "blob" });
    saveAs(blob, `${config.title}_SD_Package.zip`);
}