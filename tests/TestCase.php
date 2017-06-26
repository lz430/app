<?php

namespace Tests;

use Illuminate\Foundation\Console\Kernel;
use Illuminate\Foundation\Testing\TestCase as BaseTestCase;

abstract class TestCase extends BaseTestCase
{
    use DatabaseSetup;

    protected $baseUrl = 'http://localhost';

    public function createApplication()
    {
        $app = require __DIR__.'/../bootstrap/app.php';

        $app->make(Kernel::class)->bootstrap();

        return $app;
    }

    protected function setUp()
    {
        parent::setUp();
        $this->setupDatabase();
    }
}
