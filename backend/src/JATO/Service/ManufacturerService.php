<?php

namespace DeliverMyRide\JATO\Service;

class ManufacturerService extends BaseService
{
    /**
     * LIST.
     * @see https://www.jatoflex.com/docs/services/55a6878974be090c745812a3/operations/55a68b4474be090c745812a4?
     * @param int $page
     * @param int $page_size
     * @return mixed
     *
     * @throws \GuzzleHttp\Exception\GuzzleException
     */
    public function list(int $page = 1, int $page_size = 20)
    {
        return $this->client->get('manufacturers', [
            'page' => $page,
            'pageSize' => $page_size,
        ]);
    }

    /**
     * GET.
     * @see https://www.jatoflex.com/docs/services/55a6878974be090c745812a3/operations/55a6f9e674be090c745812ae?
     * @param string $name
     * @return \stdClass
     *
     * @throws \GuzzleHttp\Exception\GuzzleException
     */
    public function get(string $name)
    {
        $name = $this->client->makeFancyNameUrlFriendly($name);

        return $this->client->get("manufacturers/{$name}");
    }
}
