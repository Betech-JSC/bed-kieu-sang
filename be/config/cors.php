<?php

return [
    'paths' => ['api/*'],
    'allowed_methods' => ['*'],
    'allowed_origins' => [
        env('FRONTEND_URL', 'https://xongnhatayue.vn'),
        env('FRONTEND_WWW_URL', 'https://www.xongnhatayue.vn'),
        env('CMS_URL', 'https://cms.xongnhatayue.vn'),
        env('CMS_WWW_URL', 'https://www.cms.xongnhatayue.vn'),
        'http://localhost:3000',
        'http://127.0.0.1:3000',
    ],
    'allowed_origins_patterns' => [
        '#^https?://([a-z0-9-]+\.)?xongnhatayue\.vn$#',
    ],
    'allowed_headers' => ['*'],
    'exposed_headers' => [],
    'max_age' => 0,
    'supports_credentials' => false,
];
