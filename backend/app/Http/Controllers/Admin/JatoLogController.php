<?php

namespace App\Http\Controllers\Admin;

use Illuminate\Support\Str;
use App\Http\Controllers\Controller;

class JatoLogController extends Controller
{
    private $file;

    private $groupSort = [
        'Uncategorized Errors' => 'Miscellaneous unexpected errors.',
        '500 server errors from JATO' => 'Internal errors within JATO hosted servers.',
        '400 errors looking up features' => 'Vehicle ID is not within DMR license. (But if so, why is our code even looking up the feature set?)',
        '403 errors looking up features' => 'Authentication error has occured due to an incorrect or expired authorization token.',
        '403 errors looking up equipment' => 'Authentication error has occured due to an incorrect or expired authorization token.',
        '404 errors decoding a VIN' => 'VIN pattern is out of JATO research scope.',
        '403 errors decoding a VIN' => 'Authentication error has occured due to an incorrect or expired authorization token.',
        'We could not match VIN->Version' => 'Our current logic for matching the VIN to one of multiple returned versions could not pick the best version here.',
        'Internal errors to DMR MySQL' => 'Something we need to fix in our code.',
        '400 errors looking up a version' => 'Vehicle ID is not within DMR license.',
    ];

    public function __construct()
    {
        $this->file = file(storage_path('logs/jato.log'));
    }

    // this file is just throwaway for debug purposes during dev.
    public function index()
    {
        $dates = collect($this->file)->filter(function ($line) {
            return substr($line, 0, 5) == '[2018';
        })->map(function ($line) {
            return substr($line, 1, 10);
        })->unique()->each(function ($date) {
            echo '<a href="/admin/jato-logs/'.$date.'">'.$date.'</a><br>';
        });
    }

    public function showDay($date)
    {
        // Entries are multiple lines of a log file separated by lines with datetime stamps
        $groupSort = array_keys($this->groupSort);
        $entries = [];
        $currentEntry = [];

        foreach ($this->file as $f) {
            // Find start of an entry
            if (substr($f, 0, 5) == '[2018') {
                // Take old entry; add it to the list
                $entries[] = array_filter($currentEntry);
                // Start new entry
                $currentEntry = [$f];
            } elseif (trim($f) != '') {
                // Just add this line to our current entry
                $currentEntry[] = $f;
            }
        }

        echo '<style>.hide{display:none;}.show{display:block;}</style><script>function expand(target, hideLink = true) { document.getElementById("expand-" + target).className = "show"; if (hideLink) {document.getElementById("expand-button-" + target).className = "hide"; } }</script> (click header to expand)';

        collect($entries)->filter(function ($entry) use ($date) {
            // Only get the right date
            return substr(reset($entry), 0, 11) == "[{$date}";
        })->reject(function ($entry) {
            // Drop debug lines
            return str_contains(reset($entry), 'DEBUG: ');
        })->mapToGroups(function ($entry) {
            // Remove specific strings from log lines
            $filteredEntry = collect($entry)->map(function ($line) {
                if (str_contains($line, 'ERROR: ')) {
                    $line = strstr($line, 'ERROR: ');
                }

                return str_replace(['ERROR: ', 'Importer error: ', 'Server error: ', 'Client error: '], ['', '', '', ''], $line);
            })->toArray();

            return [$this->getGroupName($entry) => $filteredEntry];
        })->sortBy(function ($group, $groupName) use ($groupSort) {
            return array_search($groupName, $groupSort);
        })->each(function ($group, $groupName) {
            // Only show unique lines in these 400 errors
            if (/*$groupName == '400 errors looking up a version' || */
                $groupName == '400 errors looking up features') {
                $group = $group->map(function ($item) {
                    return [reset($item)];
                })->unique()->sort();
            }

            // Render each group
            $groupKey = Str::slug($groupName);
            echo '<h2 id="expand-button-'.$groupKey.'" onClick="expand(\''.$groupKey.'\', false); return false;" style="cursor:pointer; margin-top: 2em; margin-bottom: 0;">'.$groupName.' ('.count($group).' errors)</h2>';
            echo '<p style="margin-bottom: 2em; margin-top: 0.25em">'.$this->groupSort[$groupName].'</p>';
            echo "<div id='expand-{$groupKey}' class='hide' style='margin-left: 1em;'>";
            collect($group)->each(function ($entry, $i) use ($groupName) {
                $this->renderEntry($entry, md5($groupName).'-'.$i);
            });
            echo '</div>';
        });
    }

    private function renderEntry($entry, $i)
    {
        $firstLine = array_shift($entry);
        echo '<pre>'.htmlentities($firstLine).'</pre>';

        if (count($entry) > 0) {
            echo '<a id="expand-button-'.$i.'" href="#" onClick="expand(\''.$i.'\'); return false;">[expand]</a>';
            echo '<pre id="expand-'.$i.'" class="hide">';
            echo htmlentities(implode("\n", $entry));
            echo '</pre>';
        }
    }

    private function getGroupName($entry)
    {
        $firstLine = reset($entry);

        if (str_contains($firstLine, '/features/') &&
            str_contains($firstLine, '400 Bad Request')) {
            return '400 errors looking up features';
        }

        if (str_contains($firstLine, '/features/') &&
            str_contains($firstLine, '403 Forbidden')) {
            return '403 errors looking up features';
        }

        if (str_contains($firstLine, '/equipment/') &&
            str_contains($firstLine, '403 Forbidden')) {
            return '403 errors looking up equipment';
        }

        if (str_contains($firstLine, '/vin/decode') &&
            str_contains($firstLine, '404 Not Found')) {
            return '404 errors decoding a VIN';
        }

        if (str_contains($firstLine, '/vin/decode') &&
            str_contains($firstLine, '403 Forbidden')) {
            return '403 errors decoding a VIN';
        }

        if (str_contains($firstLine, 'Could not find exact match for VIN')) {
            return 'We could not match VIN->Version';
        }

        if (str_contains($firstLine, '/versions/') &&
            str_contains($firstLine, '400 Bad Request')) {
            return '400 errors looking up a version';
        }

        if (str_contains($firstLine, 'Integrity constraint')) {
            return 'Internal errors to DMR MySQL';
        }

        if (str_contains($firstLine, '500 Internal Server Error')) {
            return '500 server errors from JATO';
        }

        return 'Uncategorized Errors';
    }
}
