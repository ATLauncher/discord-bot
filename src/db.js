import AWS from 'aws-sdk';
import Datastore from 'nedb-promise';

import config from 'config';

export const usingAWS = !!config.has('db');

const databases = {
    nedb: !usingAWS && {
        messages: new Datastore({
            filename: `./db/messages.db`,
            timestampData: true,
            autoload: true,
        }),
        settings: new Datastore({
            filename: `./db/settings.db`,
            timestampData: true,
            autoload: true,
        }),
        users: new Datastore({
            filename: `./db/users.db`,
            timestampData: true,
            autoload: true,
        }),
    },
    dynamodb: usingAWS && {
        messages: new AWS.DynamoDB.DocumentClient({
            ...config.get('db.messages'),
        }),
        settings: new AWS.DynamoDB.DocumentClient({
            ...config.get('db.settings'),
        }),
        users: new AWS.DynamoDB.DocumentClient({
            ...config.get('db.users'),
        }),
    },
};

/**
 * This will find a user by the given id.
 *
 * @export
 * @param {number} id
 * @returns {object|null}
 */
export async function findUserByID(id) {
    if (usingAWS) {
        const params = {
            Key: {
                id: parseInt(id, 10),
            },
        };

        return await new Promise((resolve, reject) => {
            databases.dynamodb.users.get(params, function (err, data) {
                if (err) {
                    return reject(err);
                }

                // the DynamoDB package will return an empty object if not found, so resolve that as a null
                if (Object.keys(data).length === 0 && data.constructor === Object) {
                    return resolve(null);
                }

                return resolve(data.Item);
            });
        });
    }

    return await databases.nedb.users.findOne({ id });
}

/**
 * This will update a user in the database by a given ID, upserting it if it doesn't exist.
 *
 * @param {number} id
 * @param {object} data
 * @returns {Promise}
 */
export function updateUserByID(id, data) {
    if (usingAWS) {
        const params = {
            Key: {
                id: parseInt(id, 10),
            },
            ExpressionAttributeValues: {
                ':1': data.warnings,
                ':2': data.username,
                ':3': data.discriminator,
            },
            ExpressionAttributeNames: {
                '#1': 'warnings',
                '#2': 'username',
                '#3': 'discriminator',
            },
            UpdateExpression: 'SET #1=:1, #2=:2, #3=:3',
            ReturnValues: 'ALL_NEW',
        };

        return new Promise((resolve, reject) => {
            databases.dynamodb.users.update(params, function (err, data) {
                if (err) {
                    return reject(err);
                }

                return resolve(data);
            });
        });
    }

    return databases.nedb.users.update({ id }, data, { upsert: true });
}

/**
 * This will update a message in the database by a given ID, upserting it if it doesn't exist.
 *
 * @param {number} id
 * @param {object} data
 * @returns {Promise}
 */
export function updateMessageByID(id, data) {
    if (usingAWS) {
        const params = {
            Key: {
                id: parseInt(id, 10),
            },
            ExpressionAttributeValues: {
                ':1': data.isSystemMessage,
                ':2': data.isBotMessage,
                ':3': data.content,
                ':4': {
                    id: data.channel.id,
                    name: data.channel.name,
                },
                ':5': {
                    id: data.user.id,
                    username: data.user.username,
                    discriminator: data.user.discriminator,
                },
                ':6': data.timestamp,
                ':7': data.deletedAt,
            },
            ExpressionAttributeNames: {
                '#1': 'isSystemMessage',
                '#2': 'isBotMessage',
                '#3': 'content',
                '#4': 'channel',
                '#5': 'user',
                '#6': 'timestamp',
                '#7': 'deletedAt',
            },
            UpdateExpression: 'SET #1=:1, #2=:2, #3=:3, #4=:4, #5=:5, #6=:6, #7=:7',
            ReturnValues: 'ALL_NEW',
        };

        return new Promise((resolve, reject) => {
            databases.dynamodb.messages.update(params, function (err, data) {
                if (err) {
                    return reject(err);
                }

                return resolve(data);
            });
        });
    }

    return databases.nedb.messages.update({ id }, data, { upsert: true });
}

/**
 * This will count the number of messages matching provided message in the last x seconds.
 *
 * @param {string} message
 * @param {number} [seconds=30]
 * @returns {Promise}
 */
export async function countMessagesInLast(message, seconds = 30) {
    // eslint-disable-next-line prefer-const
    let timeAgo = new Date();

    timeAgo.setSeconds(timeAgo.getSeconds() - seconds);

    if (usingAWS) {
        const params = {
            Select: 'COUNT',
            FilterExpression: '#1 = :1 AND #2 > :2',
            ExpressionAttributeValues: {
                ':1': message,
                ':2': timeAgo.toISOString(),
            },
            ExpressionAttributeNames: {
                '#1': 'content',
                '#2': 'timestamp',
            },
            ReturnValues: 'ALL_NEW',
        };

        return new Promise((resolve, reject) => {
            databases.dynamodb.messages.scan(params, function (err, data) {
                if (err) {
                    return reject(err);
                }

                return resolve(data.Count || 0);
            });
        });
    }

    return await databases.nedb.messages.count({
        content: message,
        createdAt: { $gt: timeAgo },
    });
}

/**
 * This will get a setting by the given name.
 *
 * @export
 * @param {string} name
 * @param {any} defaultValue
 * @returns {object|null}
 */
export async function getSetting(name, defaultValue) {
    if (usingAWS) {
        const params = {
            Key: {
                name: name,
            },
        };

        return await new Promise((resolve, reject) => {
            databases.dynamodb.settings.get(params, function (err, data) {
                if (err) {
                    return reject(err);
                }

                // the DynamoDB package will return an empty object if not found, so resolve that as a null
                if (Object.keys(data).length === 0 && data.constructor === Object) {
                    return resolve(defaultValue);
                }

                return resolve(data.Item);
            });
        });
    }

    if (!(await databases.nedb.settings.count({ name }))) {
        return defaultValue;
    }

    return await databases.nedb.settings.findOne({ name });
}

/**
 * This will update a setting in the DB, upserting it if it doesn't exist.
 *
 * @param {string} name
 * @param {any} value
 * @returns {Promise}
 */
export function updateSetting(name, value) {
    if (usingAWS) {
        const params = {
            Key: {
                name: name,
            },
            ExpressionAttributeValues: {
                ':1': value,
            },
            ExpressionAttributeNames: {
                '#1': 'value',
            },
            UpdateExpression: 'SET #1=:1',
            ReturnValues: 'ALL_NEW',
        };

        return new Promise((resolve, reject) => {
            databases.dynamodb.settings.update(params, function (err, data) {
                if (err) {
                    return reject(err);
                }

                return resolve(data);
            });
        });
    }

    return databases.nedb.settings.update({ name }, { [name]: value }, { upsert: true });
}
