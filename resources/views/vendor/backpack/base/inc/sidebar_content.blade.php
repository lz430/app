<!-- This file is used to store sidebar items, starting with Backpack\Base 0.9.0 -->
<li>
    <a href="{{ backpack_url('dashboard') }}"><i class="fa fa-dashboard"></i>
        <span>{{ trans('backpack::base.dashboard') }}</span>
    </a>
</li>

<li class="header">Data</li>
<li>
    <a href="/admin/category">
        <i class="fa fa-object-group"></i>
        <span>Categories</span>
    </a>
</li>
<li>
    <a href="/admin/dealer">
        <i class="fa fa-map"></i>
        <span>Dealers</span>
    </a>
</li>
<li>
    <a href="/admin/deal">
        <i class="fa fa-car"></i>
        <span>Deals</span>
    </a>
</li>
<li>
    <a href="/admin/feature">
        <i class="fa fa-rocket"></i>
        <span>Features</span>
    </a>
</li>
<li class="treeview">
    <a href="#"><i class="fa fa-group"></i> <span>Users, Roles, Permissions</span> <i class="fa fa-angle-left pull-right"></i></a>
    <ul class="treeview-menu">
        <li><a href="{{ backpack_url('user') }}"><i class="fa fa-user"></i> <span>Users</span></a></li>
        <li><a href="{{ backpack_url('role') }}"><i class="fa fa-group"></i> <span>Roles</span></a></li>
        <li><a href="{{ backpack_url('permission') }}"><i class="fa fa-key"></i> <span>Permissions</span></a></li>
    </ul>
</li>

<li class="header">Orders</li>
<li>
    <a href="/admin/purchase">
        <i class="fa fa-money"></i>
        <span>Orders</span>
    </a>
</li>

<li class="header">Reports</li>
<li>
    <a href="/admin/reports/deals-without-rules">
        <i class="fa fa-image"></i>
        <span>Deals Missing Source Price</span>
    </a>
</li>
<li>
    <a href="/admin/archived-dumps">
        <i class="fa fa-file"></i>
        <span>Archived Dumps</span>
    </a>
</li>
<li>
    <a href="/admin/reports/dealer-price-rules">
        <i class="fa fa-file-text"></i>
        <span>Dealer Price Rules</span>
    </a>
</li>
<li>
    <a href="/admin/reports/versions-missing-images">
        <i class="fa fa-image"></i>
        <span>Version w/ No Photos</span>
    </a>
</li>