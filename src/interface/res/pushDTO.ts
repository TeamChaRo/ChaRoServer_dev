export default interface pushDTO {
  push_id: number;
  push_code: number;

  isRead: boolean;
  image: string;
  token: string;

  title: string;
  body: string;

  month: string;
  day: string;
}
