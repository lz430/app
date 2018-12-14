<?php

namespace App\Http\Requests;

use Backpack\PermissionManager\app\Http\Requests\UserStoreCrudRequest as ParentRequest;

class UserStoreCrudRequest extends ParentRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            'email'    => 'required|unique:'.config('permission.table_names.users', 'users').',email',
            'first_name'     => 'required',
            'last_name'     => 'required',
            'password' => 'required|confirmed',
        ];
    }
}
