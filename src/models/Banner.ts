import { DataTypes, Model } from 'sequelize';
import sequelize from '../loaders/database';

export default class Banner extends Model {
  public Id!: number;
  public bannerTitle!: string;
  public bannerImage!: string;
  public bannerTag!: string;

  public static associations: {};
}

Banner.init(
  {
    Id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    bannerTitle: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    bannerImage: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    bannerTag: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
  },
  {
    modelName: 'Banner',
    tableName: 'banner',
    sequelize,
    freezeTableName: true,
    timestamps: false,
    charset: 'utf8',
    collate: 'utf8_unicode_ci',
  }
);
