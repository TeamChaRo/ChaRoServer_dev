import { db } from '../models';
import { QueryTypes } from 'sequelize';

import { detailDTO, courseDTO } from '../interface/res/detailDTO';

import mapping from './mapping.json';

export async function getDetail(userEmail: string, postId: string) {
  try {
    const query = `SELECT P.*, user.nickname, user.profileImage, 
                    count(isSave.PreviewId) as isStored, count(countLike.PreviewId) as favoriteCount, count(isLike.PreviewId) as isFavorite
                    FROM detail as P
                    INNER JOIN user
                    LEFT OUTER JOIN savedPost as isSave ON(isSave.PreviewId = P.PostId and isSave.UserEmail =:userEmail)
                    LEFT OUTER JOIN likedPost as countLike ON(countLike.PreviewId = P.PostId)
                    LEFT OUTER JOIN likedPost as isLike ON(isLike.PreviewId = P.PostId and isLike.UserEmail =:userEmail)
                    WHERE user.email = P.UserEmail
                    GROUP BY P.PostId`;

    const result = await db.sequelize.query(query, {
      type: QueryTypes.SELECT,
      replacements: { userEmail: userEmail },
      raw: true,
      nest: true,
    });
    const data = result[0];

    const detail: detailDTO = {
      images: parseImage(data),
      province: data['province'],
      isParking: data['isParking'] ? true : false,
      parkingDesc: data['parkingDesc'],
      courseDesc: data['courseDesc'],
      themes: parseTheme(data),
      warnings: parseWarning(data),

      author: data['nickname'],
      isAuthor: data['userEmail'] == userEmail ? true : false,
      profileImage: data['profileImage'],

      likesCount: data['favoriteCount'],
      isFavorite: data['isFavorite'],
      isStored: data['isStored'],

      course: parseCourse(data),
    };

    return {
      status: 200,
      data: {
        success: true,
        msg: '오예원 힘내자', //"successfully load Today's preview sorted by date",
        data: detail,
      },
    };
  } catch (err) {
    console.log(err);
    return {
      status: 502,
      data: {
        success: false,
        msg: '게시글 상세정보 읽어오기 실패',
      },
    };
  }
}

function parseImage(data: object): string[] {
  // Parsing images
  const images: string[] = [];
  const standard = 'image';
  for (let i = 1; i < 6; i++) {
    const key = standard + i.toString();
    if (data[key]) {
      images.push(data[key]);
    }
  }
  return images;
}

function parseCourse(data: object): courseDTO[] {
  // Parsing course
  const course: courseDTO[] = [];

  const source: courseDTO = {
    address: data['src'],
    latitude: data['srcLatitude'],
    longitude: data['srcLongitude'],
  };
  course.push(source);

  if (data['wayOne']) {
    const wayPoint: courseDTO = {
      address: data['wayOne'],
      latitude: data['wayOneLatitude'],
      longitude: data['wayOneLongitude'],
    };
    course.push(wayPoint);
  }
  if (data['wayTwo']) {
    const wayPoint: courseDTO = {
      address: data['wayTwo'],
      latitude: data['wayTwoLatitude'],
      longitude: data['wayTwoLongitude'],
    };
    course.push(wayPoint);
  }

  const destination: courseDTO = {
    address: data['dest'],
    latitude: data['destLatitude'],
    longitude: data['destLongitude'],
  };
  course.push(destination);

  return course;
}

function parseTheme(data: object): string[] {
  const themeList = [
    'spring',
    'summer',
    'fall',
    'winter',
    'mountain',
    'sea',
    'lake',
    'river',
    'oceanRoad',
    'blossom',
    'maple',
    'relax',
    'speed',
    'nightView',
    'cityView',
  ];
  const themes: string[] = [];
  for (let key of themeList) if (data[key]) themes.push(mapping.theme[key]);

  return themes;
}

function parseWarning(data: object): boolean[] {
  const warningList = ['highway', 'mountainRoad', 'diffRoad', 'hotPlace'];
  const warnings: boolean[] = [];
  for (let key of warningList) warnings.push(mapping.warning[key] ? true : false);

  return warnings;
}
