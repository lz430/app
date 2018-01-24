<?php

namespace App\Http\Controllers;

class JatoLogController extends Controller
{
    // this file is just throwaway for debug purposes during dev.
    public function index()
    {
        $dates = [];

        $file = file(storage_path('logs/jato.log'));

        foreach ($file as $f) {
            if (substr($f, 0, 5) == "[2018") {
                $date = substr($f, 1, 10);
                $dates[$date] = true;
            }
        }

        foreach ($dates as $date => $true) {
            echo '<a href="/jato-logs/' . $date . '">' . $date . '</a><br>';
        }
    }

    public function showDay($date)
    {
        $file = file(storage_path('logs/jato.log'));

        $entries = [];
        $currentEntry = [];

        foreach ($file as $f) {
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

        $fourHundredFeatures = [];
        $fourHundredVersion = [];
        $vinDecodeFourOhFour = [];
        $vinDecodeFourOhThree = [];
        $couldNotMatch = [];
        $integrityConstraint = [];
        $fiveHundreds = [];

        echo '<h2>Un-categorized errors</h2>';
        echo '<pre>';

        foreach ($entries as $entry) {
            $firstLine = reset($entry);

            if (substr($firstLine, 0, 11) != "[{$date}") {
                continue; // skip this one; wrong day
            }

            if (str_contains($firstLine, '] DEBUG:')) {
                continue; // skip debug
            }

            if (str_contains($firstLine, '/features/') &&
                str_contains($firstLine, '400 Bad Request')) {
                $fourHundredFeatures[] = $entry;
                continue;
            }

            if (str_contains($firstLine, '/vin/decode') &&
                str_contains($firstLine, '404 Not Found')) {
                $vinDecodeFourOhFour[] = $entry;
                continue;
            }

            if (str_contains($firstLine, '/vin/decode') &&
                str_contains($firstLine, '403 Forbidden')) {
                $vinDecodeFourOhThree[] = $entry;
                continue;
            }

            if (str_contains($firstLine, 'Could not find exact match for VIN')) {
                $couldNotMatch[] = $entry;
                continue;
            }

            if (str_contains($firstLine, '/versions/') &&
                str_contains($firstLine, '400 Bad Request')) {
                $fourHundredVersion[] = $entry;
                continue;
            }

            if (str_contains($firstLine, 'Integrity constraint')) {
                $integrityConstraint[] = $entry;
                continue;
            }

            if (str_contains($firstLine, '500 Internal Server Error')) {
                $fiveHundreds[] = $entry;
                continue;
            }

            echo htmlentities(implode("\n", $entry)) . "\n";
        }

        echo '</pre>';

        foreach ([
            '500 server errors from JATO' => $fiveHundreds,
            '400 errors looking up features' => $fourHundredFeatures,
            '400 errors looking up a version' => $fourHundredVersion,
            '404 errors decoding a VIN' => $vinDecodeFourOhFour,
            '403 errors decoding a VIN' => $vinDecodeFourOhThree,
            'We could not match VIN->Version' => $couldNotMatch,
            'Internal errors to DMR MySQL' => $integrityConstraint,
        ] as $name => $entries) {
            echo '<h2>' . $name . '</h2>';
            echo '<pre>';

            foreach ($entries as &$entry) {
                foreach ($entry as &$line) {
                    if (str_contains($line, "ERROR: ")) {
                        $line = strstr($line, 'ERROR: ');
                    }

                    $line = str_replace(['ERROR: ', 'Importer error: ', 'Server error: ', 'Client error: '], ['', '', '', ''], $line);
                }
            }

            // ugh i want unique flat map
            if ($name == '400 errors looking up a version' ||
                $name == '400 errors looking up features') {
                $entries = $this->uniqueEntries($entries);
            }

            foreach ($entries as $entry) {
                foreach ($entry as $line) {
                    echo htmlentities($line) . "\n";
                }
            }
            echo '</pre>';
        }
    }

    private function uniqueEntries($entries)
    {
        $lines = [];

        foreach ($entries as $entry) {
            $lines[] = reset($entry);
        }

        $lines = array_unique($lines);
        sort($lines);

        $return = [];

        foreach ($lines as $line) {
            $return[] = [$line];
        }

        return $return;
    }
}
