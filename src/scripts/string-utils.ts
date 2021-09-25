function capitalize(str: string) {
	if (!str || str.length == 0) {
		return str;
	}

	if (str.length < 2) {
		return str.toUpperCase();
	}

	const firstLetter = str[0].toUpperCase();
	return firstLetter + str.substr(1).toLowerCase();
}

export { capitalize };
