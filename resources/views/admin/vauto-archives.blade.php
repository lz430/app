@extends('backpack::layout')

@section('header')
    <section class="content-header">
        <h1>
            Archived vAuto Dumps
        </h1>
    </section>
@endsection

@section('content')
    <div class="row">
        <div class="col-md-12">
            <div class="box box-default">
                <div class="box-body  no-padding">
                    <table class="table table-bordered">
                        <tr>
                            <th>Name</th>
                        </tr>
                        <tbody>
                        @isset($dumps)
                        @foreach($dumps as $dump)
                            <tr>
                                <td>{{$dump['filename']}}</td>
                                <td><a href="/admin/archived-dumps/download/{{$dump['filename']}}" class="btn btn-xs btn-default"><i class="fa fa-download"></i> Download</a></td>
                            </tr>
                        @endforeach
                        @endisset
                        @empty($dumps)
                            <tr>
                                <td>There are currently no files.</td>
                            </tr>
                        @endempty
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
@endsection