### Sorting Import Order Convention

- Sorts are split into two sections separated by a new line: node_module imports and relative imports

```js
// Package imports
import ... '@mypackage';
import ... 'react';
import ... 'react-router';

// Relative path imports
import ... '../../folder/file';
import ... './file-in-same-folder';
```
