<?php

namespace DeliverMyRide\RIS\Service;


/**
 * This service assists in obtaining various hashcodes across the entire
 * cox system.
 */
class HashcodeService extends BaseService {

    /**
     * Get the master hashcode
     * @see https://incentives.homenetiol.com/v2.4/json/metadata?op=GetMasterHashcode
     * @return mixed
     * @throws \GuzzleHttp\Exception\GuzzleException
     */
    public function master() {
        return $this->client->get("getmasterhashcode");
    }

    /**
     * Get the master hashcode
     * @see https://incentives.homenetiol.com/v2.4/json/metadata?op=GetHashcodeTree
     * @return mixed
     * @throws \GuzzleHttp\Exception\GuzzleException
     *
     * TODO: It looks like this is missing the actual tree data.
     */
    public function tree() {
        return $this->client->get("gethashcodetree");
    }

    /**
     * makes (include hashcodes)
     * @see https://incentives.homenetiol.com/v2.4/json/metadata?op=GetMakes
     * @return mixed
     * @throws \GuzzleHttp\Exception\GuzzleException
     */
    public function makes() {
        return $this->client->get("getmakes");
    }

    /**
     * @see https://incentives.homenetiol.com/v2.4/json/metadata?op=GetPostalcodesHashcode
     * @return mixed
     * @throws \GuzzleHttp\Exception\GuzzleException
     */
    public function postalcode() {
        return $this->client->get("getpostalcodeshashcode");
    }

}
