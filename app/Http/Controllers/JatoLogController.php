<?php

namespace App\Http\Controllers;

class JatoLogController extends Controller
{
    private $file;

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

        collect($entries)->filter(function ($entry) use ($date) {
            $firstLine = reset($entry);
            // Double check that the date of the entry is the one we want to use
            // Filter out lines with "DEBUG:" in them
            return substr($firstLine, 0, 11) == "[{$date}" || ! str_contains($firstLine, '] DEBUG:');
        })->mapToGroups(function ($entry) {
            // Remove specific strings from log lines
            $filteredEntry = collect($entry)->map(function ($line) {
                if (str_contains($line, "ERROR: ")) {
                    $line = strstr($line, 'ERROR: ');
                }
                return str_replace(['ERROR: ', 'Importer error: ', 'Server error: ', 'Client error: '], ['', '', '', ''], $line);
            })->toArray();
            return [$this->getGroupName($entry) => $filteredEntry];
        })->each(function ($group, $groupName) {
            // Only show unique lines in these 400 errors
            if ($groupName == '400 errors looking up a version' ||
                $groupName == '400 errors looking up features') {
                $group = $group->map(function ($item) {
                    return [reset($item)];
                })->unique();
            }

            // Render each group
            echo "<h2>$groupName</h2>";
            echo '<pre>';
            collect($group)->each(function ($entry) {
                // Render each line of the group
                echo htmlentities(implode("\n", $entry)) . "\n";
            });
            echo '</pre>';
        });
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
