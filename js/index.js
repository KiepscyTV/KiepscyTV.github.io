const c = new Controler("#kiepskiPlayer");
const se = new SearchEngine();
c.getLinks()
  .then((el) => {
    se.changeData(el);
    displaySeasonList(el);
    console.log(el);
  })
  .then(() => c.loadEpisode())
  .catch((e) => console.error(e));



// document.querySelector("#odpalaj").addEventListener("click", () => {
//   c.setEpisode(
//     parseInt(document.querySelector("#odc").value),
//     parseInt(document.querySelector("#sezon").value)
//   );
// });

document.querySelectorAll(".skip-time input").forEach((e) => {
  e.addEventListener("click", () => {
    c.player.v.currentTime = e.value;
    c.getCurrentEpisode()["intro"] = e.value;
  });
});


document.querySelector('#searchbar').addEventListener('input', (e)=>{

  let result = se.searchForEpisode(e.target.value);
  console.log(result);
  if (!!e.target.value){
    displayepisdeList(result);
  }else{
    displaySeasonList(c.getEpisodeList());
  }
  
})


// c.episodeList.forEach(
//   (e)=>{
//     console.log(e);
//   }
// )

let displayepisdeList = (l) => {
  console.log(l);
  document.querySelector("#episodes").innerHTML = '';
  let panel = document.createElement("div");
  panel.classList.add("search-panel");
  document.querySelector("#episodes").append(panel);

  let ol = document.createElement("ul");
  panel.append(ol);
  l.forEach((episode) => {
    let e = document.createElement("li");
    e.innerText = episode.episode.name;

    e.addEventListener("click", ()=>{
      c.setEpisode(episode.e, episode.s);
      c.player.scrollIntoView();
    })

    ol.append(e);
  })

}

let displaySeasonList = (l) => {
  document.querySelector("#episodes").innerHTML = '';

  l.forEach((el, seasonNumber)=>{
    let s = document.createElement("button");
    console.log(s.innerHTML);
    s.innerHTML ="Sezon "+(seasonNumber+1);
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

      e.addEventListener("click", ()=>{
        c.setEpisode(num, seasonNumber);
        c.player.scrollIntoView();
      })

      ol.append(e);
    })
  })

  var acc = document.getElementsByClassName("accordion");
var i;

for (i = 0; i < acc.length; i++) {
  acc[i].addEventListener("click", function() {
    this.classList.toggle("active");
    var panel = this.nextElementSibling;
    if (panel.style.maxHeight) {
      panel.style.maxHeight = null;
    } else {
      panel.style.maxHeight = panel.scrollHeight + "px";
    }
  });
}
}

