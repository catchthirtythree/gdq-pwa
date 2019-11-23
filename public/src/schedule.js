const dateTemplate = `
  <div class="event-row date" data-timestamp="#timestamp#">
    <div class="event-line">#date#</div>
  </div>
`

const runTemplate = `
  <div class="#status#" data-index="#index#" data-timestamp="#timestamp#">
    <div class="event-line">
      <span class="event-cell short time">#time#</span>
      <span class="event-cell long">#game#</span>
      <span class="event-cell medium">#runner#</span>
      <span class="event-cell short time">#setup#</span>
    </div>
    
    <div class="event-line">
      <span class="event-cell short time">#length#</span>
      <span class="event-cell long">#category#</span>
      <span class="event-cell medium">#host#</span>
      <span class="event-cell short">—</span>
    </div>
  </div>
`

// Get the query parameters from the search thing and turn them into an object
const search = window.location.search.substring(1)
const queries = search.split('&')
const parameters = _.reduce(queries, (acc, query) => {
  const split = query.split('=')
  return _.assign({}, acc, {
    [split[0]]: split[1]
  })
}, {})

// Get the id if it exists and create the request uri
const id = _.get(parameters, 'id');
const resource = '/schedule';
const parameter = _.some(id) ? `/${id}` : '';

function createRunFromTemplate(run, index) {
  const attrs = 'event-row run';

  const timestamp = Date.now();
  const start = new Date(run.time);
  const startstamp = start.getTime();

  const time = _.split(run.length, ':');
  const end = new Date(start.getFullYear(), start.getMonth(), start.getDay(), time[0], time[1], time[2]);
  const endstamp = end.getTime();

  const status = `${attrs + (timestamp > startstamp ? ' passed' : timestamp > endstamp ? ' current' : '')}`;

  return _.reduce(run, (acc, value, key) => {
    switch (key) {
      case 'time':
        let date = new Date(value)

        let hours = date.getHours()
        let hstr = `${hours < 10 ? `0${hours}` : hours}`

        let minutes = date.getMinutes()
        let mstr = `${minutes < 10 ? `0${minutes}` : minutes}`

        let period = hours < 12 ? 'AM' : 'PM'

        let time = `${hstr}:${mstr} ${period}`

        return acc.replace('#timestamp#', value).replace(`#${key}#`, time)

      default:
        return acc.replace(`#${key}#`, value)
    }
  }, runTemplate.replace('#index#', index).replace('#status#', status))
}

function setEventTitle(event) {
  const titleElement = document.querySelector('#event-title')
  if (titleElement) {
    document.title = event.title
    titleElement.textContent = event.title
  }
}

function sameDay(date1, date2) {
  return (date1.getFullYear() === date2.getFullYear())
    && (date1.getMonth() === date2.getMonth())
    && (date1.getDate() === date2.getDate())
}

function setEventTable(event) {
  const tableElement = document.querySelector('#event-table')
  if (tableElement) {
    let lastDate = null

    _.forEach(event.table.runs, (run, index) => {
      let nextDate = new Date(run.time)
      if (_.isNil(lastDate) || !sameDay(lastDate, nextDate)) {
        let options = {
          weekday: 'long',
          month: 'long',
          day: 'numeric'
        }

        tableElement.innerHTML += dateTemplate.replace('#timestamp#', nextDate.getTime()).replace('#date#', nextDate.toLocaleDateString("en-US", options))

        lastDate = nextDate
      }

      tableElement.innerHTML += createRunFromTemplate(run, index)
    })
  }
}

// Fetch the schedule from the server
fetch(`${resource + parameter}`)
  .then(response => {
    if (response.ok) {
      response.json().then(eventData => {
        setEventTitle(eventData);
        setEventTable(eventData);
        setFixedDate();
      });
    }
  });

// Listen to the scrolling table.
document.querySelector('div#event-table').onscroll = e => {
  setFixedDate();
}

function setFixedDate() {
  // Grab the title because we need its height.
  const eventTitle = document.querySelector('div#event-title');
  const titleRect = eventTitle.getBoundingClientRect();

  // Loop through the runs to find the one that's currently on top.
  const eventRuns = document.querySelectorAll('div.event-row.run');
  const firstRun = _.find(eventRuns, eventRun => {
    // Get the run's current rectangle.
    const runRect = eventRun.getBoundingClientRect();

    // Calculate the run's real top value.
    const top = runRect.top;
    const height = runRect.height;

    // Return true if the run is the top one.
    return (top + height) >= titleRect.height;
  });

  if (_.isNil(firstRun)) return;

  // Find the date associated with the run.
  const eventDates = document.querySelectorAll('div.event-row.date');
  const firstDate = _.reduce(eventDates, (acc, eventDate) => {
    // Get the date timestamp.
    const eventTimestamp = parseInt(eventDate.getAttribute('data-timestamp'));

    // Get the run timestamp.
    const runDate = new Date(firstRun.getAttribute('data-timestamp'));
    const runTimestamp = runDate.getTime();

    return (eventTimestamp > runTimestamp) ? acc : eventDate;
  }, null);

  if (_.isNil(firstDate)) return;

  // Set the fixed class on the current date.
  if (!_.includes(firstDate.classList, 'fixed')) {
    // Remove all others.
    eventDates.forEach(eventDate => eventDate.classList.remove('fixed'));

    // Set fixed on current date.
    firstDate.classList.add('fixed');
  }
}