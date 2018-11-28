<?php

namespace DeliverMyRide\JATO\Service;

class ModelService extends BaseService
{
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
     * List by make.
     * @see https://www.jatoflex.com/docs/services/55a6878974be090c745812a3/operations/55afbc3b74be0902ecb19152?
     * @param string $name
     * @return mixed
     *
     * @throws \GuzzleHttp\Exception\GuzzleException
     */
    public function listByMake(string $name)
    {
        return $this->client->get("makes/{$name}/models");
    }

    /**
     * List by make grouped.
     * @see https://www.jatoflex.com/docs/services/55a6878974be090c745812a3/operations/565f717f74be0900d423477a?
     * @param string $name
     * @return mixed
     *
     * @throws \GuzzleHttp\Exception\GuzzleException
     */
    public function listByMakeGrouped(string $name)
    {
        return $this->client->get("makes/{$name}/modelsYearStyle");
    }

    /**
     * GET.
     * @see https://www.jatoflex.com/docs/services/55a6878974be090c745812a3/operations/55afb5ce74be0902ecb1914f?
     * @param string $name
     * @param string $style
     * @param int $year
     * @return \stdClass
     *
     * @throws \GuzzleHttp\Exception\GuzzleException
     */
    public function get(string $name, string $style = '', int $year = 0)
    {
        $name = $this->client->makeFancyNameUrlFriendly($name);

        if ($style && $year) {
            return $this->client->get("models/{$name}/{$year}/{$style}");
        } elseif ($style) {
            return $this->client->get("models/{$name}/{$style}");
        } elseif ($year) {
            return $this->client->get("models/{$name}/{$year}");
        } else {
            return $this->client->get("models/{$name}");
        }
    }
}
