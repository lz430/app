<?php

namespace DeliverMyRide\Cox\Service;


class ProgramService extends BaseService {

    /**
     * @see https://incentives.homenetiol.com/v2.4/json/metadata?op=GetPrograms
     * @return mixed
     * @throws \GuzzleHttp\Exception\GuzzleException
     */
    public function list() {
        return $this->client->get("getprograms");
    }

    /**
     * @see https://incentives.homenetiol.com/v2.4/json/metadata?op=GetProgramByID
     * @param  string $programId
     * @return mixed
     * @throws \GuzzleHttp\Exception\GuzzleException
     */
    public function get(string $programId) {
        return $this->client->get("getprogrambyid/{$programId}");
    }

    /**
     * @see https://incentives.homenetiol.com/v2.4/json/metadata?op=GetProgramGroups
     * @return mixed
     * @throws \GuzzleHttp\Exception\GuzzleException
     */
    public function groupList() {
        return $this->client->get("getprogramgroups");
    }

    /**
     * @see https://incentives.homenetiol.com/v2.4/json/metadata?op=GetProgramGroupByID
     * @param string $groupId
     * @return mixed
     * @throws \GuzzleHttp\Exception\GuzzleException
     */
    public function groupGet(string $groupId) {
        return $this->client->get("getprogramgroupbyid/{$groupId}");
    }

    /**
     * @see https://incentives.homenetiol.com/v2.4/json/metadata?op=GetProgramHashcodes
     * @return mixed
     * @throws \GuzzleHttp\Exception\GuzzleException
     */
    public function hashcodes() {
        return $this->client->get("getprogramhashcodes");
    }

}
