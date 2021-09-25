function getMonthDays(year: number, month: number): number {
	const date = new Date(year, month + 1, 0);
	return date.getDate();
}

export { getMonthDays };
