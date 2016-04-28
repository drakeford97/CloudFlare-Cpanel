<?php
namespace CF\API;

use GuzzleHttp;

class Host extends AbstractAPIClient
{

    const HOST_API_NAME = "HOST API";
    //self::ENDPOINT_BASE_URL . self::ENDPOINT_PATH isn't a thing so you have to update it twice if it changes.
    const ENDPOINT_BASE_URL = "https://api.cloudflare.com/";
    const ENDPOINT_PATH = "host-gw.html";
    const ENDPOINT = "https://api.cloudflare.com/host-gw.html";

    /**
     * @param Request $request
     * @return array|mixed
     */
    public function callAPI(Request $request)
    {
        //Host API isn't restful so path must always self::ENDPOINT_PATH
        $request->setUrl(self::ENDPOINT_PATH);
        return parent::callAPI($request);
    }


    /**
     * @param Request $request
     * @return Request
     */
    public function beforeSend(Request $request)
    {
        $headers = array(
            "CF-Integration" => $this->config->getValue("integrationName"),
            "CF-Integration-Version" => $this->config->getValue("version"),
        );
        $request->setHeaders($headers);

        $body = $request->getBody();
        $user_key_actions = array('zone_set', 'full_zone_set');
        if (in_array(strtolower($body['act']), $user_key_actions)) {
            $body["user_key"] = $this->data_store->getHostAPIUserKey();
        }
        $body['host_key'] = $this->integrationAPI->getHostAPIKey();
        $request->setBody($body);

        return $request;
    }

    /**
     * @param $host_api_response
     * @return bool
     */
    public function responseOk($host_api_response)
    {
        return ($host_api_response['result'] === 'success');
    }

    /**
     * @return string
     */
    public function getEndpoint()
    {
        return self::ENDPOINT;
    }

    /**
     * @return string
     */
    public function getAPIClientName()
    {
        return self::HOST_API_NAME;
    }

    /**
     * @param $message
     * @return array
     */
    public function createAPIError($message)
    {
        return array(
            'request' => array(
                'act' => ''
            ),
            'result' => 'error',
            'msg' => $message,
            'err_code' => ''
        );
    }
}
