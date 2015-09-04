# WHAT FOR?

`chrome-ext-history-slack` is a Chrome extension which automatically posts a message to Slack channel when you read a [qiita.com](http://qiita.com) article. 

# INSTALLATION

 1. clone this repository onto your env
 1. create local.json in the extension dir
 1. manually add chrome-ext-history-slack to your Chrome browser

# local.json

put your Slack incoming web hook url and username used for the post

```local.json
{
  "slack_web_hook" : "YOUR_INCOMING_WEB_HOOK_URL",
  "username"       : "YOUR_USERNAME_FOR_POSTING"
}
```