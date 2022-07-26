const fs = require('fs')

fs.readFile('test/40.html', (err, schedule) => {
  if (err) throw err;

  const lodash = require('lodash');
  const cheerio = require('cheerio');

  const $ = cheerio.load(schedule);

  const bodyRows = $('#runTable tbody tr');
  const rows = lodash.reduce(bodyRows, (acc, row) => {
    const tdNodes = lodash.filter(row.children, { name: 'td' });
    const dataNodes = lodash.map(tdNodes, node => {
      const textNodes = lodash.filter(node.children, { type: 'text' });
      const dataNodes = lodash.map(textNodes, node => node.data);
      const joinedNodes = dataNodes.join('');
      return joinedNodes.trim();
    });

    const attrs = row.attribs;
    if (lodash.has(attrs, 'class') && lodash.includes(attrs.class, 'second-row')) {
      const head = lodash.initial(acc);
      const last = lodash.last(acc);

      const keys = ['length', 'category', 'host'];
      const run = lodash.zipObject(keys, dataNodes);

      return lodash.concat(head, lodash.assign({}, last, run));
    } else {
      const keys = ['time', 'game', 'runner', 'setup'];
      const run = lodash.zipObject(keys, dataNodes);

      return lodash.concat(acc, run);
    }
  }, []);

//   console.log('rows', rows);
});
