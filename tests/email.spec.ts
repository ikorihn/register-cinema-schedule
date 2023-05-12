import { searchCinemaEmail, createMovieFromToho, createMovieFrom109Cinema } from '../src/Email'
import Movie from '../src/movie'

class GmailThread {
  message: GmailMessage
  constructor(message: string) {
    this.message = new GmailMessage(message)
  }

  getMessages(): GmailMessage[] {
    const ms: GmailMessage[] = []
    ms.push(this.message)
    return ms
  }
}
class GmailMessage {
  message: string
  constructor(message: string) {
    this.message = message
  }
}

describe('searchTohoEmail', (): void => {
  test('normal', (): void => {
    GmailApp.search = jest.fn((arg: string): any[] => {
      const ts: GmailThread[] = []
      if ('from:(cinema-ticket@tokyu-rec.co.jp OR i-net.ticket@ml.tohotheater.jp) subject:"購入完了" after:2020-01-02') {
        const t = new GmailThread('my mail')
        ts.push(t)
        return ts
      }
      return ts
    })
    Utilities.formatDate = jest.fn((date: GoogleAppsScript.Base.Date, timeZone: string, format: string): string => {
      return "2020-01-02"
    })

    const day = new Date('2020-01-02T15:04:05+09:00')
    const actual = searchCinemaEmail(day)
    const expected: GmailMessage[] = [
      {
        message: 'my mail',
      },
    ]
    expect(GmailApp.search).toBeCalledTimes(1)
    expect(actual).toEqual(expected)
  })
})

describe('createMovieFromToho', (): void => {
  test('normal', (): void => {
    const arg = `
    ■購入番号　6992
    ■電話番号　***-****-1234
    ■映画館　ＴＯＨＯシネマズ六本木ヒルズ
    ■作品名　ニューシネマパラダイス
    ■上映日　2020/1/11　
    ■時間　12:30～15:05
    ■スクリーン７
    ■座席番号　A-12
    ■合計金額　1,900円　
    `
    const actual = createMovieFromToho(arg)
    const expected: Movie = {
      confirmationNumber: '6992',
      theater: 'ＴＯＨＯシネマズ六本木ヒルズ',
      movieTitle: 'ニューシネマパラダイス',
      startTime: new Date('2020-01-11T12:30:00+09:00'),
      endTime: new Date('2020-01-11T15:05:00+09:00'),
      seatNumber: 'A-12',
      totalPrice: 1900,
    }
    expect(actual).toStrictEqual(expected)
  })
})

describe('createMovieFrom109Cinema', (): void => {
  test('normal', (): void => {
    const arg = `
    購入番号：999999
    劇場名　：109シネマズ二子玉川
    上映日　：2023/03/21(火)
    上映時間：12:30 ～ 15:00
    上映劇場：シアター4
    上映作品：ＴＨＥ　ＦＩＲＳＴ　ＳＬＡＭ　ＤＵＮＫ
    券種　　：メンバーズデイ　1枚
    　　　　　合計1,200円
    座席　　：O -20
    `
    const actual = createMovieFrom109Cinema(arg)
    const expected: Movie = {
      confirmationNumber: '999999',
      theater: '109シネマズ二子玉川',
      movieTitle: 'ＴＨＥ　ＦＩＲＳＴ　ＳＬＡＭ　ＤＵＮＫ',
      startTime: new Date('2023-03-21T12:30:00+09:00'),
      endTime: new Date('2023-03-21T15:00:00+09:00'),
      seatNumber: 'O -20',
      totalPrice: 1200,
    }
    expect(actual).toStrictEqual(expected)
  })
})
