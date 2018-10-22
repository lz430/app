<?php
if(isset($entry)) {
    $contacts = $entry->contacts()->get();
    $dealer_id = $entry->id;
}
?>

<div class="preview col-xs-12">
    @if(isset($dealer_id))
    <div class="margin-bottom">
        <a href="/admin/dealercontact/{{\Request::segment(3)}}/create" class="btn btn-primary ladda-button" data-style="zoom-in"><span class="ladda-label"><i class="fa fa-plus"></i> Add contact</span></a>
    </div>
    <div class="box box-default">
        <div class="box-body  no-padding">
            @if(isset($contacts))
            <table class="table table-bordered">
                <tr>
                    <th>Name</th>
                    <th>Title</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th> - </th>
                </tr>
                <tbody>
                @foreach ($contacts as $contact)
                    <tr>
                        <td>{{ $contact->name }}</td>
                        <td>{{ $contact->title }}</td>
                        <td>{{ $contact->email }}</td>
                        <td>{{ $contact->phone }}</td>
                        <td><a href="/admin/dealercontact/{{$contact->id}}/edit"><i class="fa fa-pencil"></i> Edit</a></td>
                    </tr>
                @endforeach
                </tbody>
            </table>
            @else
                <p>No current contacts added to dealer.</p>
            @endif
        </div>
    </div>
    @else
        <p><b>Save dealer first before the ability to add contacts.</b></p>
    @endif
</div>