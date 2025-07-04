$ = document.querySelector.bind(document);
$$ = document.querySelector.bind(document);
const musicPlayer = {
    NEXT_SONG: 1,
    PREV_SONG: -1,
    // Các element DOM - lấy từ HTML
    playlistContainer: $(".playlist"),
    playToggleBtn: $(".btn-toggle-play"),
    currentSongTitle: $(".current-song-title"),
    audioPlayer: $(".audio-player"),
    playIcon: $(".play-icon"),
    prevBtn: $(".btn-prev"),
    nextBtn: $(".btn-next"),
    loopBtn: $(".btn-loop"),
    moreBtn: $(".btn-more"),
    moreOption: $(".more-option"),
    shuffleBtn: $(".btn-shuffle"),
    shuffleBar: $(".shuffle-bar"),
    progressBar: $(".progress-bar"),
    speedBar: $(".speed-bar"),
    volumeBar: $(".volume-bar"),
    cdThumb: $(".cd-thumb"),
    cdThumbAnimate: null,
    volumeCurrent: 1,
    speedCurrent: 1,
    initialize() {
        this.renderPlaylist();
        this.setupCurrentSong();
        this.setupEventListeners();
    },
    songList: [
        {
            id: 1,
            filePath: "./songs/ChayNgayDi-SonTungMTP-5468704.mp3",
            title: "Chạy ngay đi",
            artist: "Sơn Tùng M-TP",
        },
        {
            id: 2,
            filePath: "./songs/GioThi-buitruonglinh-16952778.mp3",
            title: "Gió Thị",
            artist: "Bùi Trường Linh",
        },
        {
            id: 3,
            filePath: "./songs/HayTraoChoAnh-SonTungMTPSnoopDogg-6010660.mp3",
            title: "Hãy trao cho anh",
            artist: "Sơn Tùng M-TP ft. Snoop Dogg",
        },
        {
            id: 4,
            filePath: "./songs/MatKetNoi-DuongDomic-16783113.mp3",
            title: "Mất kết nối",
            artist: "Dương Domic",
        },
        {
            id: 5,
            filePath: "./songs/TaiSinh-TungDuong-16735175.mp3",
            title: "Tái sinh",
            artist: "Tùng Dương",
        },
        {
            id: 6,
            filePath: "./songs/camkythihoa.mp3",
            title: "Cầm kỳ thi họa",
            artist: "Bích Phương",
        },
        {
            id: 7,
            filePath: "./songs/ga san ca.mp3",
            title: "Gã săn cá",
            artist: "Lâm Bảo Ngọc",
        },
        {
            id: 8,
            filePath: "./songs/we be long .mp3",
            title: "we be long",
            artist: "Miu Lê",
        },
    ],
    currentSongIndex: 0,
    isPlay: false,
    isLoopMode: false,
    isShuffleMode: false,
    setupCurrentSong() {
        const song = this.getCurrentSong();
        this.currentSongTitle.textContent = song.title;
        this.audioPlayer.src = song.filePath;
        this.audioPlayer.oncanplay = () => {
            if (this.isPlay) {
                this.audioPlayer.play();
            }
        };
        this.volumeBar.value = this.volumeCurrent * 100;
        this.speedBar.value = this.speedCurrent * 50;
    },
    getCurrentSong() {
        return this.songList[this.currentSongIndex];
    },
    updateLoopButtonState() {
        this.audioPlayer.loop = this.isLoopMode;
        this.loopBtn.classList.toggle("active");
    },

    setupEventListeners() {
        this.playToggleBtn.onclick = this.togglePlayPause.bind(this);
        this.audioPlayer.onplay = () => {
            this.isPlay = true;
            this.playIcon.classList.remove("fa-play");
            this.playIcon.classList.add("fa-pause");
            if (!this.cdThumbAnimate) {
                this.cdThumbAnimate = this.cdThumb.animate(
                    [
                        { transform: `rotate(0deg)` },
                        { transform: `rotate(360deg)` },
                    ],
                    { duration: 10000, iterations: Infinity }
                );
            }
            this.cdThumbAnimate.play();
        };
        this.audioPlayer.onpause = () => {
            this.isPlay = false;
            this.playIcon.classList.remove("fa-pause");
            this.playIcon.classList.add("fa-play");
            this.cdThumbAnimate.pause();
        };
        this.audioPlayer.onended = () => {
            this.isPlay = true;
            this.handleSongNavigation(this.NEXT_SONG);
        };
        this.nextBtn.onclick = this.handleSongNavigation.bind(
            this,
            this.NEXT_SONG
        );
        this.prevBtn.onclick = this.handleSongNavigation.bind(
            this,
            this.PREV_SONG
        );
        this.loopBtn.onclick = () => {
            this.isLoopMode = !this.isLoopMode;
            this.updateLoopButtonState();
        };
        this.moreBtn.onclick = () => {
            this.moreBtn.classList.toggle("active");
            this.moreOption.classList.toggle("active");
        };
        document.body.onclick = (e) => {
            if (
                !this.moreOption.contains(e.target) &&
                !this.moreBtn.contains(e.target)
            ) {
                this.moreOption.classList.remove("active");
            }
        };

        this.shuffleBtn.onclick = () => {
            if (this.shuffleBar.checked) {
                this.shuffleBar.checked = false;
                this.isShuffleMode = false;
            } else {
                this.shuffleBar.checked = true;
                this.isShuffleMode = true;
            }
        };
        this.audioPlayer.ontimeupdate = () => {
            if (this.progressBar.seeking) return;

            const valueInput =
                (this.audioPlayer.currentTime / this.audioPlayer.duration) *
                100;
            this.progressBar.value = valueInput || 0;
        };
        this.progressBar.onmousedown = () => {
            this.progressBar.seeking = true;
        };

        this.progressBar.onmouseup = () => {
            const time =
                (this.progressBar.value / 100) * this.audioPlayer.duration;
            this.audioPlayer.currentTime = time;
            this.progressBar.seeking = false;
        };
        this.volumeBar.onmouseup = () => {
            this.volumeCurrent = this.volumeBar.value / 100;
            this.audioPlayer.volume = this.volumeCurrent;
        };
        this.speedBar.onmouseup = () => {
            this.speedCurrent = this.speedBar.value / 50;
            this.audioPlayer.playbackRate = this.speedCurrent;
        };

        const songs = this.playlistContainer.querySelectorAll(".song");
        songs.forEach((song) => {
            song.onclick = () => {
                if (song.dataset.index != this.currentSongIndex) {
                    this.isPlay = true;
                    this.currentSongIndex = Number(song.dataset.index);
                    this.initialize();
                }
            };
        });
    },

    togglePlayPause() {
        if (this.audioPlayer.paused) {
            this.audioPlayer.play();
        } else {
            this.audioPlayer.pause();
        }
    },
    handleSongNavigation(e) {
        this.isPlay = true;
        if (this.isShuffleMode) {
            this.getRundomCurrentIndex();
        } else {
            this.currentSongIndex = this.currentSongIndex + e;
        }
        this.currentSongIndex =
            (this.currentSongIndex + this.songList.length) %
            this.songList.length;
        this.initialize();
    },
    getRundomCurrentIndex() {
        let runDom = this.currentSongIndex;
        do {
            runDom = Math.floor(Math.random() * this.songList.length);
        } while (runDom === this.currentSongIndex);
        this.currentSongIndex = runDom;
    },
    renderPlaylist() {
        const playlistHTML = this.songList
            .map((song, index) => {
                const isCurrentSong = index === this.currentSongIndex;
                return `<div class="song ${
                    isCurrentSong ? "active" : ""
                }" data-index=${index}>
                    <div
                        class="thumb"
                        style="
                            background-image: url('https://i.ytimg.com/vi/jTLhQf5KJSc/maxresdefault.jpg');
                        "
                    ></div>
                    <div class="body">
                        <h3 class="title">${this.escapeHTML(song.title)}</h3>
                        <p class="author">${this.escapeHTML(song.artist)}</p>
                    </div>
                    
                    <div class="play-btn" data-index=${index}>
                        <i class="icon-play fas ${
                            isCurrentSong && this.isPlay
                                ? "fa-pause"
                                : "fa-play"
                        }"></i>
                    </div>
                </div>`;
            })
            .join("");
        this.playlistContainer.innerHTML = playlistHTML;
    },
    escapeHTML(html) {
        if (typeof html !== "string") {
            return "";
        }
        const tempDiv = document.createElement("div");
        tempDiv.textContent = html;
        return tempDiv.innerHTML;
    },
};
musicPlayer.initialize();
