export interface driveDTO {
  postId: number;

  title: string;
  image: string;

  //tags
  region: string;
  theme: string;
  warning: string;

  //포스팅 날짜
  year: string;
  month: string;
  day: string;

  isFavorite: boolean;
}

export interface previewDTO {
  totalCourse: number;
  drive: driveDTO[];
}
