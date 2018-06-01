<?php

namespace App\Http\Controllers;

class BrowseController extends Controller
{
    public function index()
    {
        return view('browse');
    }
}