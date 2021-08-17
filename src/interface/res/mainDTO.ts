import { previewDTO } from './previewDTO';

export interface bannerDTO {
  bannerTitle: string;
  bannerImage: string;
  bannerTag: string;
}

export interface mainDTO {
  banner: bannerDTO[];
  todayCharoDrive: previewDTO;
  trendDrive: previewDTO;
  customTitle: string;
  customDrive: previewDTO;
  localTitle: string;
  localDrive: previewDTO;
}
