import { DataTypes, Model, Sequelize } from 'sequelize';
import sequelize from '../loaders/database';

export default class Push extends Model {
  public Id!: number;
  public isRead!: boolean;

  public pushCode!: number;
  public image!: string;
  public token!: string;

  public createdAt!: Date;

  public title!: string;
  public body!: string;

  public static associations: {};
}

Push.init(
  {
    Id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    isRead: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    pushCode: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    image: {
      type: DataTypes.STRING(100),
      defaultValue: '*',
    },
    token: {
      type: DataTypes.STRING(50),
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: Sequelize.fn('now'),
    },
    title: {
      type: DataTypes.STRING(10),
    },
    body: {
      type: DataTypes.STRING(30),
    },
  },
  {
    modelName: 'Push',
    tableName: 'push',
    sequelize,
    freezeTableName: true,
    timestamps: false,
    charset: 'utf8',
    collate: 'utf8_unicode_ci',
  }
);
