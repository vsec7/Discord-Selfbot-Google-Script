// Simple Discord SelfBot Google App Script
// Coded by https://github.com/vsec7
// Dont sell this script and use with your own risk

// ------------------------ CONFIG -------------------------
// multiple selfbot token token
token = [
  "ODE3MzkzOTQ4xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
  "ODE3MzkzOTQ4xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
];

// multiple channel id
channel_id = [
  "103009xxxxxxxxxxxxx",
  "103009xxxxxxxxxxxxx"
]

mode = "simsimi"                // mode : quote, repost, simsimi, custom
reply = ""                      // reply : Y or "" * for simsimi mode only
del_after = ""                  // del_after : Y or ""
simi_lang = "id"                // simi_lang : id, en, etc
repost_last = "30"

// custom text
custom = [
  "hi",
  "iya kah?",
  "ohh iyaa",
  "GM",
  "GN"
]

base = "https://discord.com/api/v9"
// ------------------------------------------------------------

function main() {

  for (i = 0; i < token.length; i++) {
    me = getMe(token[i])
    if (me == "undefined#undefined") {
      console.log("[Token Error] " + token[i])
    } else {

      for (n = 0; n < channel_id.length; n++) {
        switch (mode) {
          case "quote":
            q = quote()
            s = sendMessage(token[i], channel_id[n], q)

            console.log("[" + me + "][QUOTE][" + channel_id[n] + "] " + q)

            if (del_after == "Y") {
              deleteMessage(token[i], channel_id[n], s['id'])
              console.log("[" + me + "][" + channel_id[n] + "] DELETE : " + s['id'])
            }
            break;

          case "repost":
            rand = Math.floor((Math.random() * repost_last) + 1)
            g = getMessage(token[i], channel_id[n], repost_last).reverse()

            s = sendMessage(token[i], channel_id[n], g[rand]['content'])

            console.log("[" + me + "][REPOST][" + channel_id[n] + "] " + g[rand]['content'])

            if (del_after == "Y") {
              deleteMessage(token[i], channel_id[n], s['id'])
              console.log("[" + me + "][" + channel_id[n] + "] DELETE : " + s['id'])
            }
            break;
          case "simsimi":
            gs = getMessage(token[i], channel_id[n], "1").reverse()[0]
            simi = simsimi(simi_lang, gs['content'])

            if (reply == "Y") {
              s = sendReply(token[i], channel_id[n], gs['id'], simi)
              console.log("[" + me + "][SIMSIMI][REPLY][" + channel_id[n] + "] " + simi)
              
              if (del_after == "Y") {
                deleteMessage(token[i], channel_id[n], s['id'])
                console.log("[" + me + "][" + channel_id[n] + "] DELETE : " + s['id'])
              }
            } else {
              s = sendMessage(token[i], channel_id[n], simi)
              console.log("[" + me + "][SIMSIMI][" + channel_id[n] + "] " + simi)

              if (del_after == "Y") {
                deleteMessage(token[i], channel_id[n], s['id'])
                console.log("[" + me + "][" + channel_id[n] + "] DELETE : " + s['id'])
              }
            }
            break;
          case "custom":
            rand = Math.floor((Math.random() * custom.length) + 1)
            cc = custom[rand]
            s = sendMessage(token[i], channel_id[n], cc)
            console.log("[" + me + "][CUSTOM][" + channel_id[n] + "] " + cc)

            if (del_after == "Y") {
              deleteMessage(token[i], channel_id[n], s['id'])
              console.log("[" + me + "][" + channel_id[n] + "] DELETE : " + s['id'])
            }
            break;
          default:
            break;
        }
      }
    }
  }
}

function quote() {
  url = "https://gist.githubusercontent.com/vsec7/45b5b362d9dde8bd381dc9b8a3b6331a/raw/7934009fc02655de3ffc4a28af22a6c0c1ecd102/quote-id.json";
  r = UrlFetchApp.fetch(url);
  q = JSON.parse(r.getContentText())
  rand = Math.round(Math.random() * q.length)
  return q[rand]['quote']
}

function simsimi(lc, txt) {
  url = "https://api.simsimi.vn/v1/simtalk";
  opt = {
    "method": "post",
    "payload": {
      "lc": lc,
      "text": txt
    },
    "muteHttpExceptions": true
  };
  r = UrlFetchApp.fetch(url, opt);
  return JSON.parse(r)['message']
}

function getMe(t) {
  url = base + "/users/@me";
  opt = {
    "method": "get",
    "headers": {
      "Authorization": t
    },
    "muteHttpExceptions": true
  };
  res = UrlFetchApp.fetch(url, opt);
  r = JSON.parse(res)
  return r['username'] + "#" + r['discriminator']
}

function getMessage(t, c, l) {
  url = base + "/channels/" + c + "/messages?limit=" + l;
  opt = {
    "method": "get",
    "headers": {
      "Authorization": t
    },
    "muteHttpExceptions": true
  };
  res = UrlFetchApp.fetch(url, opt);
  r = JSON.parse(res)
  return r
}

function sendMessage(t, cid, txt) {
  url = base + "/channels/" + cid + "/messages";
  opt = {
    "method": "post",
    "contentType": "application/json",
    "headers": {
      "Authorization": t
    },
    "payload": JSON.stringify({
      "content": txt
    }),
    "muteHttpExceptions": true
  };
  res = UrlFetchApp.fetch(url, opt);
  r = JSON.parse(res)
  return r
}

function sendReply(t, cid, mid, txt) {
  url = base + "/channels/" + cid + "/messages";
  opt = {
    "method": "post",
    "contentType": "application/json",
    "headers": {
      "Authorization": t
    },
    "payload": JSON.stringify({
      "content": txt,
      "message_reference": {
        "message_id": mid
      }
    }),
    "muteHttpExceptions": true
  };
  res = UrlFetchApp.fetch(url, opt);
  r = JSON.parse(res)
  return r
}

function deleteMessage(t, cid, mid) {
  url = base + "/channels/" + cid + "/messages/" + mid;
  opt = {
    "method": "delete",
    "contentType": "application/json",
    "headers": {
      "Authorization": t
    },
    "muteHttpExceptions": true
  };
  return UrlFetchApp.fetch(url, opt);
}
