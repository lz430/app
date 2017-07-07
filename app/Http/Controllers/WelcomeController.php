<?php

namespace App\Http\Controllers;

use DeliverMyRide\JATO\BodyStyles;

class WelcomeController extends Controller
{
    public function index()
    {
        return view('welcome')->with('styles', BodyStyles::ALL);
    }
}
