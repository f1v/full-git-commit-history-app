const fs = require('fs');
fs.writeFileSync(
  './.env',
  `REACT_APP_GITHUB_TOKEN=${process.env.REACT_APP_GITHUB_TOKEN}`,
);
