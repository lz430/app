<?php

namespace App\Services\Search;

use League\Fractal\Pagination\PaginatorInterface;

/**
 * Class ESPaginatorAdapter.
 */
class ESPaginatorAdapter implements PaginatorInterface
{
    public $response;
    public $page;
    public $per_page;

    public function __construct(array $response, int $page, int $per_page)
    {
        $this->response = $response;
        $this->page = $page;
        $this->per_page = $per_page;
    }

    /**
     * Get the current page.
     *
     * @return int
     */
    public function getCurrentPage()
    {
        return $this->page;
    }

    /**
     * Get the last page.
     *
     * @return int
     */
    public function getLastPage()
    {
        return ceil($this->getTotal() / $this->getPerPage());
    }

    /**
     * Get the total.
     *
     * @return int
     */
    public function getTotal()
    {
        return $this->response['hits']['total'];
    }

    /**
     * Get the count.
     *
     * @return int
     */
    public function getCount()
    {
        return count($this->response['hits']['hits']);
    }

    /**
     * Get the number per page.
     *
     * @return int
     */
    public function getPerPage()
    {
        return $this->per_page;
    }

    /**
     * Get the url for the given page.
     *
     * @param int $page
     *
     * @return string
     */
    public function getUrl($page)
    {
        return 1;
    }
}
