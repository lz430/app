<!-- This file is used to store sidebar items, starting with Backpack\Base 0.9.0 -->
<li>
    <a href="{{ backpack_url('dashboard') }}"><i class="fa fa-dashboard"></i>
        <span>{{ trans('backpack::base.dashboard') }}</span>
    </a>
</li>

<li class="treeview">
    <a href="#">
        <i class="fa fa-laptop"></i>
        <span>Debug Tools</span>
        <span class="pull-right-container">
              <i class="fa fa-angle-left pull-right"></i>
            </span>
    </a>
    <ul class="treeview-menu">
        <li><a href="/admin/zip-tester/48116"><i class="fa fa-circle-o"></i> Zip Tester</a></li>
    </ul>
</li>