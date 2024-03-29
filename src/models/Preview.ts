import { DataTypes, Model, Sequelize } from 'sequelize';
import sequelize from '../loaders/database';

export default class Preview extends Model {
  public Id!: number;
  public title!: string;
  public image!: string;

  // representative tags
  public region!: string;
  public theme!: string;
  public warning!: string;

  public createdAt!: Date;
  public updatedAt!: Date;
  public static associations: {};
}

Preview.init(
  {
    Id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING(45),
      allowNull: false,
    },
    image: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    region: {
      type: DataTypes.STRING(10),
      allowNull: false,
    },
    theme: {
      type: DataTypes.STRING(10),
      allowNull: false,
    },
    warning: {
      type: DataTypes.STRING(10),
      allowNull: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: Sequelize.fn('now'),
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: Sequelize.fn('now'),
    },
  },
  {
    modelName: 'Preview',
    tableName: 'preview',
    sequelize,
    freezeTableName: true,
    timestamps: true,
    charset: 'utf8',
    collate: 'utf8_unicode_ci',
  }
);
