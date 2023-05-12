import Movie from './movie'

export function searchMovie(fromDate: Date): Movie[] {
  const messages = searchCinemaEmail(fromDate)
  console.log(`Emails: ${messages}`)

  if (messages == null || messages.length == 0) {
    return []
  }

  const movies: Movie[] = []
  for (const message of messages) {
    const body = message.getPlainBody()
    let movie: Movie
    if (message.getFrom().includes('tokyu-rec.co.jp')) {
      movie = createMovieFrom109Cinema(body)
    } else if (message.getFrom().includes('tohotheater.jp')) {
      movie = createMovieFromToho(body)
    }
    movies.push(movie)
  }

  return movies
}

export function searchCinemaEmail(fromDate: Date): GoogleAppsScript.Gmail.GmailMessage[] {
  const from = ['cinema-ticket@tokyu-rec.co.jp', 'i-net.ticket@ml.tohotheater.jp']
  const subject = ['購入完了']
  const after = Utilities.formatDate(fromDate, "Asia/Tokyo", "yyyy-MM-dd")

  const threads = GmailApp.search(`from:${from.join(' OR ')} subject:"${subject.join(' OR ')}" after:${after}`)
  const messages: GoogleAppsScript.Gmail.GmailMessage[] = threads.flatMap(t => t.getMessages())
  return messages
}

export function createMovieFromToho(body: string): Movie | null {
  if (!/購入番号　(\d+)/.test(body)) {
    return null
  }

  const confirmationNumber = body.match(/購入番号　(\d+)/)[1]
  const theater = body.match(/映画館　(\S+)/)[1]
  const totalPrice = parseInt(body.match(/合計金額　([0-9,]+)/)[1].replace(',', ''))
  const seatNumber = body.match(/座席番号　([A-Z]+-\d+).*/)[1]
  const movieTitle = body.match(/作品名　(.*)/)[1]

  const date = body.match(/上映日\s*(\d{4}\/\d{1,2}\/\d{1,2}).*/)[1]
  const time = body.match(/時間\s*(\d{2}:\d{2}).(\d{2}:\d{2})/)
  const startTime = time[1]
  const endTime = time[2]
  const startDatetime = new Date(`${date} ${startTime}:00+09:00`)
  const endDatetime = new Date(`${date} ${endTime}:00+09:00`)

  const movie: Movie = {
    confirmationNumber: confirmationNumber,
    theater: theater,
    totalPrice: totalPrice,
    seatNumber: seatNumber,
    startTime: startDatetime,
    endTime: endDatetime,
    movieTitle: movieTitle,
  }
  return movie
}

export function createMovieFrom109Cinema(body: string): Movie | null {
  if (!/購入番号：(\d+)/.test(body)) {
    return null
  }

  const confirmationNumber = body.match(/購入番号：(\d+)/)[1]
  const theater = body.match(/劇場名.*：(.*)/)[1]
  const totalPrice = parseInt(body.match(/合計([0-9,]+)円/)[1].replace(',', ''))
  const seatNumber = body.match(/座席.*：(.*)/)[1]
  const movieTitle = body.match(/上映作品.*：(.*)/)[1]

  const date = body.match(/上映日.*：(\d{4}\/\d{1,2}\/\d{1,2}).*/)[1]
  const time = body.match(/上映時間.*：(\d{2}:\d{2}).*(\d{2}:\d{2})/)
  const startTime = time[1]
  const endTime = time[2]
  const startDatetime = new Date(`${date} ${startTime}:00+09:00`)
  const endDatetime = new Date(`${date} ${endTime}:00+09:00`)

  const movie: Movie = {
    confirmationNumber: confirmationNumber,
    theater: theater,
    totalPrice: totalPrice,
    seatNumber: seatNumber,
    startTime: startDatetime,
    endTime: endDatetime,
    movieTitle: movieTitle,
  }
  return movie
}

