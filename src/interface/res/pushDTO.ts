export default interface pushDTO {
  push_id: number;
  push_code: number;

  is_read: boolean;
  image: string;
  token: string;

  title: string;
  body: string;

  month: string;
  day: string;
}
