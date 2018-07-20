
<div>
    <h1>Application Health Checks</h1>
    @foreach($healthcheck as $title => $result)
        <p>{{$title}} - @if($result == 1) OK! @else Error @endif</p>
    @endforeach
</div>
