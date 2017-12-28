const request = require('superagent');

const apiUrl = 'https://api.discogs.com';

const core = {};

core.extractWantlist = username => {
  return new Promise((resolve, reject) => {
    if (!username) {
      return reject('Username is required!');
    }

    request.get(`${apiUrl}/users/${username}/wants`)
      .then(res => {
        const list = res.body.wants
          .reduce((memo, item) => {
            const info = item.basic_information;
            const artists = info.artists.map(artist => artist.name).join(', ');
            const name = `${artists} - ${info.title}`;

            const existed = memo.find(i => i.name === name);

            if (!existed) {
              memo.push({name, years: [info.year]});
            } else if (Array.isArray(existed.years)) {
              if (existed.years.indexOf(info.year) === -1) {
                existed.years.push(info.year)
              }
            }

            return memo;
          }, [])
          .map(item => {
            return `${item.name} (${item.years.sort().join(', ')})`
          })
          .sort()
          .join('\n');

        resolve(list);
      })
      .catch(err => reject(err));
  });
};

module.exports = core;
