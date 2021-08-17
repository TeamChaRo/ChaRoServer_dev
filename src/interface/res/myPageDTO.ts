import { previewDTO } from './previewDTO';
export interface myPageUser {
  nickname: string;
  profileImage: string;
  following: number;
  follower: number;
}

export interface myPageDTO {
  userInformation: myPageUser;
  writtenPost: previewDTO;
  savedPost: previewDTO;
}
