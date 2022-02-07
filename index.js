// const getLinks = async () => {
//   try {
//     await fetch("episodes.json")
//       .then((response) => response.json())
//       .then((data) => loadEpisode(data));
//   } catch (e) {
//     console.log("Ups, something went wrong.");
//     console.error(e);
//   }
// };

// const loadEpisode = (e) => {
//   console.log(e);
//   document.querySelector("#screen").src = e["SEZON 1"][0]["url"];
// };

class Player {
  constructor(odc, season) {
    this.odc = odc;
    this.season = season;
    this.getLinks();
  }

  getLinks = async () => {
    try {
      await fetch("episodes.json")
        .then((response) => response.json())
        .then((data) => this.episodes = data)
        .finally(() => this.loadEpisode());
    } catch (e) {
      console.log("Ups, something went wrong.");
      console.error(e);
    }
  };

  loadEpisode = () => {
    document.querySelector("#episodeTitle").innerHTML = this.episodes[this.season][this.odc]["name"];
    document.querySelector("#screen").src = this.episodes[this.season][this.odc]["url"];
  };

  next = () => {
    this.odc++;
    this.loadEpisode()
  }

  previous = () => {
    this.odc--;
    this.loadEpisode()
  }

}

const p = new Player(0, 'SEZON 1');

document.querySelector('#nextEpisode').addEventListener('click', p.next);
document.querySelector('#previousEpisode').addEventListener('click', p.previous);