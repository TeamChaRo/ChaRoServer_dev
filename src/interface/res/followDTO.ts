export interface followDTO {
  nickname: string;
  userEmail: string;
  image: string;
  is_follow: boolean;
}

export interface followListDTO {
  follower: followDTO[];
  following: followDTO[];
}
