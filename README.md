## twpm (twitter package manager) [![](https://img.shields.io/npm/v/twpm.svg?style=flat-square)](https://www.npmjs.com/package/twpm) [![](https://img.shields.io/travis/hzoo/twpm/master.svg?style=flat-square)](https://travis-ci.org/hzoo/twpm)

> https://gist.github.com/rauchg/5b032c2c2166e4e36713#gistcomment-1732501

[![](twpm.gif)](https://twitter.com/rauchg/status/712799807073419264)

### Install

> Check out the [setup](#setup) info (need twitter credentials)

```bash
npm i twpm -g

# use npx for one-off command
npx twpm install
```

#### Installing "packages"

```bash
twpm install https://twitter.com/rauchg/status/712799807073419264 --save left-pad
```

### Usage (in code)

> The default package folder/require prefix is `@twpm/`

```js
// usage for `twpm install 712799807073419264 --save left-pad`
const leftPad = require("@twpm/left-pad");
leftPad(1, 5) // "00001"
```

### Setup (2 ways)

### Environment Variables

You need to add `TWITTER_CONSUMER_KEY` and `TWITTER_CONSUMER_SECRET` environment variables when running twpm

### Config file (`./twitter-config.js`)

Create a config file at the root of your git repo.

> You can create a Twitter app to get keys at https://apps.twitter.com.

```js
module.exports = {
  "consumer_key": "",
  "consumer_secret": "",
  "app_only_auth": true,
};
```

### Commands

#### Install

```bash
# will install to node_modules/@twpm/712799807073419264
twpm install 712799807073419264

# will install to node_modules/@twpm/712799807073419264
twpm install https://twitter.com/rauchg/status/712799807073419264

`twpm install` creates a `index.js` with transpiled source and a `package.json` with metadata (including the original source).

# Will install to node_modules/@twpm/left-pad
twpm install 712799807073419264 --save left-pad

# install everything under `twpm.dependencies` in `package.json`
twpm install

# shorthand
twpm i
```

#### Search

You can search through tweets that are hashtagged with `#twpm` and install them

```js
# get some random ones
twpm search
# specific keyword search
twpm search left-pad
```

### Tweets

Since twpm will be transpiling the code, twpm will strip out the first line if the tweet is multiline and contains the hashtag `#twpm`.

#### Tweet

```js
@_henryzhu //#twpm:left-pad
export default (v, n, c = '0') => String(v).length >= n ? '' + v : (String(c).repeat(n) + v).slice(-n);
```

#### Extracted Code

```js
// Input to be transpiled (just the function. otherwise an error will occur with decorators)
export default (v, n, c = '0') => String(v).length >= n ? '' + v : (String(c).repeat(n) + v).slice(-n);
```

Currently you will need to use a `export default function() {}` or `export default () => {}` in your tweet.

### Config: `twpm` key in `package.json`

```js
{
  "name": "your-app-here",
  "twpm": {
    "modulesLocation": "node_modules", // default folder
    "folderPrefix": "@twpm/", // default prefix
    "packageMetadata": [
      "name",
      "text",
      "screen_name",
      "id_str",
      "retweet_count",
      "favorite_count",
      "created_at",
      "user"
    ] // default fields to take from twitter status
    "dependencies": {
      "@twpm/left-pad": "712799807073419264"
      "@twpm/sort": "713782217646931968"
    }
  }
}
```

### Example

![left-pad](left-pad.png)

```bash
# twpm i 712799807073419264 --save left-pad
twpm-left-pad@0.0.0 /Users/hzoo/twpm-test

Tweet 712799807073419264: 359 🔄, 632 💟
@rauchg at Thu Mar 24 00:34:51 +0000 2016
===
// ES6 leftPad
export default (v, n, c = '0') => String(v).length >= n ? '' + v : (String(c).repeat(n) + v).slice(-n);
---
```

```
- twpm-test
  - node_modules
    - @twpm
      - left-pad
        - index.js # transpiled index.js
        - package.json # reformatted twitter data + name field
```
