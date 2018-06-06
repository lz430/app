<!-- This file is used to store sidebar items, starting with Backpack\Base 0.9.0 -->
<li>
    <a href="{{ backpack_url('dashboard') }}"><i class="fa fa-dashboard"></i>
        <span>{{ trans('backpack::base.dashboard') }}</span>
    </a>
</li>

<li class="header">Data</li>
<li>
    <a href="/admin/dealer">
        <i class="fa fa-car"></i>
        <span>Dealers</span>
    </a>
</li>
<li>
    <a href="/admin/user">
        <i class="fa fa-user"></i>
        <span>Users</span>
    </a>
</li>

<li class="header">Reports</li>
<li>
    <a href="/admin/reports/versions-missing-images">
        <i class="fa fa-image"></i>
        <span>Version w/ No Photos</span>
    </a>
</li>

<li class="header">Debug Tools</li>
<li>
    <a href="/admin/zip-tester/48116">
        <i class="fa fa-circle-o"></i>
        <span>Zip Tester</span>
    </a>
</li>
