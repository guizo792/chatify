const moment = require("moment");

function formatMsg(username: string, text: string) {
  return {
    username,
    text,
    time: moment().format("h:mm a"),
  };
}

module.exports = formatMsg;
