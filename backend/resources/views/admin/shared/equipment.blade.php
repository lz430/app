<a role="button" data-toggle="collapse" href="#{{$prefix . $equipment->schema_id}}">
    Extra Data
</a>
<div class="collapse" id="{{$prefix . $equipment->schema_id}}">
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
</div>