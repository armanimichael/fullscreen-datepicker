# Fullscreen Date Picker

A fully customizable lib to style your own datepicker.

## Features

- No pre-set css
- Starting date selection
- Current day highlight (with .today class)
- Months navigation
- Localization

## Todo

- Time picker
- Easier month navigation

## How to install

This lib was initially developed for a non-node env, meaning you can run it on any modern browser.

Simply download the current release ([fullscreen-datepicker.min.js](https://github.com/armanimichael/fullscreen-datepicker/releases/latest)) and include the script in your html page.

## Quick start

Html example:

```
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <script defer src="fullscreen-datetime-picker.min.js"></script>
</head>

<body>
    <form action="/publish" method="GET">
        <div class="fullscreen-datetime-picker" name="some-date">
            <p class="current-month">Month</p>
            <button type="button" class='prev'>Prev</button>
            <button type="button" class='next'>Next</button>
            <div class="day"></div>
        </div>
        <button type="submit">Send</button>
    </form>
</body>

</html>
```
JavaScript example:

```
// On document ready
document.addEventListener("DOMContentLoaded", () => {
    const datepicker = new FullscreenDatePicker(
        '.fullscreen-datetime-picker',
        '.day',
        '.current-month'
    );
    datepicker.setLocale('en');
    datepicker.setNavigationButtons('.prev', '.next');

    // This ensures to set the correct date depending on the query params
    const currentDateParam = new URLSearchParams(location.search).get('some-date');
    let currentDate;
    if (currentDateParam) {
        currentDate = new Date(currentDateParam);
    }
    datepicker.init(currentDate);
});
```

## Configuration

The constructor (`FullscreenDatePicker`) accepts three **optional** parameters:
- `rootSelector` (default: `'.fullscreen-datetime-picker'`): where to mount the datepicker;
- `daySelector` (default: `'.day'`): what to use as a template for the calendar days;
- `monthSelector` (default: `'.current-month'`): where to set the current month name and year;

### Setting the locale
**You must run it before `init()`**

`setLocale(locale)`: where locale is a string (default: `'en-US'`).

### Setting the navigation buttons

`setNavigationButtons(prevSelector, nextSelector)`: the buttons selectors for previous and next month (default: `'.prev-month', '.next-month'`)

### Initialize
`init(date)`: where date is the starting date (default: today date).

