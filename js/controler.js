class Controler {
  constructor(playerid, e = 0, s = 0) {
    4;
    this.last = window.localStorage.getItem("last");
    if (!!this.last) {
      this.last = this.last.split("-");
      e = this.last[1];
      s = this.last[0];
    }
    this.episode = parseInt(e);
    this.season = parseInt(s);
    this.player = document.querySelector(playerid);
  }

  getLinks() {
    return new Promise((resolve, reject) => {
      fetch("bin/episodes.json")

        .then((response) => response.json())
        .then((el) => {
          console.log(el);
          return el;
        })
        .then((data) => (this.episodeList = data["episodes"]))

        .then((el) => resolve(el))
        .catch((e) => reject(e));
    });
  }

  getEpisodeList(){
    return this.episodeList;
  }

  getCurrentEpisode() {
    return this.episodeList[this.season][this.episode];
  }

  isNextEpisode() {
    if (this.episodeList[this.season][this.episode + 1]) {
      return 1;
    } else if (this.episodeList[this.season + 1]) {
      return 2;
    } else {
      return 0;
    }
  }

  setEpisode(e, s = this.season) {
    this.episode = e;
    this.season = s;
    this.loadEpisode();
  }

  loadEpisode() {
    document.querySelector("#episodeTitle").innerHTML =
      this.getCurrentEpisode()["name"]
    this.player.setURL(this.getCurrentEpisode()["url"]);
    this.player.setIntroTime(this.getCurrentEpisode()["intro"]);

    this.player.setCurrentTime(
      window.localStorage.getItem(this.season + "-" + this.episode)
    );
    window.localStorage.setItem("last", this.season + "-" + this.episode);
    this.player.setUpdateCallback(() => {
      window.localStorage.setItem(
        this.season + "-" + this.episode,
        this.player.v.currentTime
      );
    }, 30);
    if (this.isNextEpisode()) {
      this.player.setSkipCallback(() => {
        if (this.isNextEpisode() == 1) {
          this.episode++;
        } else if (this.isNextEpisode() == 2) {
          this.season++;
          this.episode = 0;
        }
        this.loadEpisode();
        this.player.togglePlay();
      });
    } else {
      this.player.setSkipCallback(null);
    }
  }
}
