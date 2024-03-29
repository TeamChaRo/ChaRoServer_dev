import { Sequelize } from 'sequelize';
import sequelize from '../loaders/database';

import Preview from './Preview';
import Detail from './Detail';
import User from './User';
import SearchHistory from './SearchHistory';

import Banner from './Banner';
import Local from './Local';
import CustomTheme from './CustomTheme';

import Push from './Push';

/* User - Preview(post) */
User.hasMany(Detail, {
  foreignKey: 'UserEmail',
  sourceKey: 'email',
});
Detail.belongsTo(User, { foreignKey: 'UserEmail', targetKey: 'email' });

/* User - Push */
User.hasMany(Push, {
  foreignKey: 'UserEmail',
  sourceKey: 'email',
});
Push.belongsTo(User, { foreignKey: 'UserEmail', targetKey: 'email' });

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
  foreignKey: 'UserEmail',
  sourceKey: 'email',
});
SearchHistory.belongsTo(User, { foreignKey: 'UserEmail', targetKey: 'email' });

/* liked & saved Post */
Preview.belongsToMany(User, { as: 'like', timestamps: false, through: 'likedPost' });
Preview.belongsToMany(User, { as: 'save', timestamps: false, through: 'savedPost' });

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

  Push,
};
