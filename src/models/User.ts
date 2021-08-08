import { DataTypes, Model } from 'sequelize';
import sequelize from '../loaders/database';
import config from '../config/config';

export default class User extends Model {
  public password!: string;
  public email!: string;

  // 소셜 로그인 시, 아래 요소들에 대한 입력 받고 저장하면 된다.
  public nickname!: string;
  public profileImage!: string;
  public marketingPush!: boolean;
  public marketingEmail!: boolean;

  public static associations: {};
}

User.init(
  {
    email: {
      type: DataTypes.STRING(45),
      allowNull: false,
      primaryKey: true,
    },
    password: {
      type: DataTypes.STRING(100),
      allowNull: true, // social 유저를 위해 null값 허용
    },

    nickname: {
      type: DataTypes.STRING(45),
      allowNull: false,
    },
    profileImage: {
      type: DataTypes.STRING(100),
      defaultValue: config.defaultImage,
    },
    marketingPush: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    marketingEmail: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    modelName: 'User',
    tableName: 'user',
    sequelize,
    freezeTableName: true,
    timestamps: false,
    charset: 'utf8',
    collate: 'utf8_unicode_ci',
  }
);
