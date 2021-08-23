import { DataTypes, Model } from 'sequelize';
import sequelize from '../loaders/database';

export default class Detail extends Model {
  public PostId!: number;
  public province!: string;
  public isParking!: boolean;
  public parkingDesc!: string;
  public courseDesc!: string;

  //Course Information
  public src!: string;
  public srcLongitude!: string;
  public srcLatitude!: string;

  public wayPoint!: string;
  public wayLongitude!: string;
  public wayLatitude!: string;

  public dest!: string;
  public destLongitude!: string;
  public destLatitude!: string;

  // Image information
  public image1!: string;
  public image2!: string;
  public image3!: string;
  public image4!: string;
  public image5!: string;

  // Theme information (boolean)
  public spring!: boolean;
  public summer!: boolean;
  public fall!: boolean;
  public winter!: boolean;
  public mountain!: boolean;
  public sea!: boolean;
  public lake!: boolean;
  public river!: boolean;
  public oceanRoad!: boolean;
  public blossom!: boolean;
  public maple!: boolean;
  public relax!: boolean;
  public speed!: boolean;
  public nightView!: boolean;
  public cityView!: boolean;

  // Warning information (boolean)
  public highway!: boolean;
  public mountainRoad!: boolean;
  public diffRoad!: boolean;
  public hotPlace!: boolean;
}

Detail.init(
  {
    PostId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    province: {
      type: DataTypes.STRING(45),
    },
    isParking: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    parkingDesc: {
      type: DataTypes.STRING(45),
    },
    courseDesc: {
      type: DataTypes.STRING(280),
    },
    // course
    src: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    srcLongitude: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    srcLatitude: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    wayPoint: {
      type: DataTypes.STRING(100),
    },
    wayLongitude: {
      type: DataTypes.STRING(20),
    },
    wayLatitude: {
      type: DataTypes.STRING(20),
    },
    dest: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    destLongitude: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    destLatitude: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    // other images
    image1: {
      type: DataTypes.STRING(100),
    },
    image2: {
      type: DataTypes.STRING(100),
    },
    image3: {
      type: DataTypes.STRING(100),
    },
    image4: {
      type: DataTypes.STRING(100),
    },
    image5: {
      type: DataTypes.STRING(100),
    },
    // theme
    spring: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    summer: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    fall: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    winter: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    mountain: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    sea: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    lake: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    river: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    oceanRoad: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    blossom: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    maple: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    relax: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    speed: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    nightView: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    cityView: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    // warning
    highway: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    mountainRoad: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    diffRoad: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    hotPlace: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    modelName: 'Detail',
    tableName: 'detail',
    sequelize,
    timestamps: false,
    freezeTableName: true,
    charset: 'utf8',
    collate: 'utf8_unicode_ci',
  }
);
