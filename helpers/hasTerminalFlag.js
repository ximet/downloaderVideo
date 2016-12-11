const hasTerminalFlag = function (flag, argv) {
	const currentArgv = argv || process.argv;
	const terminatorPos = currentArgv.indexOf('--');
	const prefix = /^-{1,2}/.test(flag) ? '' : '--';
    const position = currentArgv.indexOf(`${prefix}${flag}`);

	return position !== -1 && (terminatorPos === -1 ? true : position < terminatorPos);
};

module.exports = hasTerminalFlag;
