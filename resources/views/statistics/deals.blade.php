@extends('layouts.app')

@section('content')
<style>
th, td {
    border-bottom: 1px solid #ddd;
}
</style>
    <div class="content">
        <div style="max-width: 996px; margin: 0 auto">
            <h2>VAuto</h2>
            <table>
                <tr>
                    <th style="text-align: left">Number of vehicles for each dealer<br>({{ count($vauto_dealers) }} dealers total, {{ count($dealers) }} dealers in our system)<br>(bold if this dealer is in our system)</th>
                    <td>
                        <table>
                            <tr>
                                <th>Dealer</th>
                                <th># of new vehicles in the CSV</th>
                                <th># of used vehicles in the CSV</th>
                            </tr>

                            @foreach ($vauto_dealers as $dealer)
                                <tr>
                                    <td style="{{ in_array($dealer['id'], $dealer_ids) ? 'font-weight: bold;' : '' }}">{{ $dealer['name'] }}</td>
                                    <td>{{ $dealer['count_new'] }}</td>
                                    <td>{{ $dealer['count_old'] }}</td>
                                </tr>
                            @endforeach
                        </table>
                    </td>
                </tr>
                <tr>
                    <th style="text-align: left">Total number of vehicles in the CSV</th>
                    <td>{{ $vauto_lines }}</td>
                </tr>
                <tr>
                    <th style="text-align: left">Total number of new vehicles in the CSV</th>
                    <td>{{ $new_vehicle_count }}</td>
                </tr>
            </table><br><br>

            <h2>JATO</h2>
            <table>
                <tr>
                    <th style="text-align: left">Number of vehicles (versions) processed</th>
                    <td>{{ $jato_versions }} (note: more than one deal could associate with the same version)</td>
                </tr>
                <tr>
                    <th style="text-align: left">Number of deals failed to match in JATO</th>
                    <td>{{ $new_vehicle_count - $deals_count }} ({{ $new_vehicle_count }} new vehicles - {{ $deals_count }} successful deals imported)</td>
                </tr>
                <tr>
                    <th style="text-align: left">Failed vehicles</th>
                    <td>(See <a href="/jato-logs">logs</a> for specific failures)</td>
                </tr>
            </table><br><br>

            <h2>DMR DB</h2>
            <table>
                <tr>
                    <th style="text-align: left">Number of vehicles total</th>
                    <td>{{ $deals_count }}</td>
                </tr>
                <tr>
                    <th style="text-align: left">Number of vehicles by dealer</th>
                    <td>
                        @foreach ($dealers as $dealer)
                            &bull; {{ $dealer->name }}: {{ $dealer->deals_count }}<br>
                        @endforeach
                    </td>
                </tr>
            </table><br><br>
        </div>
    </div>
@endsection
