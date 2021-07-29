import { Sequelize } from 'sequelize';
import sequelize from '../loaders/database';

import Preview from './Preview';
import Detail from './Detail';
import User from './User';
import SearchHistory from './SearchHistory';

import Banner from './Banner';
import Local from './Local';
import CustomTheme from './CustomTheme';

/* User - Preview(post) */
User.hasMany(Detail, {
  foreignKey: 'UserId',
  sourceKey: 'Id',
});
Detail.belongsTo(User, { foreignKey: 'UserId', targetKey: 'Id' });

/* Preview - Detail */
Preview.hasOne(Detail, {
  foreignKey: 'PostId',
  sourceKey: 'Id',
});
Detail.belongsTo(Preview, {
  foreignKey: 'PostId',
  targetKey: 'Id',
});

/* User - SearchHistory */
User.hasMany(SearchHistory, {
  foreignKey: 'UserId',
  sourceKey: 'Id',
});
SearchHistory.belongsTo(User, { foreignKey: 'UserId', targetKey: 'Id' });

/* liked & saved Post */
Preview.belongsToMany(User, { timestamps: false, through: 'liked_post' });
Preview.belongsToMany(User, { timestamps: false, through: 'saved_post' });

/* follow - User */
User.belongsToMany(User, {
  as: 'following',
  timestamps: false,
  through: 'follow',
  foreignKey: 'followed',
});
User.belongsToMany(User, {
  as: 'follower',
  timestamps: false,
  through: 'follow',
  foreignKey: 'follower',
});

export const db = {
  Sequelize,
  sequelize,

  // table
  User,
  Preview,
  Detail,
  SearchHistory,

  Banner,
  Local,
  CustomTheme,
};
