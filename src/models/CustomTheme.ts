import { DataTypes, Model } from 'sequelize';
import sequelize from '../loaders/database';

export default class Custom extends Model {
  public Id!: number;
  public customThemeTitle!: string;
  public customTheme!: string;

  public static associations: {};
}

Custom.init(
  {
    Id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    customThemeTitle: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    customTheme: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
  },
  {
    modelName: 'CustomTheme',
    tableName: 'customTheme',
    sequelize,
    freezeTableName: true,
    timestamps: false,
    charset: 'utf8',
    collate: 'utf8_unicode_ci',
  }
);
