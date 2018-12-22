<?php

namespace Tests;

use Illuminate\Foundation\Testing\RefreshDatabase;

abstract class TestCaseWithAuth extends TestCase
{
    use CreatesApplication;
    use RefreshDatabase;

    public function setUp()
    {
        parent::setUp();
        $this->artisan('passport:install');
    }
}
