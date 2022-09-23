import type { PermissionResolvable } from 'discord.js';

export const COLOURS: { [name: string]: number } = {
    GREEN: 4289797,
    RED: 13632027,
    YELLOW: 16098851,
    PRIMARY: 9028150,
};

export const PERMISSIONS: { [name: string]: PermissionResolvable } = {
    MANAGE_MESSAGES: 'ManageMessages',
    BAN_MEMBERS: 'BanMembers',
    ADMINISTRATOR: 'Administrator',
};
