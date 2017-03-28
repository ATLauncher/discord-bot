import AWS from 'aws-sdk';
import Datastore from 'nedb-promise';

import config from './config';

export const usingAWS = !!config.db;

const databases = {
    nedb: !usingAWS && {
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
    },
    dynamodb: usingAWS && {
        messages: new AWS.DynamoDB.DocumentClient({
            ...config.db.messages,
            logger: console
        }),
        users: new AWS.DynamoDB.DocumentClient({
            ...config.db.users,
            logger: console
        })
    }
};

export async function findUserByID(id) {
    if (usingAWS) {
        const params = {
            Key: {
                id: parseInt(id, 10)
            }
        };

        return await new Promise((resolve, reject) => {
            databases.dynamodb.users.get(params, function (err, data) {
                if (err) {
                    return reject(err);
                }

                // DynamoDB returns an empty object if not found, so resolve that as a null
                if (Object.keys(data).length === 0 && data.constructor === Object) {
                    return resolve(null);
                }

                resolve(data.Item);
            });
        });
    } else {
        return await databases.nedb.users.findOne({id});
    }
}

/**
 * This will update a user in the database by a given ID, upserting it if it doesn't exist.
 *
 * @param {number} id
 * @param {object} data
 */
export function updateUserByID(id, data) {
    if (usingAWS) {
        const params = {
            Key: {
                id: parseInt(id, 10)
            },
            ExpressionAttributeValues: {
                ":1": data.warnings,
                ":2": data.username,
                ":3": data.discriminator
            },
            ExpressionAttributeNames: {
                "#1": "warnings",
                "#2": "username",
                "#3": "discriminator"
            },
            UpdateExpression: "SET #1=:1, #2=:2, #3=:3",
            ReturnValues: "ALL_NEW"
        };

        return new Promise((resolve, reject) => {
            databases.dynamodb.users.update(params, function (err, data) {
                if (err) {
                    return reject(err);
                }

                resolve(data);
            });
        });
    } else {
        return databases.nedb.users.update({id}, data, {upsert: true});
    }
}

/**
 * This will update a message in the database by a given ID, upserting it if it doesn't exist.
 *
 * @param {number} id
 * @param {object} data
 */
export function updateMessageByID(id, data) {
    if (usingAWS) {
        const params = {
            Key: {
                id: parseInt(id, 10)
            },
            ExpressionAttributeValues: {
                ":1": data.isSystemMessage,
                ":2": data.isBotMessage,
                ":3": data.content,
                ":4": {
                    id: data.channel.id,
                    name: data.channel.name
                },
                ":5": {
                    id: data.user.id,
                    username: data.user.username,
                    discriminator: data.user.discriminator
                },
                ":6": data.timestamp,
                ":7": data.deletedAt
            },
            ExpressionAttributeNames: {
                "#1": "isSystemMessage",
                "#2": "isBotMessage",
                "#3": "content",
                "#4": "channel",
                "#5": "user",
                "#6": "timestamp",
                "#7": "deletedAt",
            },
            UpdateExpression: "SET #1=:1, #2=:2, #3=:3, #4=:4, #5=:5, #6=:6, #7=:7",
            ReturnValues: "ALL_NEW"
        };

        return new Promise((resolve, reject) => {
            databases.dynamodb.messages.update(params, function (err, data) {
                if (err) {
                    return reject(err);
                }

                resolve(data);
            });
        });
    } else {
        return databases.nedb.messages.update({id}, data, {upsert: true});
    }
}

/**
 * This will count the number of messages matching provided message in the last x seconds.
 *
 * @param {string} message
 * @param {number} [seconds=30]
 */
export async function countMessagesInLast(message, seconds = 30) {
    let timeAgo = new Date();
    timeAgo.setSeconds(timeAgo.getSeconds() - seconds);

    if (usingAWS) {
        const params = {
            Select: 'COUNT',
            FilterExpression: '#1 == :1 AND #2  > :2',
            ExpressionAttributeValues: {
                ':1': message,
                ':2': timeAgo.toISOString()
            },
            ExpressionAttributeNames: {
                '#1': 'content',
                '#2': 'timestamp'
            },
            ReturnValues: 'ALL_NEW'
        };

        return new Promise((resolve, reject) => {
            databases.dynamodb.messages.scan(params, function (err, data) {
                if (err) {
                    return reject(err);
                }

                resolve(data.Count || 0);
            });
        });
    } else {
        return await databases.nedb.messages.count({
            content: message,
            createdAt: {$gt: timeAgo}
        });
    }
}