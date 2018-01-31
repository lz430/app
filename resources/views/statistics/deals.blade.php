@extends('layouts.app')

@section('content')
    <div class="content">
        <div style="max-width: 996px; margin: 0 auto">
            <h2>VAuto</h2>
            <table>
                <tr>
                    <th style="text-align: left">Number of Dealers transferred</th>
                    <td>to do</td>
                </tr>
                <tr>
                    <th style="text-align: left">Number of vehicles for each dealer</th>
                    <td>to do</td>
                </tr>
                <tr>
                    <th style="text-align: left">Total number of vehicles listed</th>
                    <td>{{ $vauto_lines }}</td>
                </tr>
                <tr>
                    <th style="text-align: left">Total number of new vehicles listed</th>
                    <td>to do</td>
                </tr>
                <tr>
                    <th style="text-align: left">Total number of vehicles imported</th>
                    <td>{{ $deals_count }}</td>
                </tr>
            </table><br><br>

            <h2>JATO</h2>
            <table>
                <tr>
                    <th style="text-align: left">Number of vehicles (versions) processed</th>
                    <td>{{ $jato_versions }}</td>
                </tr>
                <tr>
                    <th style="text-align: left">Number of failed vehicles</th>
                    <td>to do</td>
                </tr>
                <tr>
                    <th style="text-align: left">Failed vehicles</th>
                    <td>to do; see <a href="/jato-logs">logs</a> for more details</td>
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
                            &bull; {{ $dealer->name }}: {{ $dealer->deals()->count() }}<br>
                        @endforeach
                    </td>
                </tr>
            </table><br><br>
        </div>
    </div>
@endsection
