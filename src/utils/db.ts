import { sub } from 'date-fns';
import Datastore from 'nedb-promises';

export interface Message {
    id: string;
    userID: string;
    isSystemMessage: boolean;
    isBotMessage: boolean;
    content: string;
    channel: {
        id: string;
        name: string;
    };
    user: {
        id: string;
        username: string;
        discriminator: string;
    };
    timestamp: string;
}

export interface Setting<T> {
    name: T;
    value: T;
}

export interface User {
    id: string;
    hasSeenTLauncherMessage: boolean;
    hasBeenSentJoinMessage: boolean;
    username: string;
    warnings?: number;
    discriminator: string;
}

export const databases = {
    messages: Datastore.create({
        filename: './db/messages.db',
        timestampData: true,
        autoload: true,
    }),

    settings: Datastore.create({
        filename: './db/settings.db',
        timestampData: true,
        autoload: true,
    }),

    users: Datastore.create({
        filename: './db/users.db',
        timestampData: true,
        autoload: true,
    }),
};

/**
 * This will find a user by the given id.
 */
export const findUserByID = (id: string): Promise<User> => {
    return databases.users.findOne<User>({ id });
};

/**
 * This will update a user in the database by a given ID, upserting it if it doesn't exist.
 */
export const updateUserByID = (id: string, data: Partial<User>): Promise<User> => {
    return databases.users.update<User>({ id }, data, { upsert: true, returnUpdatedDocs: true });
};

/**
 * This will update a message in the database by a given ID, upserting it if it doesn't exist.
 */
export const updateMessageByID = (id: string, data: Partial<Message>): Promise<Message> => {
    return databases.messages.update<Message>({ id }, data, { upsert: true, returnUpdatedDocs: true });
};

/**
 * This will count the number of messages matching provided message in the last x seconds.
 */
export const countMessagesInLast = (message: string, seconds = 30): Promise<number> => {
    return databases.messages.count({
        content: message,
        createdAt: { $gt: sub(new Date(), { seconds }) },
    });
};

/**
 * This will get a setting by the given name.
 */
export const getSetting = async <T = string>(name: string, defaultValue: T): Promise<T> => {
    if (!(await databases.settings.count({ name }))) {
        return defaultValue;
    }

    const setting = await databases.settings.findOne<Setting<T>>({ name });

    return setting.value;
};

/**
 * This will update a setting in the DB, upserting it if it doesn't exist.
 */
export const updateSetting = <T = string>(name: string, value: T): Promise<Setting<T>> => {
    return databases.settings.update(
        { name },
        {
            name,
            value,
        },
        { upsert: true, returnUpdatedDocs: true },
    );
};
