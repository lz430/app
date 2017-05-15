<?php

namespace App\Http\Controllers;

use App\JATO\Make;
use App\JATO\Version;
use App\JATO\VersionOption;
use Illuminate\Http\Request;

class StepController extends Controller
{
    public function initiate()
    {
        return view('initiate');
    }

    public function stepZero()
    {
        $versionsGrouped = Version::where('model_id', request()->input('model_id'))
            ->get()
            ->groupBy('trim_name')
            ->map(function ($group) {
                return $group->groupBy('body_style');
            });

        return view('step-1-versions')->with('versionsGrouped', $versionsGrouped);
    }

    public function stepOne()
    {
        $options = VersionOption::where('version_id', request()->input('version_id'))->get();

        return view('step-2-options')
            ->with('options', $options)
            ->with('version', Version::findOrFail(request()->input('version_id')))
            ->with('versionId', request()->input('version_id'));
    }

    public function stepTwo()
    {
        $options = VersionOption::where('version_id', request()->input('version_id'))->get();
        $version = Version::with('taxesAndDiscounts')->findOrFail(request()->input('version_id'));
        $selectedOptions = VersionOption::whereIn('id', request()->input('option_ids', []))->get();

        return view('step-3-buy-or-save')
            ->with('options', $options)
            ->with('selectedOptions', $selectedOptions)
            ->with('selectedOptionIds', request()->input('option_ids'))
            ->with('version', $version);
    }
}
