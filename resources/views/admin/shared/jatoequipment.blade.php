@component('components.box', ['collapsible' => true, 'key' => $prefix . $equipment->schemaId])
    @slot('title')
        {{$equipment->name}}
    @endslot
    <table class="table table-hover">
        <tr>
            <td>name</td>
            <td>{{$equipment->name}}</td>
        </tr>
        <tr>
            <td>availability</td>
            <td>{{$equipment->availability}}</td>
        </tr>
        <tr>
            <td>location</td>
            <td>{{$equipment->location}}</td>
        </tr>

        <tr>
            <td>value</td>
            <td>{{$equipment->value}}</td>
        </tr>

        @foreach($equipment->attributes as $attribute)
            <tr>
                <td>{{$attribute->name}}</td>
                <td>{{$attribute->value}}</td>
            </tr>
        @endforeach

    </table>
    <!--<pre>{{ json_encode($equipment, JSON_PRETTY_PRINT) }}</pre> -->
@endcomponent