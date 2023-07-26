const template = `
  <div class="player-container">
  <video type="video/mp4" src=""></video>
  <div class="back-button icon hidden">
    <span class="mdi mdi-keyboard-backspace"></span>
  </div>
  <div class="controls invisible">
    <div class="skip-intro-button">
      Skip intro
      <span class="mdi mdi-skip-forward"></span>
    </div>
    <div class="play-button icon">
      <span class="mdi mdi-play"></span>
      <span class="mdi mdi-pause hidden"></span>
    </div>
    <div class="next-button icon hidden">
      <span class="mdi mdi-skip-next"></span>
    </div>
    <div class="timeline-container">
      <input type="range" class="timeline" name="timeline" min="0" max="100" />
    </div>
    <div class="time">
      <p>10:12/23:12</p>
    </div>

    <div class="volume icon">
      <span class="mdi mdi-volume-high"></span>
      <span class="mdi mdi-volume-off hidden"></span>
    </div>

    <div class="volume-popup volume-popup-hidden">
      <input
        type="range"
        class="volume-slider"
        name="volume-slider"
        min="0"
        max="20"
      />
    </div>

    <div class="download-button icon hidden">
      <span class="mdi mdi-download"></span>
    </div>

    <div class="picture-in-picture-button icon hidden">
      <span class="mdi mdi-picture-in-picture-bottom-right"></span>
    </div>

    <div class="settings icon">
      <span class="mdi mdi-cog"></span>
    </div>
    <div class="settings-popup hidden">
      <p>
        <span class="mdi mdi-play-speed"></span>
        Speed
      </p>
      <p data-value="1" class="speed-option active-option">x1</p>
      <p data-value="1.25" class="speed-option">x1.25</p>
      <p data-value="1.5" class="speed-option">x1.5</p>
      <p data-value="1.75" class="speed-option">x1.75</p>
      <p data-value="2" class="speed-option">x2</p>
    </div>
    <div class="fullscreen icon">
      <span class="mdi mdi-fullscreen"></span>
      <span class="mdi mdi-fullscreen-exit hidden"></span>
    </div>
  </div>
  <div class="endscreen hidden">
    <div class="end-icon replay-end-button">
      <span class="mdi mdi-replay"></span>
    </div>
    <div class="end-icon next-end-button">
      <span class="mdi mdi-skip-next"></span>
    </div>
  </div>
  </div>
  `;

export class Player extends HTMLElement {
  static TAG = "bp-player";
  constructor() {
    super();
    this.processHTMLAtributes();

    this.innerHTML = template;
    this.container = this.querySelector(".player-container");
    this.video = this.querySelector("video");
    this.video.playbackRate = this.playbackSpeed;
    this.controls = this.querySelector(".controls");
    this.timeline = this.querySelector(".timeline");
    this.timeline.max = this.timelineSteps;
    this.settings = this.querySelector(".settings");
    this.settingsPopup = this.querySelector(".settings-popup");
    this.controls.querySelector(".volume-slider").value =
      this.controls.querySelector(".volume-slider").max;
    this.isTouchScreen =
      "ontouchstart" in document.documentElement ? true : false;
    this.hideControlsTimeout;
    this.setupListeners();
    this.updateTime();
    this.updateRange(this.controls.querySelector(".volume-slider"));

  }

  processHTMLAtributes() {
    this.url = this.dataset["url"];
    this.timelineSteps = this.dataset["timelineSteps"] || 800;
    this.idleTime = parseInt(this.dataset["idleTime"] || 2000);
    this.fullscreenDisabled = this.dataset["fullscreenDisabled"] != undefined;
    this.pictureInPictureEnabled =
      this.dataset["pictureInPicture"] != undefined;
    this.playbackSpeed = 1;
  }

  setURL(url) {
    this.video.src = url;
    this.updateTime();
    this.updatePlayButton();
  }

  setIntroTime(time) {
    this.introTime = time;
    this.querySelector(".skip-intro-button").classList.remove("hidden");
  }

  setSkipCallback(callback) {
    this.skipAction = callback;
    if (callback) {
      this.controls.querySelector(".next-button").classList.remove("hidden");
    } else {
      this.controls.querySelector(".next-button").classList.add("hidden");
    }
  }

  setUpdateCallback(callback, frequency = 30) {
    this.updateCallback = {
      function: callback,
      frequency: frequency,
      counter: 0,
    };
  }

  togglePlay() {
    if (this.video.paused) {
      this.video.play();
    } else {
      this.video.pause();
    }
    this.updatePlayButton();
  }

  updatePlayButton() {
    if (this.video.paused) {
      this.controls
        .querySelectorAll(".play-button *")[1]
        .classList.add("hidden");
      this.controls
        .querySelectorAll(".play-button *")[0]
        .classList.remove("hidden");
    } else {
      this.controls
        .querySelectorAll(".play-button *")[0]
        .classList.add("hidden");
      this.controls
        .querySelectorAll(".play-button *")[1]
        .classList.remove("hidden");
    }
  }

  toggleFullscreen() {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else if (document.webkitFullscreenElement) {
      document.webkitExitFullscreen();
    } else if (this.container.webkitRequestFullscreen) {
      // Need this to support Safari
      this.container.webkitRequestFullscreen();
      screen.orientation
        .lock("landscape")
        // .then((res) => console.log(res))
        .catch((err) => console.error(err));
    } else {
      this.container.requestFullscreen();
      screen.orientation
        .lock("landscape")
        // .then((res) => console.log(res))
        .catch((err) => console.error(err));
    }
  }

  updateRange(target) {
    target.style.backgroundSize =
      ((target.value - target.min) * 100) / (target.max - target.min) +
      "% 100%";
  }

  updateTime() {
    this.updatePlayButton();
    this.timeline.value = Math.floor(
      (this.video.currentTime / this.video.duration) * this.timeline.max
    );
    if (!this.video.duration) this.timeline.value = 0;

    this.querySelector(".time").innerHTML =
      this.parseTime(this.video.currentTime) +
      "/" +
      this.parseTime(this.video.duration | 0);

    if (this.introTime && this.introTime > this.video.currentTime) {
      this.querySelector(".skip-intro-button").classList.remove("hidden");
    } else {
      this.querySelector(".skip-intro-button").classList.add("hidden");
    }
    this.updateRange(this.timeline);

    if (this.updateCallback) {
      if (this.updateCallback.counter >= this.updateCallback.frequency) {
        this.updateCallback.function();
        this.updateCallback.counter = 0;

      } else {
        this.updateCallback.counter++;
      }
    }

  }

  getCurrentTime() {
    return this.video.currentTime;
  }

  setCurrentTime(t) {
    if (t) this.video.currentTime = t;
  }

  hideControls() {
    this.controls.classList.add("invisible");
    this.video.style.cursor = "none";
    this.controls
      .querySelector(".volume-popup")
      .classList.add("volume-popup-hidden");
    this.settingsPopup.classList.add("hidden");
    this.querySelector('.back-button').classList.add('hidden');
  }
  showControls() {
    this.controls.classList.remove("invisible");
    this.video.style.cursor = null;
    if(this.isTouchScreen && !!document.fullscreenElement){
    this.querySelector('.back-button').classList.remove('hidden');
    }
  }

  toggleMute() {
    if (this.video.volume == 0) {
      this.video.volume = this.oldVolume;
      this.controls.querySelectorAll(".volume *")[0].classList.remove("hidden");
      this.controls.querySelectorAll(".volume *")[1].classList.add("hidden");
    } else {
      this.oldVolume = this.video.volume;
      this.video.volume = 0;

      this.controls.querySelectorAll(".volume *")[1].classList.remove("hidden");
      this.controls.querySelectorAll(".volume *")[0].classList.add("hidden");
    }

    this.controls.querySelector(".volume-slider").value =
      this.controls.querySelector(".volume-slider").max * this.video.volume;
  }

  setupListeners() {
    this.video.addEventListener("load", () => {
      this.updateTime();
    });

    //pouse / play buttons

    this.video.addEventListener("click", () => {
      if (!this.isTouchScreen) this.togglePlay();
    });
    this.querySelector(".play-button").addEventListener("click", () => {
      this.togglePlay();
    });
    this.video.addEventListener("touchend", () => {
      if (!this.controls.classList.contains("invisible")) {
        this.togglePlay();
      }
    });

    //fullscreen
    if (!this.fullscreenDisabled) {
      this.querySelector(".fullscreen").addEventListener("click", () => {
        this.toggleFullscreen();
      });
    } else {
      this.querySelector(".fullscreen").classList.add("hidden");
    }

    //volume
    if (window.screen.width > 600) {

    }
    this.controls.querySelector(".volume").addEventListener("mouseover", () => {
      if (window.screen.width > 600) {
        this.controls
          .querySelector(".volume-popup")
          .classList.toggle("volume-popup-hidden");
      } else {
        this.toggleMute();
      }
    });

    this.controls
      .querySelector(".volume-slider")
      .addEventListener("input", () => {
        this.video.volume =
          this.controls.querySelector(".volume-slider").value /
          this.controls.querySelector(".volume-slider").max;

        this.updateRange(this.controls.querySelector(".volume-slider"));
        this.controls.querySelector(".volume-slider").blur();
      });

    //hiding / showing controls

    this.controls.addEventListener("touchend", () => {
      if (!!this.hideControlsTimeout) {
        clearInterval(this.hideControlsTimeout);
      }
      this.showControls();
      this.hideControlsTimeout = setTimeout(() => {
        this.hideControls();
      }, this.idleTime);
    });

    this.video.addEventListener("mousemove", () => {
      if (!!this.hideControlsTimeout) {
        clearInterval(this.hideControlsTimeout);
      }
      this.showControls();
      this.hideControlsTimeout = setTimeout(() => {
        this.hideControls();
      }, this.idleTime);
    });
    this.controls.addEventListener("mouseover", () => {
      if (!!this.hideControlsTimeout) {
        clearInterval(this.hideControlsTimeout);
      }
      this.showControls();
    });
    this.controls.addEventListener("mouseleave", () => {
      this.hideControlsTimeout = setTimeout(() => {
        this.hideControls();
      }, this.idleTime);
    });

    //time update

    this.video.addEventListener("timeupdate", () => {
      this.updateTime();
    });

    this.timeline.addEventListener("mousedown", () => {
      clearInterval(this.hideControlsTimeout);

      this.wasPaused = this.video.paused;
      this.video.pause();
    });
    this.timeline.addEventListener("input", () => {
      let newTime = this.timeline.value / this.timeline.max;
      this.updateRange(this.timeline);
      this.video.currentTime = Math.round(this.video.duration * newTime);
    });
    this.timeline.addEventListener("mouseup", () => {
      if (!this.wasPaused) this.video.play();
      this.timeline.blur();
      this.hideControlsTimeout = setTimeout(() => {
        this.hideControls();
      }, this.idleTime);
    });

    //settings popup
    this.settings.addEventListener("click", () => {
      this.settingsPopup.classList.toggle("hidden");
    });

    //playback speed
    this.settingsPopup.querySelectorAll(".speed-option").forEach((o) => {
      o.addEventListener("click", () => {
        this.settingsPopup.querySelectorAll(".speed-option").forEach((c) => {
          c.classList.remove("active-option");
        });
        o.classList.add("active-option");
        this.video.playbackRate = parseFloat(o.dataset["value"]);
      });
    });

    //keys

    document.addEventListener("keydown", (e) => {
      switch (e.key) {
        case " ":
          e.preventDefault();
          this.togglePlay();
          break;
        case "ArrowLeft":
          e.preventDefault();
          this.video.currentTime -= 5;
          break;
        case "ArrowRight":
          e.preventDefault();
          this.video.currentTime += 5;
          break;
        case "f":
          e.preventDefault();
          this.toggleFullscreen();
          break;
        case "m":
          e.preventDefault();
          this.toggleMute();
          break;
      }
    });

    //next button

    this.controls
      .querySelector(".next-button")
      .addEventListener("click", () => {
        this.skipAction();
      });

    //download button
    this.controls
      .querySelector(".download-button")
      .addEventListener("click", () => {
        this.downloadImage();
      });

    //picture in picture
    if (this.video.requestPictureInPicture) {
      if (this.pictureInPictureEnabled) {
        this.controls
          .querySelector(".picture-in-picture-button")
          .classList.remove("hidden");
        this.controls
          .querySelector(".picture-in-picture-button")
          .addEventListener("click", () => {
            this.video.requestPictureInPicture();
          });
      }
    }

    //endscreen buttons

    this.querySelector(".replay-end-button").addEventListener("click", () => {
      this.video.currentTime = 0;
      this.video.play();
      this.querySelector(".endscreen").classList.add("hidden");
    });

    this.querySelector(".next-end-button").addEventListener("click", () => {
      this.skipAction();
      this.querySelector(".endscreen").classList.add("hidden");
    });

    //on ended
    this.video.addEventListener("ended", () => {
      this.querySelector(".endscreen").classList.remove("hidden");
    });

    this.querySelector(".skip-intro-button").addEventListener("click", () => {
      this.video.currentTime = this.introTime;
      this.video.play();
    });

    //touchscreen back button
    this.querySelector('.back-button').addEventListener('click', 
      this.toggleFullscreen
    )
  }

  parseTime(t) {
    let sec_num = parseInt(t, 10);
    let min = Math.floor(sec_num / 60);
    let sec = sec_num - min * 60;
    if (sec < 10) {
      sec = "0" + sec;
    }
    if (min < 10) {
      min = "0" + min;
    }
    return min + ":" + sec;
  }
}

customElements.define(Player.TAG, Player);
