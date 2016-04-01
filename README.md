twpm
====

twitter package manager

>https://gist.github.com/rauchg/5b032c2c2166e4e36713#gistcomment-1732501

[![](twpm.gif)](https://twitter.com/rauchg/status/712799807073419264)

### Setup

At the moment, you will need a `twitter-config.js` in the root repo you run this in.

> You can create a twitter app at https://apps.twitter.com/

```js
// twitter-config.js
module.exports = {
  "consumer_key": "",
  "consumer_secret": "",
  "app_only_auth": true

  // not necessary unless we plan to post tweets as well
  // "access_token": "",
  // "access_token_secret": ""
};
```

### Simple Usage

```bash
// after adding `./twitter-config.js` ^
twpm install 712799807073419264 --save left-pad
// in a file, require it with the prefix
const leftPad = require("tpm-left-pad");
```

### Commands

```bash
# install specific tweet/id
twpm install 712799807073419264 # tweet id
twpm install https://twitter.com/rauchg/status/712799807073419264 # full url
# Will install to node_modules/tpm-712799807073419264

`install` creates a `index.js` with transpiled source and a `package.json` with metadata (including the original source).

# save to package.json
# under the twpm key
twpm install 712799807073419264 --save left-pad
# Will install to node_modules/tpm-left-pad

# install everything under the `twpm.dependencies`
twpm install
# shorthand
twpm i
```

### Require

> The default package folder/require prefix is `tpm-`

```js
// usage for `twpm install 712799807073419264 --save left-pad`
const leftPad = require("tpm-left-pad");
leftPad(1, 5) // "00001"
```

### Repo `package.json`

```js
{
  "name": "pad",
  "twpm": {
    "modulesLocation": "node_modules", // default folder
    "folderPrefix": "tpm-", // default prefix
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
      "tpm-left-pad": "712799807073419264"
      "tpm-sort": "713782217646931968"
    }
  }
}
```

### Example

![left-pad](left-pad.png)

```bash
# twpm i 712799807073419264 --save asdf
tpm-asdf@0.0.0 /Users/hzoo/twpm-test

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
    - tpm-asdf
      - index.js # transpiled index.js
      - package.json # reformatted twitter data + name field
```

## Test
// Will need `twitter-config.js` setup
```bash
npm i
twpm i
npm t
```
