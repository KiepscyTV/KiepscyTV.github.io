class SearchEngine {
  constructor(episodeList = []) {
    this.episodeList = episodeList;
  }

  compare(a, b) {
    if (a.score < b.score) {
      return 1;
    } else if (a.score > b.score) {
      return -1;
    } else {
      if (a.episode.name.length > b.episode.name.length) {
        return 1;
      } else if (a.episode.name.length < b.episode.name.length) {
        return -1;
      } else return 0;
    }
  }

  changeData(d) {
    this.episodeList = d;
  }

  searchForEpisode(input, maxOutputs = 5) {
    const o = [];
    const inpWords = input.split(" ");
    this.episodeList.forEach((s, seasonNumber) => {
      s.forEach((e, episodeNumber) => {
        let score = 0;
        inpWords.forEach((w) => {
          if (e.name.toLowerCase().includes(w.toLowerCase())) {
            score += w.length;
          }
        });
        if (score) {
          o.push({
            score: score,
            episode: e,
            s:seasonNumber,
            e:episodeNumber
          });
        }
      });
    });

    return o.sort(this.compare).splice(0, maxOutputs);
  }
}
