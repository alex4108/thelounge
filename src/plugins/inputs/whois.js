"use strict";
const Msg = require("../../models/msg");

exports.commands = ["whois"];

exports.input = function ({irc}, chan, cmd, args) {
	const client = this;
	const target = args[0];
	const targetNick = args[1] ? args[1] : target;

	let msg;
	irc.whois(targetNick, (data) => {
		if (data.error) {
			// no-op, the server will send an error handled by components/MessageTypes/error.vue
		} else {
			// Absolute datetime in milliseconds since nick is idle
			data.idleTime = Date.now() - data.idle * 1000;
			// Absolute datetime in milliseconds when nick logged on.
			data.logonTime = data.logon * 1000;
			msg = new Msg({
				type: Msg.Type.WHOIS,
				whois: data,
			});
		}

		chan.pushMessage(client, msg);
	});
};
