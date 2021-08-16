export interface locationDTO {
  address: string;
  latitude: string; // 위도
  longitude: string; // 경도
}

export interface previewDTO {
  title: string;
  image: string;

  region: string;
  theme: string;
  warning: string;
}

export interface detailDTO {
  PostId: number;
  province: string;
  isParking: boolean;
  parkingDesc: string;
  courseDesc: string;

  src: string;
  srcLongitude: string;
  srcLatitude: string;

  wayOne: string;
  wayOneLongitude: string;
  wayOneLatitude: string;

  wayTwo: string;
  wayTwoLongitude: string;
  wayTwoLatitude: string;

  dest: string;
  destLongitude: string;
  destLatitude: string;

  image1: string;
  image2: string;
  image3: string;
  image4: string;
  image5: string;

  spring: boolean;
  summer: boolean;
  fall: boolean;
  winter: boolean;
  mountain: boolean;
  sea: boolean;
  lake: boolean;
  river: boolean;
  oceanRoad: boolean;
  blossom: boolean;
  maple: boolean;
  relax: boolean;
  speed: boolean;
  nightView: boolean;
  cityView: boolean;

  highway: boolean;
  mountainRoad: boolean;
  diffRoad: boolean;
  hotPlace: boolean;
}
