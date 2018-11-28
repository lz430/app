<?php

namespace App\Http\Requests;

use Backpack\PermissionManager\app\Http\Requests\UserUpdateCrudRequest as ParentRequest;

class UserUpdateCrudRequest extends ParentRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            'email'    => 'required',
            'first_name'     => 'required',
            'last_name'     => 'required',
            'password' => 'confirmed',
        ];
    }
}
