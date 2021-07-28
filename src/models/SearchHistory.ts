import { DataTypes, Model } from 'sequelize';
import sequelize from '../loaders/database';

export default class SearchHistory extends Model {
  public UserId!: string;
  public title!: string;
  public address!: string;
  public latitude!: string;
  public longitude!: string;

  public static associations: {};
}

SearchHistory.init(
  {
    UserId: {
      type: DataTypes.STRING(20),
      primaryKey: true,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING(20),
      primaryKey: true,
      allowNull: false,
    },
    address: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    latitude: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    longitude: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
  },
  {
    modelName: 'SearchHistory',
    tableName: 'searchHistory',
    sequelize,
    freezeTableName: true,
    timestamps: true,
    charset: 'utf8',
    collate: 'utf8_unicode_ci',
  }
);
