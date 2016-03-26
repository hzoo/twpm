lppm
====

left-pad package manager

>https://gist.github.com/rauchg/5b032c2c2166e4e36713#gistcomment-1732501

## Usage

You will need `twitter-config.js` in the root repo you run this in.

```js
// twitter-config.js
module.exports = {
  "consumer_key": "",
  "consumer_secret": "",
  "access_token": "",
  "access_token_secret": ""
};
```

```js
{
  "name": "require-from-twitter",
  "lppm": {
    "modulesLocation": "tweet_modules", // default folder
    "fields": [
      "created_at",
      "text",
      "id_str",
      "user",
      "screen_name"
    ] // default fields to take from twitter status
  },
  "lppmDependencies": {
    "left-pad": "712799807073419264",
    "sort": "713782217646931968"
  }
}
```

```bash
# install specific tweet/id
lppm install 712799807073419264 # tweet id 
lppm install https://twitter.com/rauchg/status/712799807073419264 # full url

# save to package.json
# under the lppm key
lppm install 712799807073419264 --save left-pad

# install everything under the `lppmDependencies`
lppm install
# shorthand
lppm i
```
