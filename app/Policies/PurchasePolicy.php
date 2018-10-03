<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Order\Purchase;
use Illuminate\Auth\Access\HandlesAuthorization;

class PurchasePolicy
{
    use HandlesAuthorization;

    /**
     * Determine whether the user can view the purchase.
     *
     * @param  \App\Models\User  $user
     * @param  \App\Models\Order\Purchase  $purchase
     * @return mixed
     */
    public function view(User $user, Purchase $purchase)
    {
        return $purchase->buyer->id === $user->id;
    }

    /**
     * Determine whether the user can create purchases.
     *
     * @param  \App\Models\User  $user
     * @return mixed
     */
    public function create(User $user)
    {
        return true;
    }

    /**
     * Determine whether the user can update the purchase.
     *
     * @param  \App\Models\User  $user
     * @param  \App\Models\Order\Purchase  $purchase
     * @param  string $token
     * @return mixed
     */
    public function update(?User $user, Purchase $purchase, string $token = "")
    {
        if ($user) {
            return $purchase->buyer && $purchase->buyer->id === $user->id;
        }

        if ($token) {
            return true;
        }

        return false;
    }

    /**
     * Determine whether the user can delete the purchase.
     *
     * @param  \App\Models\User  $user
     * @param  \App\Models\Order\Purchase  $purchase
     * @return mixed
     */
    public function delete(User $user, Purchase $purchase)
    {
        return false;
    }
}
