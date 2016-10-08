import Datastore from 'nedb';

export default {
    messages: new Datastore({
        filename: `./db/messages.db`,
        timestampData: true,
        autoload: true
    }),
    users: new Datastore({
        filename: `./db/users.db`,
        timestampData: true,
        autoload: true
    })
};