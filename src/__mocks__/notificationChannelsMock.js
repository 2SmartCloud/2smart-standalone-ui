export const NOTIFICATION_CHANNELS_LIST_MOCK = [
    {
        "name": "Telegram",
        "type": "telegram",
        "configuration": {
            "fields": [
                {
                    "name": "chatId",
                    "type": "string",
                    "label": "Chat_id*",
                    "validation": [
                        "required",
                        "not_empty"
                    ],
                    "placeholder": "Telegram chat id"
                },
                {
                    "name": "token",
                    "type": "string",
                    "label": "Token*",
                    "validation": [
                        "required",
                        "not_empty"
                    ],
                    "placeholder": "Telegram API token"
                }
            ]
        },
        "icon": "foo/bar/telegram_icon.svg"
    },
    {
        "name": "Slack",
        "type": "slack",
        "configuration": {
            "fields": [
                {
                    "name": "webhook",
                    "type": "string",
                    "label": "Webhook*",
                    "validation": [
                        "required",
                        "not_empty"
                    ],
                    "placeholder": "Slack API token"
                }
            ]
        },
        "icon": "foo/bar/slack_icon.svg"
    }
];


export const USER_NOTIFICATION_CHANNELS_LIST_MOCK = [
    {
        "id": "1",
        "entityTopic": "notification-channels/9tw9wlpjs5txj8m0rqxx",
        "alias": "spppp",
        "configuration": {
            "chatId": "dd",
            "token": "dd"
        },
        "state": "enabled",
        "type": "telegram"
    },
    {
        "id": "2",
        "entityTopic": "notification-channels/kxc3h9uvlahgkgznqp65",
        "alias": "someVeryyyySpecialBot",
        "configuration": {
            "chatId": "417549154",
            "token": "bot1127564229:AAEKxtXiJCfDYZyEK60hlQYMytdFhdEfQNc"
        },
        "state": "enabled",
        "type": "telegram"
    },
    {
        "id": "3",
        "entityTopic": "notification-channels/isqexpsto3p5mngrir8x",
        "alias": "dddffflll",
        "configuration": {
            "webhook": "ddddd"
        },
        "state": "enabled",
        "type": "slack"
    },
    {
        "id": "4",
        "entityTopic": "notification-channels/xj4kd15vup0f6igxyvep",
        "alias": "dd",
        "configuration": {
            "webhook": "ddd"
        },
        "state": "enabled",
        "type": "slack"
    },
    {
        "id": "5",
        "entityTopic": "notification-channels/8a7kbvio67ffn244hwn2",
        "alias": "yy",
        "configuration": {
            "webhook": "yy"
        },
        "state": "enabled",
        "type": "slack"
    },
    {
        "id": "6",
        "entityTopic": "notification-channels/hh67zblvaal69b37tw7i",
        "alias": "yy66",
        "configuration": {
            "webhook": "yyy"
        },
        "state": "enabled",
        "type": "slack"
    },
    {
        "id": "7",
        "entityTopic": "notification-channels/jqbwx7197te5fb3hbmf5",
        "alias": ";ll;j;j",
        "configuration": {
            "webhook": "glglglgl"
        },
        "state": "enabled",
        "type": "slack"
    },
    {
        "id": "8",
        "entityTopic": "notification-channels/isqexpsto3p5mngrir8x",
        "alias": "dddffflll",
        "configuration": {
            "webhook": "ddddd"
        },
        "state": "enabled",
        "type": "slack"
    },
    {
        "id": "9",
        "entityTopic": "notification-channels/xj4kd15vup0f6igxyvep",
        "alias": "dd",
        "configuration": {
            "webhook": "ddd"
        },
        "state": "enabled",
        "type": "slack"
    },
    {
        "id": "10",
        "entityTopic": "notification-channels/8a7kbvio67ffn244hwn2",
        "alias": "yy",
        "configuration": {
            "webhook": "yy"
        },
        "state": "enabled",
        "type": "slack"
    },
    {
        "id": "11",
        "entityTopic": "notification-channels/hh67zblvaal69b37tw7i",
        "alias": "yy66",
        "configuration": {
            "webhook": "yyy"
        },
        "state": "enabled",
        "type": "slack"
    },
    {
        "id": "12",
        "entityTopic": "notification-channels/jqbwx7197te5fb3hbmf5",
        "alias": ";ll;j;j",
        "configuration": {
            "webhook": "glglglgl"
        },
        "state": "enabled",
        "type": "slack"
    },
    {
        "id": "13",
        "entityTopic": "notification-channels/isqexpsto3p5mngrir8x",
        "alias": "dddffflll",
        "configuration": {
            "webhook": "ddddd"
        },
        "state": "enabled",
        "type": "slack"
    },
    {
        "id": "14",
        "entityTopic": "notification-channels/xj4kd15vup0f6igxyvep",
        "alias": "dd",
        "configuration": {
            "webhook": "ddd"
        },
        "state": "enabled",
        "type": "slack"
    },
    {
        "id": "15",
        "entityTopic": "notification-channels/8a7kbvio67ffn244hwn2",
        "alias": "yy",
        "configuration": {
            "webhook": "yy"
        },
        "state": "enabled",
        "type": "slack"
    },
    {
        "id": "16",
        "entityTopic": "notification-channels/hh67zblvaal69b37tw7i",
        "alias": "yy66",
        "configuration": {
            "webhook": "yyy"
        },
        "state": "enabled",
        "type": "slack"
    },
    {
        "id": "17",
        "entityTopic": "notification-channels/jqbwx7197te5fb3hbmf5",
        "alias": ";ll;j;j",
        "configuration": {
            "webhook": "glglglgl"
        },
        "state": "enabled",
        "type": "slack"
    },
    {
        "id": "18",
        "entityTopic": "notification-channels/xj4kd15vup0f6igxyvep",
        "alias": "dd",
        "configuration": {
            "webhook": "ddd"
        },
        "state": "enabled",
        "type": "slack"
    },
    {
        "id": "19",
        "entityTopic": "notification-channels/8a7kbvio67ffn244hwn2",
        "alias": "yy",
        "configuration": {
            "webhook": "yy"
        },
        "state": "enabled",
        "type": "slack"
    },
    {
        "id": "20",
        "entityTopic": "notification-channels/hh67zblvaal69b37tw7i",
        "alias": "yy66",
        "configuration": {
            "webhook": "yyy"
        },
        "state": "enabled",
        "type": "slack"
    },
    {
        "id": "21",
        "entityTopic": "notification-channels/jqbwx7197te5fb3hbmf5",
        "alias": ";ll;j;j",
        "configuration": {
            "webhook": "glglglgl"
        },
        "state": "enabled",
        "type": "slack"
    }
];
