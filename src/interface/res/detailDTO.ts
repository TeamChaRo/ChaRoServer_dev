// preview data에 추가될 정보들
export interface courseDTO {
  address: string;
  latitude: string;
  longitude: string;
}

export interface detailDTO {
  //추가정보
  images: string[];
  province: string;
  isParking: boolean;
  parkingDesc: string;
  courseDesc: string;
  themes: string[];
  warnings: boolean[];

  //user 정보
  author: string;
  authorEmail: string;
  isAuthor: boolean;
  profileImage: string;

  //좋아요, 저장여부
  likesCount: number;
  isFavorite: boolean;
  isStored: boolean;

  //코스 정보
  course: courseDTO[];
}
