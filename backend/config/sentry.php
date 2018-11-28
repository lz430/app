<?php

return [
    'dsn' => env('SENTRY_DSN'),

    // capture release as git sha
    'release' => (in_array(config('app.env'), ['staging', 'production']) ? trim(exec('cd ../ && git log --pretty="%h" -n1 HEAD')) : 'local'),

    // Capture bindings on SQL queries
    'breadcrumbs.sql_bindings' => true,

    // Capture default user context
    'user_context' => true,
];
