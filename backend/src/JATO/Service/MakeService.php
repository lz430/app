<?php

namespace DeliverMyRide\JATO\Service;

use DeliverMyRide\JATO\JatoClient;

class MakeService
{
    /** @var \DeliverMyRide\JATO\JatoClient */
    private $client;

    /**
     * ManufacturerService constructor.
     * @param \DeliverMyRide\JATO\JatoClient $client
     */
    public function __construct(JatoClient $client)
    {
        $this->client = $client;
    }

    /**
     * LIST.
     * @see https://www.jatoflex.com/docs/services/55a6878974be090c745812a3/operations/55a9433574be090dc82f15f4?
     * @param int $page
     * @param int $page_size
     * @return mixed
     *
     * @throws \GuzzleHttp\Exception\GuzzleException
     */
    public function list(int $page = 1, int $page_size = 20)
    {
        return $this->client->get('makes', [
            'page' => $page,
            'pageSize' => $page_size,
        ]);
    }

    /**
     * List by manufacturer.
     * @see https://www.jatoflex.com/docs/services/55a6878974be090c745812a3/operations/55a9646d74be090dc82f15f5?
     * @param string $name
     * @param int $page
     * @param int $page_size
     * @return mixed
     *
     * @throws \GuzzleHttp\Exception\GuzzleException
     */
    public function listByManufacturer(string $name, int $page = 1, int $page_size = 20)
    {
        return $this->client->get("manufacturers/{$name}/makes", [
            'page' => $page,
            'pageSize' => $page_size,
        ]);
    }

    /**
     * GET.
     * @see https://www.jatoflex.com/docs/services/55a6878974be090c745812a3/operations/55a96b4374be090dc82f15f6?
     * @param string $name
     * @return \stdClass
     *
     * @throws \GuzzleHttp\Exception\GuzzleException
     */
    public function get(string $name)
    {
        $name = $this->client->makeFancyNameUrlFriendly($name);

        return $this->client->get("makes/{$name}");
    }
}
