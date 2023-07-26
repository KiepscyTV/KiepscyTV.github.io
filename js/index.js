const videoController = new Controler("#kiepskiPlayer");
const searchEngine = new SearchEngine();

videoController
  .getLinks()
  .then((el) => {
    searchEngine.setEpisodeList(el);
    displaySeasonList(el);
  })
  .then(() => videoController.loadEpisode())
  .catch((e) => console.error(e));

document.querySelectorAll(".skip-time input").forEach((e) => {
  e.addEventListener("click", () => {
    videoController.player.v.currentTime = e.value;
    videoController.getCurrentEpisode()["intro"] = e.value;
  });
});

document.querySelector("#searchbar").addEventListener("input", (e) => {
  let result = searchEngine.searchForEpisode(e.target.value);
  
  if (!!e.target.value) {
    displayepisdeList(result);
  } else {
    displaySeasonList(videoController.getEpisodeList());
  }
});

let displayepisdeList = (l) => {
  console.log(l);
  document.querySelector("#episodes").innerHTML = "";
  let panel = document.createElement("div");
  panel.classList.add("search-panel");
  document.querySelector("#episodes").append(panel);

  let ol = document.createElement("ul");
  panel.append(ol);
  l.forEach((episode) => {
    let e = document.createElement("li");
    e.innerText = episode.episode.name;

    e.addEventListener("click", () => {
      videoController.setEpisode(episode.e, episode.s);
      videoController.player.scrollIntoView();
    });

    ol.append(e);
  });
};

let displaySeasonList = (l) => {
  document.querySelector("#episodes").innerHTML = "";

  l.forEach((el, seasonNumber) => {
    let s = document.createElement("button");
    s.innerHTML = "Sezon " + (seasonNumber + 1);
    s.classList.add("accordion");
    document.querySelector("#episodes").append(s);
    let panel = document.createElement("div");
    panel.classList.add("panel");
    document.querySelector("#episodes").append(panel);
    let ol = document.createElement("ul");
    panel.append(ol);
    el.forEach((episode, num) => {
      let e = document.createElement("li");
      e.innerText = episode.name;

      e.addEventListener("click", () => {
        videoController.setEpisode(num, seasonNumber);
        videoController.player.scrollIntoView();
      });

      ol.append(e);
    });
  });

  var acc = document.getElementsByClassName("accordion");
  var i;

  for (i = 0; i < acc.length; i++) {
    acc[i].addEventListener("click", function () {
      this.classList.toggle("active");
      var panel = this.nextElementSibling;
      if (panel.style.maxHeight) {
        panel.style.maxHeight = null;
      } else {
        panel.style.maxHeight = panel.scrollHeight + "px";
      }
    });
  }
};

let intro = new Intro();
intro.singIntro();
