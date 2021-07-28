import { DataTypes, Model } from 'sequelize';
import sequelize from '../loaders/database';

export default class Local extends Model {
  public Id!: number;
  public localTitle!: string;
  public localCity!: string;

  public static associations: {};
}

Local.init(
  {
    Id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    localTitle: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    localCity: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
  },
  {
    modelName: 'Local',
    tableName: 'local',
    sequelize,
    freezeTableName: true,
    timestamps: false,
    charset: 'utf8',
    collate: 'utf8_unicode_ci',
  }
);
