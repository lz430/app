<?php

namespace App\Console\Commands\Tests;

use Illuminate\Console\Command;
use App\Mail\ApplicationSubmittedDMR;
use Illuminate\Support\Facades\Mail;

class TestEmail extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'dmr:test:email';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Quick and dirty cox api test';


    /**
     * Execute the console command.
     */
    public function handle()
    {
        Mail::to('mattwisner@gmail.com')->send(new ApplicationSubmittedDMR());

    }
}
