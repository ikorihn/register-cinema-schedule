export default interface Movie {
  // 購入番号
  confirmationNumber: string;
  // 劇場
  theater: string;
  // 金額
  totalPrice: number;
  // 席番号
  seatNumber: string;
  // 開始時間
  startTime: Date;
  // 終了時間
  endTime: Date;
  // タイトル
  movieTitle: string;
  // mailへのリンク
  emailLink: string;
}
