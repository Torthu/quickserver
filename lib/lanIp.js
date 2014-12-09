/*jslint node: true */
'use strict';

/* Find LAN IP */

function findLanIp (callback) {
	require('dns').lookup(require('os').hostname(), function (err, add, fam) {
		callback(add);
	});
}

exports['find'] = findLanIp;