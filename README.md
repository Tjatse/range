range [![NPM version](https://badge.fury.io/js/tiny-range.svg)](http://badge.fury.io/js/tiny-range) [![Build Status](https://travis-ci.org/Tjatse/range.svg?branch=master)](https://travis-ci.org/Tjatse/range)
=====

Range parser that parse range from string, e.g. "0, 1, 7~8, 9-10, 100~105" -> [[0, 1], [7, 10], [100, 105]]

# Features
- Verify input.
- Automatic merge overlapped range.
- Wrap continuous numbers into range.

# Installation
```bash
$ npm install tiny-range
```

# Usage
```javascript
var range = require('tiny-range');

var result = range.parse('0, 1, 7~8, 9-10, 100~105');

// result: [[0, 1], [7, 10], [100, 105]]
```

## Tips of range
- **From minimum to a specific number**

  ```
  ~100
  ```

- **From a specific number to maximum**

  ```
  100~
  ```

- **Number**

  ```
  23
  ```

- **Range**

  ```
  -10~10
  ```

## Advantage Usage
```javascript
var result = range.parse('~-5, -3, 0, 1, 2, 3, 7~8, 9-20, 100~');

// result: [[-4294967295,-5],-3,[0,3],[7,8],[100,4294967295]]
```

**Notes** Boundary is from `-(2^32 - 1)` to `(2^32 - 1)`, i.e. `-4294967295` to `4294967295`.

# Test
```bash
$ npm test
```


# License
Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.