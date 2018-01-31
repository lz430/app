<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;

class JatoLogController extends Controller
{
    private $file;

    private $groupSort = [
        'Uncategorized Errors',
        '500 server errors from JATO',
        '400 errors looking up features',
        '400 errors looking up a version',
        '404 errors decoding a VIN',
        '403 errors decoding a VIN',
        'We could not match VIN->Version',
        'Internal errors to DMR MySQL'
    ];

    public function __construct()
    {
        $this->file = file(storage_path('logs/jato.log'));
    }
    // this file is just throwaway for debug purposes during dev.
    public function index()
    {
        $dates = collect($this->file)->filter(function ($line) {
            return substr($line, 0, 5) == "[2018";
        })->map(function ($line) {
            return substr($line, 1, 10);
        })->unique()->each(function ($date) {
            echo '<a href="/jato-logs/' . $date . '">' . $date . '</a><br>';
        });
    }

    public function showDay($date)
    {
        // Entries are multiple lines of a log file separated by lines with datetime stamps
        $groupSort = $this->groupSort;
        $entries = [];
        $currentEntry = [];

        foreach ($this->file as $f) {
            // Find start of an entry
            if (substr($f, 0, 5) == "[2018") {
                // Take old entry; add it to the list
                $entries[] = array_filter($currentEntry);
                // Start new entry
                $currentEntry = [$f];
            } elseif (trim($f) != '') {
                // Just add this line to our current entry
                $currentEntry[] = $f;
            }
        }

        echo '<style>.hide{display:none;}.show{display:block;}</style><script>function expand(target) { document.getElementById("expand-" + target).className = "show"; document.getElementById("expand-button-" + target).className = "hide"; }</script>';

        collect($entries)->filter(function ($entry) use ($date) {
            // Only get the right date
            return substr(reset($entry), 0, 11) == "[{$date}";
        })->reject(function ($entry) {
            // Drop debug lines
            return str_contains(reset($entry), 'DEBUG: ');
        })->mapToGroups(function ($entry) {
            // Remove specific strings from log lines
            $filteredEntry = collect($entry)->map(function ($line) {
                if (str_contains($line, "ERROR: ")) {
                    $line = strstr($line, 'ERROR: ');
                }
                return str_replace(['ERROR: ', 'Importer error: ', 'Server error: ', 'Client error: '], ['', '', '', ''], $line);
            })->toArray();
            return [$this->getGroupName($entry) => $filteredEntry];
        })->sortBy(function ($group, $groupName) use ($groupSort) {
            return array_search($groupName, $groupSort);
        })->each(function ($group, $groupName) {
            // Only show unique lines in these 400 errors
            if ($groupName == '400 errors looking up a version' ||
                $groupName == '400 errors looking up features') {
                $group = $group->map(function ($item) {
                    return [reset($item)];
                })->unique()->sort();
            }

            // Render each group
            echo "<h2>$groupName</h2>";
            collect($group)->each(function ($entry, $i) use ($groupName) {
                $this->renderEntry($entry, md5($groupName) . '-' . $i);
            });
        });
    }

    private function renderEntry($entry, $i)
    {
        $firstLine = array_shift($entry);
        echo '<pre>' . htmlentities($firstLine) . '</pre>';

        if (count($entry) > 0) {
            echo '<a id="expand-button-' . $i . '" href="#" onClick="expand(\'' . $i . '\'); return false;">[expand]</a>';
            echo '<pre id="expand-' . $i . '" class="hide">';
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
