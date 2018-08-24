<?php

namespace App\Http\Controllers;

use App\Models\Deal;
use App\Transformers\DealTransformer;
use League\Fractal\Serializer\DataArraySerializer;

class AppController extends Controller
{
    public function index()
    {
        return view('app');
    }
}
