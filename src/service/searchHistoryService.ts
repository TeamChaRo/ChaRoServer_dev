import { db } from '../models';
import { Sequelize } from 'sequelize';

import saveHistoryDTO from '../interface/req/searchHistory';
import readHistoryDTO from '../interface/res/searchHistoryDTO';

function insertFunction(entity: saveHistoryDTO) {
  return new Promise((resolve, reject) => {
    db.SearchHistory.findOne({
      where: { UserEmail: entity.UserEmail, title: entity.title },
      raw: true,
    })
      .then(async (ret) => {
        if (!ret) {
          console.log('??!!?!?!?!?!!?');
          await db.SearchHistory.create(entity);
          resolve('create search history');
        } else {
          console.log('update!');
          await db.SearchHistory.update(
            { UserEmail: ret.UserEmail },
            { where: { UserEmail: ret.UserEmail, title: ret.title } }
          );
          resolve('update search history');
        }
      })
      .catch((err) => {
        reject(err);
      });
  });
}

export async function save(history: saveHistoryDTO[]) {
  try {
    const promises = [];

    for (let idx in history) {
      promises.push(insertFunction(history[idx]));
    }

    await Promise.all(promises).catch((err) => {
      throw err;
    });

    return {
      status: 200,
      data: {
        success: true,
        msg: '넌센스 퀴즈 바지가 인사하면,?,,,?,,,? 정답은 검색기록 조회에,,,',
      },
    };
  } catch (err) {
    console.log(err);
    return {
      status: 400,
      data: {
        success: false,
        msg: 'DB update fail',
      },
    };
  }
}

export async function read(userEmail: string) {
  try {
    const result = await db.SearchHistory.findAll({
      where: { UserEmail: userEmail },
      attributes: [
        'title',
        'address',
        'latitude',
        'longitude',
        [Sequelize.fn('date_format', Sequelize.col('updatedAt'), '%Y-%m-%d'), 'date'],
      ],
      order: [['updatedAt', 'DESC']],
      raw: true,
    });

    const history: readHistoryDTO[] = [];

    result.forEach((value) => {
      const date = (value['date'] as string).split('-');

      const entity: readHistoryDTO = {
        title: value.title,
        address: value.address,
        latitude: value.latitude,
        longitude: value.longitude,
        year: date[0],
        month: date[1],
        day: date[2],
      };
      history.push(entity);
    });

    return {
      status: 200,
      data: {
        success: true,
        msg: '하의. 하하푸하하하 재밌다',
        data: history,
      },
    };
  } catch (err) {
    console.log(err);
    return {
      status: 400,
      data: {
        success: false,
        msg: 'DB update fail',
      },
    };
  }
}
