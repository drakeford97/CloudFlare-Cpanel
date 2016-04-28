<?php

namespace CF\Cpanel;

use \CF\API\APIInterface;
use CF\API\Request;
use \CF\Cpanel\Zone\Partial;
use \CF\SecurityUtil;

class HostActions
{
    private $api;
    private $config;
    private $cpanelAPI;
    private $dataStore;
    private $logger;
    private $partialZoneSet;
    private $request;

    /**
     * @param CpanelIntegration $cpanelIntegration
     * @param APIInterface $api
     * @param Request $request
     */
    public function __construct(CpanelIntegration $cpanelIntegration, APIInterface $api, Request $request)
    {
        $this->api = $api;
        $this->config = $cpanelIntegration->getConfig();
        $this->cpanelAPI = $cpanelIntegration->getIntegrationAPI();
        $this->dataStore = $cpanelIntegration->getDataStore();
        $this->logger = $cpanelIntegration->getLogger();
        $this->partialZoneSet = new Partial($this->cpanelAPI, $this->dataStore, $this->logger);
        $this->request = $request;
    }

    /**
     * ?act=zone_set
     * @return string
     */
    public function partialZoneSet()
    {
        $bodyParameters = $this->request->getBody();
        if (isset($bodyParameters["zone_name"])) {
            if ($this->partialZoneSet->partialZoneSet("www." . $bodyParameters["zone_name"] . ".", $bodyParameters["zone_name"])) {
                $bodyParameters["subdomains"] = "www";
                //remove trailing . get_resolve_to_value() adds to the end cause Host API doesn't want it.
                $bodyParameters["resolve_to"] = rtrim($this->partialZoneSet->getResolveToValue($bodyParameters["zone_name"]), ".");
                $this->request->setBody($bodyParameters);
                return $this->api->callAPI($this->request);
            } else {
                return $this->api->createAPIError("Cpanel was unable to provision '" . $bodyParameters["zone_name"] . "' please contact your hosting provider.");
            }
        } else {
            return $this->api->createAPIError("Missing parameter 'zone_name'.");
        }
    }

    /**
     * ?act=user_create
     * @return string
     */
    public function userCreate()
    {
        $unique_id = SecurityUtil::generate16bytesOfSecureRandomData();
        //if generate16BytesOfSecureRandomData fails fall back to md5
        if ($unique_id === false) {
            $this->logger->warn("SecurityUtil::generate16bytesOfSecureRandomData failed.");
            $unique_id = md5($this->request->getBody()["cloudflare_email"] . time() . $this->cpanelAPI->getUserId() . $this->cpanelAPI->get_home_dir() . $this->cpanelAPI->getHostAPIKey());
        }
        $parameters['body']["unique_id"] = $unique_id;

        $user_create_response = $this->api->callAPI($this->request);

        if ($this->api->responseOk($user_create_response)) {
            $user_api_key = $user_create_response["response"]["user_api_key"];
            $cloudflare_email = $user_create_response["response"]["cloudflare_email"];
            $unique_id = $user_create_response["response"]["unique_id"];
            $user_key = $user_create_response["response"]["user_key"];

            $this->dataStore->createUserDataStore($user_api_key, $cloudflare_email, $unique_id, $user_key);
        }

        return $user_create_response;
    }

    /**
     * ?act=user_auth
     * @return string
     */
    public function userAuth()
    {
        $user_auth_response = $this->api->callAPI($this->request);

        if ($this->api->responseOk($user_auth_response)) {
            $user_api_key = $user_auth_response["response"]["user_api_key"];
            $cloudflare_email = $user_auth_response["response"]["cloudflare_email"];
            $unique_id = $user_auth_response["response"]["unique_id"];
            $user_key = $user_auth_response["response"]["user_key"];

            $this->dataStore->createUserDataStore($user_api_key, $cloudflare_email, $unique_id, $user_key);
        }

        return $user_auth_response;
    }
}
