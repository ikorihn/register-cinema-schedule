import { searchMovie } from './Email'
import Movie from './movie'

function main() {
  const calendar = CalendarApp.getDefaultCalendar()

  const date = new Date()
  date.setDate(date.getDate() - 7)
  const movies = searchMovie(date)
  for (const movie of movies) {
    createEventIfNotExist(calendar, movie)
  }
}

function createEventIfNotExist(calendar: GoogleAppsScript.Calendar.Calendar, movie?: Movie) {
  if (movie == null) {
    return
  }

  const movieEvents = calendar.getEvents(movie.startTime, movie.endTime, { search: `[${movie.confirmationNumber}] ${movie.movieTitle}` })
  if (movieEvents.length > 0) {
    Logger.log('Already registered. (count:' + movieEvents.length + ') (' + movieEvents[0].getTitle() + ')')
    return
  }

  const event = calendar.createEvent(`[${movie.confirmationNumber}] ${movie.movieTitle}`, movie.startTime, movie.endTime, {
    location: movie.theater,
  })
  Logger.log('Calendar Registered: ' + event.getId())
}

/**
 * トリガーを作成する
 * デフォルトだと日毎に実行される
 */
function creatTrigger() {
  ScriptApp.newTrigger('main').timeBased().everyHours(1).create()
}
