twpm
====

twitter package manager

>https://gist.github.com/rauchg/5b032c2c2166e4e36713#gistcomment-1732501

![left-pad](left-pad.png)

## Usage

You will need `twitter-config.js` in the root repo you run this in.

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

```js
{
  "name": "require-from-twitter",
  "twpm": {
    "modulesLocation": "tweet_modules", // default folder
    "fields": [
      "created_at",
      "text",
      "id_str",
      "user",
      "screen_name"
    ] // default fields to take from twitter status
  },
  "twpmDependencies": {
    "left-pad": "712799807073419264",
    "sort": "713782217646931968"
  }
}
```

```bash
# install specific tweet/id
twpm install 712799807073419264 # tweet id 
twpm install https://twitter.com/rauchg/status/712799807073419264 # full url

# save to package.json
# under the twpm key
twpm install 712799807073419264 --save left-pad

# install everything under the `twpmDependencies`
twpm install
# shorthand
twpm i
```
