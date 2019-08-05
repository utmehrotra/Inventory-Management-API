import mongoose from 'mongoose';


interface UserFormValues  {
    user: string;
    pass: string;
    srv?: boolean;
    host: string;
    database: string;
    port: number;
};

export class MongoConnector {
    private _mongoConfig: UserFormValues;
  setConfig(value) {
    this._mongoConfig = value;
    return this;
  }

  async connect() {
    const {user, pass, srv} = this._mongoConfig;
    const url = this._getMongoURL();
    const mongoOptions = {
      useNewUrlParser: true,
      reconnectTries: 2,
      reconnectInterval: 500, // Reconnect every 500ms
      connectTimeoutMS: 5000,
      ...(srv && {user, pass})
    };

    return new Promise((resolve, reject) => {
      mongoose.connect(url, mongoOptions, (err, response) => {
        if (err) return reject(err);
        resolve(response);
      });
    });
  }

  _getMongoURL() {
    const {host, database, user, pass, port, srv} = this._mongoConfig;
    const authPart = pass ? `${user}:${pass}@` : '';
    if (srv) {
      return `mongodb+srv://${host}/${database}?ssl=true&authSource=admin`;
    }
    return `mongodb://${authPart}${host}:${port}/${database}`;
  }
}
