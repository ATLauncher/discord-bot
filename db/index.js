import Datastore from 'nedb';

const db = {
    messages: new Datastore({
        filename: `${__dirname}/messages.db`,
        timestampData: true,
        autoload: true
    }),
    users: new Datastore({
        filename: `${__dirname}/users.db`,
        timestampData: true,
        autoload: true
    })
};

export default db;