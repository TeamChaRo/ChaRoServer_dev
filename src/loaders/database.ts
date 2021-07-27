import { Sequelize } from "sequelize";
import config from "../config/config";

const sequelize = new Sequelize(
  config.database as string,
  config.username as string,
  config.password as string,
  {
    host: config.host as string,
    port: parseInt(config.port) as number,
    dialect: "mysql",
    logging: false,
  }
);

const connectDB = async () => {
  try {
    await sequelize
      .authenticate()
      .then(async () => {
        console.log("connection success");
      })
      .catch((e) => {
        console.log("TT : ", e);
      });

    const options = {
      force: config.env === "db_test" ? true : false,
    };

    //db.sequelize.sync(options).then(() => console.log("Table created"));
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

export default {
  sequelize,
  connectDB,
};
