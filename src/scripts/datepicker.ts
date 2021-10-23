import { getMonthDays } from './date-utils';
import { capitalize } from './string-utils';
import { Weekday } from './weekday';

class Datepicker {
	private initialized: boolean = false;
	private monthSelector: string;
	private rootSelector: string;
	private daySelector: string;
	private currentDate: Date;
	private locale: string = 'en-US';
	private prevSelector = '.prev-month';
	private nextSelector = '.next-month';
	private beginningWeekDay = Weekday.Monday;
	private currentBeginningWeekDay = 1;
	private isBeginningDayThisMonth: boolean = false;
	private visibleWeekDays = false;
	private weekDaySelector: string;
	private weekDaysRootSelector: string;

	constructor(
		rootSelector: string = '.fullscreen-datetime-picker',
		daySelector: string = '.day',
		monthSelector: string = '.current-month'
	) {
		this.rootSelector = rootSelector;
		this.daySelector = daySelector;
		this.monthSelector = monthSelector;
		this.currentDate = new Date();
	}

	get rootElem(): HTMLElement {
		return document.querySelector(this.rootSelector);
	}

	get weekDaysRootElem(): HTMLElement {
		return document.querySelector(this.weekDaysRootSelector);
	}

	get dayTemplateElem(): HTMLElement {
		return document.querySelector(this.daySelector);
	}

	get weekDayTemplateElem(): HTMLElement {
		return document.querySelector(this.weekDaySelector);
	}

	get dateElem(): HTMLElement {
		return document.querySelector(`${this.rootSelector} [type="date"]`);
	}

	get currentMonthElem(): HTMLElement {
		return document.querySelector(`${this.monthSelector}`);
	}

	get prevButton(): HTMLElement {
		return document.querySelector(this.prevSelector);
	}

	get nextButton(): HTMLElement {
		return document.querySelector(this.nextSelector);
	}

	private highlightToday() {
		const today = new Date();
		const day = document.querySelector(`[day="${today.getDate()}"]`);

		const isSameMonth = today.getMonth() === this.currentDate.getMonth();
		const isSameYear = today.getFullYear() === this.currentDate.getFullYear();
		if (isSameMonth && isSameYear) {
			day.classList.add('today');
		}
	}

	private createDaysHtmlElements(
		startingDay: number,
		days: number,
		isPreviousMonth: boolean = false
	) {
		const template = this.dayTemplateElem;

		for (let day = startingDay; day <= days; day++) {
			const dayElem = template.cloneNode(true) as HTMLElement;
			dayElem.innerText = day.toString();

			if (isPreviousMonth) {
				dayElem.classList.add('previous-month-day');
			} else {
				dayElem.setAttribute('day', day.toString());
			}

			this.rootElem.append(dayElem);
		}
	}

	private createWeekDays() {
		let date = new Date(this.currentDate.getTime());
		date.setDate(this.currentBeginningWeekDay);
		if (!this.isBeginningDayThisMonth) {
			date.setMonth(date.getMonth() - 1);
		}

		const template = this.weekDayTemplateElem;
		let day = date.getDate();

		for (let i = 0; i < 7; i++) {
			const weekDayElem = template.cloneNode(true) as HTMLElement;
			const dayName = date.toLocaleString(this.locale, {
				weekday: 'long',
			});
			weekDayElem.innerText = dayName;
			weekDayElem.setAttribute('weekday', date.getDay().toString());
			this.weekDaysRootElem.append(weekDayElem);
			date.setDate(day + 1);
			day = date.getDate();
		}
	}

	private createPreviousMonthDays() {
		const date = new Date(this.currentDate.getTime());
		date.setDate(1);
		const weekDay = date.getDay();

		// First day of the month correspond to starting day
		if (weekDay === this.beginningWeekDay) {
			this.isBeginningDayThisMonth = true;
			return;
		}

		// Get previous month
		date.setMonth(date.getMonth() - 1);
		const daysInMonth = getMonthDays(date.getFullYear(), date.getMonth());
		date.setDate(daysInMonth);

		let day = date.getDay();

		for (let i = 1; day !== this.beginningWeekDay; i++) {
			date.setDate(daysInMonth - i);
			day = date.getDay();
		}

		this.currentBeginningWeekDay = date.getDate();
		this.isBeginningDayThisMonth = false;
		this.createDaysHtmlElements(date.getDate(), daysInMonth, true);
	}

	private createDays() {
		const date = this.currentDate;
		const days = getMonthDays(date.getFullYear(), date.getMonth());

		if (this.visibleWeekDays) {
			this.createPreviousMonthDays();
		}

		this.createDaysHtmlElements(1, days);
		this.highlightToday();
	}

	private clearDays() {
		const days = document.querySelectorAll('[day]');
		const lastMonthDays = document.querySelectorAll('.previous-month-day');

		days.forEach(day => {
			day.remove();
		});

		lastMonthDays.forEach(day => {
			day.remove();
		});
	}

	private handleNavigationButtons(target: HTMLElement) {
		const currentMonth = this.currentDate.getMonth();
		let increment = 1;
		if (target === this.prevButton) {
			increment = -1;
		}

		this.currentDate.setMonth(currentMonth + increment);
		this.clearDays();
		this.updateDate();
	}

	private initClickEvents() {
		document.addEventListener('click', ({ target }) => {
			const targetElem = target as HTMLElement;

			// Set clicked day
			const selectedDay = targetElem.getAttribute('day');
			if (selectedDay) {
				this.dayClick(target);
			}

			// Set current month
			if (targetElem === this.prevButton || targetElem === this.nextButton) {
				this.handleNavigationButtons(targetElem);
			}
		});
	}

	private dayClick(targetDay) {
		const oldSelected = document.querySelector(`${this.daySelector}[clicked]`);
		if (oldSelected && oldSelected !== targetDay) {
			oldSelected.removeAttribute('clicked');
		}
		targetDay.setAttribute('clicked', '');

		const day = targetDay.getAttribute('day');
		this.setDate(day);
	}

	private createFormInput() {
		const inputName = this.rootElem.getAttribute('name');
		const inputElem = document.createElement('input');
		inputElem.setAttribute('type', 'date');
		inputElem.setAttribute('name', inputName || '');
		inputElem.style.display = 'none';
		this.rootElem.append(inputElem);
	}

	private setDate(day: number) {
		const year = this.currentDate.getFullYear();
		const month = (this.currentDate.getMonth() + 1).toString().padStart(2, '0');
		const selectedDay = day.toString().padStart(2, '0');

		this.dateElem.setAttribute('value', `${year}-${month}-${selectedDay}`);
	}

	private setCurrentMonthName() {
		let monthName = this.currentDate.toLocaleString(this.locale, {
			month: 'long',
		});

		monthName = capitalize(monthName);
		this.currentMonthElem.innerText = `${monthName} ${this.currentDate.getFullYear()}`;
	}

	public setLocale(locale: string) {
		if (this.initialized) {
			console.error('You can only set the locale before calling init()!');
			return;
		}

		this.locale = locale;
	}

	private updateDate() {
		this.createDays();
		this.setCurrentMonthName();
	}

	public setNavigationButtons(prevSelector: string, nextSelector: string) {
		this.prevSelector = prevSelector;
		this.nextSelector = nextSelector;
	}

	public showWeekdays(
		weekDaySelector = '.week-day',
		rootSelector = '.week-days',
		beginningWeekDay?: Weekday
	) {
		if (this.initialized) {
			console.error(
				'You can only set weekdays visibility before calling init()!'
			);
			return;
		}

		if (beginningWeekDay) {
			this.beginningWeekDay = beginningWeekDay;
		}
		this.visibleWeekDays = true;
		this.weekDaySelector = weekDaySelector;
		this.weekDaysRootSelector = rootSelector;
	}

	public init(currentDate: Date | null = null) {
		this.currentDate = currentDate ?? this.currentDate;
		this.createFormInput();
		this.createDays();
		this.initClickEvents();
		this.setCurrentMonthName();
		this.setDate(1);
		if (this.visibleWeekDays) {
			this.createWeekDays();
		}
		this.initialized = true;
	}
}

export { Datepicker };
