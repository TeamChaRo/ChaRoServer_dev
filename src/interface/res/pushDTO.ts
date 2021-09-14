export default interface pushDTO {
  push_id: number;
  push_code: number;

  isRead: boolean;
  image: string;
  token: string;

  date: string;

  title: string;
  body: string;
}
