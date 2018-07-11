<?php
if (!isset($collapsible)) {
    $collapsible = false;
}

if (!isset($bodyclasses)) {
    $bodyclasses = '';
}
?>

<div class="{{$collapsible ? 'panel box box-default' : 'box box-default'}} ">
    @if (isset($title))
        <div class="box-header with-border">
            <h4 class="box-title">
                @if ($collapsible)

                    <a data-toggle="collapse" data-parent="#accordion" href="#{{$key}}"
                       aria-expanded="false" class="collapsed">
                        {{$title}}
                    </a>
                @else
                    {{$title}}
                @endif
            </h4>
        </div>
    @endif
    @if ($collapsible)
        <div id="{{$key}}" class="panel-collapse collapse" aria-expanded="false"
             style="height: 0px;">
            <div class="box-body {{$bodyclasses}}">
                {{$slot}}
            </div>
        </div>
    @else
        <div class="box-body {{$bodyclasses}}">
            {{$slot}}
        </div>
    @endif

    @if (isset($footer))
        <div class="box-footer">
            {{$footer}}
        </div>
    @endif
</div>