import { DataTypes, Model, Sequelize } from 'sequelize';
import sequelize from '../loaders/database';

export default class Push extends Model {
  public Id!: number;
  public isRead!: boolean;

  public createdAt!: Date;

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
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: Sequelize.fn('now'),
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
