<!-- text input -->

<?php
// the field should work whether or not Laravel attribute casting is used
if (isset($field['value']) && (is_array($field['value']) || is_object($field['value']))) {
    $field['value'] = json_encode($field['value']);
}

/**
 * These options represent the $deal->source_price object attributes.
 */
$price_col_options = [
    'price' => 'Price',
    'msrp' => 'MSRP',
    'invoice' => "Invoice",
    'sticker' => "Sticker",
    'dealerdiscounted' => "Dealer Discounted",
    'memoline1' => "Memo Line 1",
    'memoline2' => "Memo Line 2",
    'floorplanamount' => "Floor Plan Amount",
    'salescost' => "Sales Cost",
    'invoiceamount' => "Invoice Amount",
];

$price_fields = [
    'default' => [
        'label' => "Default / DMR Pricing",
        'description' => "Pricing available to anyone"
    ],
    'supplier' => [
        'label' => "Supplier",
        'description' => "Supplier Pricing"
    ],
    'employee' => [
        'label' => "Employee",
        'description' => "Employee Pricing"
    ],
];

$default_rules = new \stdClass();
foreach ($price_fields as $key => $price_field) {
    $default_rules->{$key} = new \stdClass();
    $default_rules->{$key}->base_field = 'msrp';
    $default_rules->{$key}->rules = [];
}
$default_rules = json_encode($default_rules);

if (isset($entry)) {
    $deals = $entry->deals()->take(5)->get();
} else {
    $deals = [];
}

?>

<div class="preview col-xs-12">
    <h3>Preview</h3>
    <p>Note: Only updates on save.</p>

    <table class="table table-bordered">
        <tr>
            <th>ID</th>
            <th>Title</th>
            <th>MSRP</th>
            <th>Default Price</th>
            <th>Supplier Price</th>
            <th>Employee Price</th>
            <th>Source Pricing</th>
        </tr>
        <tbody>
        @foreach ($deals as $deal)
            <tr>
                <td>{{ $deal->id }}</td>
                <td>{{ $deal->title() }}</td>
                <td>${{ number_format($deal->prices()->msrp, 2) }}</td>
                <td>${{ number_format($deal->prices()->default, 2) }}</td>
                <td>${{ number_format($deal->prices()->supplier, 2) }}</td>
                <td>${{ number_format($deal->prices()->employee, 2) }}</td>
                <td style="font-size:80%;">
                    @foreach ($deal->source_price as $key => $value)
                        <span>{{$key}} : ${{ number_format($value, 2) }}</span> <br />
                    @endforeach
                </td>
            </tr>
        @endforeach

        </tbody>
    </table>

</div>

<div id="rules-editor" @include('crud::inc.field_wrapper_attributes') >
    <h3>Rules</h3>
    <input type="hidden"
           value="{{ old($field['name']) ? old($field['name']) : (isset($field['value']) ? $field['value'] : (isset($default_rules) ? $default_rules : '' )) }}"
           name="{{ $field['name'] }}">

    @foreach ($price_fields as $key => $field)
        <fieldset class="price-field-rules" data-field="{{$key}}">
            <legend>{{ $price_fields[$key]['label'] }}</legend>
            <p>{{ $price_fields[$key]['description'] }}</p>

            <div class="form-group base-field">
                <label for="base_field">Base Field</label>
                <select name="base_field" class="form-control">
                    @foreach ($price_col_options as $key => $value)
                        <option value="{{$key}}">{{$value}}</option>
                    @endforeach
                </select>
            </div>

            <div class="rules-editor">
                <div class="rules">

                </div>
                <div class="rules-ops">
                    <button class="op-add-rule btn btn-primary btn-sm">Add Rule</button>
                </div>
            </div>

        </fieldset>
    @endforeach
</div>

{{-- Note: you can use  to only load some CSS/JS once, even though there are multiple instances of it --}}

{{-- ########################################## --}}
{{-- Extra CSS and JS for this particular field --}}

{{-- FIELD CSS - will be loaded in the after_styles section --}}
@push('crud_fields_styles')
    <style>
        fieldset {
            margin-bottom: 30px;
        }

        .rules-editor {
            border: 1px solid #eee;
        }

        .rules-editor .rules {

        }

        .rules-editor .rules-ops {
            padding: 6px;
            background-color: #f9f9f9;
        }

        .rule {
            padding: 6px;
        }

        .rule .form-control {
            display: inline-block;
            width: auto;
            margin-right: 10px;
        }
    </style>
@endpush

{{-- FIELD JS - will be loaded in the after_scripts section --}}
@push('crud_fields_scripts')
    <script>
        jQuery(document).ready(function ($) {
            var $editor = $("#rules-editor");
            var $value = $('input[name="price_rules"]');
            var $form = $editor.parents("form");

            /**
             * returns a jquery object representing a new rule that can be inserted.
             */
            function rule_factory(modifier = 'percent', value = '100') {

                //
                // Build HTML
                var html = '';
                html += '<div class="rule">';
                html += '<select class="rule-modifier form-control">';
                html += '<option value="percent">Percent Of Value</option>';
                html += '<option value="subtract_value">Subtract</option>';
                html += '<option value="add_value">Add</option>';
                html += '</select>';
                html += '<input min="0" type="number" class="rule-value form-control" />';
                html += '<button class="remove-rule btn btn-danger btn-sm"><i class="fa fa-remove"></button>';
                html += '</div>';

                $html = $(html);

                //
                // Set Defaults
                $('.rule-modifier option[value="' + modifier + '"]', $html).attr("selected", "selected");
                $('.rule-value', $html).val(value);

                return $html;
            }

            /**
             * Add Rule
             */
            $editor.on('click', ".op-add-rule", function (e) {
                e.preventDefault();

                //
                $(".rules", $(this).parents('.rules-editor')).append(rule_factory());
            });


            /**
             * Remove Rule
             */
            $editor.on('click', ".remove-rule", function (e) {
                e.preventDefault();
                $(this).parents('.rule').remove();
            });

            /**
             * On init we just rebuild the form.
             */
            var data = JSON.parse($value.val());
            $.each(data, function (key, value) {
                var $field = $('fieldset[data-field="' + key + '"]');
                if (value['base_field']) {
                    $('select[name="base_field"] option[value="' + value['base_field'] + '"]', $field).attr("selected", "selected");
                }

                if (value['rules']) {
                    $.each(value['rules'], function (key, value) {
                        $rule = rule_factory(value['modifier'], value['value']);
                        $('.rules', $field).append($rule);
                    });
                }
            });

            /**
             * On form submit we munge the data back into a json object.
             */
            $form.submit(function () {

                //
                // Rebuild the data structure
                var price_rules = {};
                $(".price-field-rules", $editor).each(function () {
                    var price_field_data = {};

                    price_field_data['base_field'] = $('select[name="base_field"]', $(this)).val();
                    price_field_data['rules'] = [];

                    $(".rule", $(this)).each(function () {
                        var value = $(".rule-value", $(this)).val().trim();

                        var rule_data = {
                            modifier: $(".rule-modifier", $(this)).val(),
                            value: value,
                        };

                        price_field_data['rules'].push(rule_data);
                    });

                    price_rules[$(this).data('field')] = price_field_data;
                });
                $value.val(JSON.stringify(price_rules));
            });
        });
    </script>
@endpush

{{-- End of Extra CSS and JS --}}
{{-- ########################################## --}}