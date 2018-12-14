<?php

namespace DeliverMyRide\JATO\Service;

class VersionService extends BaseService
{
    /**
     * List.
     * @see https://www.jatoflex.com/docs/services/55a6878974be090c745812a3/operations/55a9646d74be090dc82f15f5?
     * @param string $name
     * @param string $style
     * @param int $year
     * @param string $cab
     * @param int $page
     * @param int $page_size
     * @param bool $current_only
     * @param string $modified_date
     * @param bool $async
     * @return mixed
     *
     * @throws \GuzzleHttp\Exception\GuzzleException
     */
    public function list(string $name,
                         string $style = '',
                         int $year = 0,
                         string $cab = '',
                         int $page = 1,
                         int $page_size = 20,
                         bool $current_only = true,
                         string $modified_date = '',
                         bool $async = false)
    {
        $name = $this->client->makeFancyNameUrlFriendly($name);

        $query = [];
        if ($style && $year && $cab) {
            $path = "models/{$name}/{$year}/{$style}/{$cab}/versions";
        } elseif ($style && $year) {
            $path = "models/{$name}/{$year}/{$style}/versions";
        } elseif ($year) {
            $path = "models/{$name}/{$year}/versions";
        } elseif ($style) {
            $path = "models/{$name}/{$style}/versions";
        } elseif ($modified_date) {
            $query = [
                'modifiedDate' => $modified_date,
                'page' => $page,
                'pageSize' => $page_size,
                'currentOnly' => ($current_only ? 1 : 0),
            ];
            $path = 'versions';
        } else {
            $query = [
                'page' => $page,
                'pageSize' => $page_size,
                'currentOnly' => ($current_only ? 1 : 0),
            ];

            $path = "models/{$name}/versions";
        }

        return $this->client->get($path, $query, $async);
    }

    /**
     * GET.
     * @see https://www.jatoflex.com/docs/services/55a6878974be090c745812a3/operations/55aff39774be0902ecb19157?
     * @param string $vehicleId
     * @return \stdClass
     *
     * @throws \GuzzleHttp\Exception\GuzzleException
     */
    public function get(string $vehicleId)
    {
        return $this->client->get("versions/{$vehicleId}");
    }
}
