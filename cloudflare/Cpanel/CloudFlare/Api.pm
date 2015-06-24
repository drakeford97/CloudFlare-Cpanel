package Cpanel::CloudFlare::Api;

use Cpanel::Logger();
use Cpanel::CloudFlare::Config();
use Cpanel::CloudFlare::Helper();
use Cpanel::CloudFlare::Host();
use Cpanel::CloudFlare::User();
use Data::Dumper;

use HTTP::Request::Common;
require HTTP::Headers;
require HTTP::Request;
require LWP::UserAgent;

my $logger = Cpanel::Logger->new();

## Helper variables
my $initialized = false;
my $has_ssl;
my $json_load_function ||= Cpanel::CloudFlare::Helper::__get_json_load_function();

sub init {
    ## only initialize once
    if ( $initialized ) {
        return true;
    }

    eval { use Net::SSLeay qw(get_https post_https make_headers make_form); $has_ssl = 1 };
    if ( !$has_ssl ) {
        $logger->warn("Failed to load Net::SSLeay: $@.\nDisabling functionality until fixed.");
        return false;
    }

    return $initialized = true;
}

sub client_api_request_v1 {
    my ( $query ) = @_;

    $base = Cpanel::CloudFlare::Config::get_client_api_base();
    $base->{"query"} = $query;
    $base->{"query"}->{"tkn"} = Cpanel::CloudFlare::User::get_user_api_key();

    return cf_api_request($base);
}

sub client_api_request_v4 {
    my $method = shift;
    my $uri = shift;
    my ( $query ) = @_;

    $base = Cpanel::CloudFlare::Config::get_client_api_base_v4();
    $base->{"query"} = $query;
    $base->{"uri"} = $base->{"uri"} . $uri;

    $base->{"headers"} = {
        "X-Auth-Key" => Cpanel::CloudFlare::User::get_user_api_key(),
        "X-Auth-Email" => Cpanel::CloudFlare::User::get_user_email(),
        "Content-Type" => "application/json"
    };

    return cf_api_request($base);
}

sub railgun_api_request {
    my $uri = shift;
    my ( $query ) = @_;

    $base = Cpanel::CloudFlare::Config::get_client_api_base();
    $base->{"uri"} = $uri;
    $base->{"query"} = $query;
    $base->{"query"}->{"tkn"} = Cpanel::CloudFlare::User::get_user_api_key();

    return cf_api_request($base);
}

sub host_api_request {
    my ( $query ) = @_;

    $base = Cpanel::CloudFlare::Config::get_host_api_base();
    $base->{"query"} = $query;

    $base->{'query'}->{'host_key'} = Cpanel::CloudFlare::Host::get_host_api_key();

    return cf_api_request($base);
}

sub cf_api_request {
    my ( $args_hr ) = @_;
    $result = https_post_request($args_hr);
    return $json_load_function->($result);
}

sub https_post_request {
    my ( $args_hr ) = @_;

    ## All requests will require SSLeay, so bail if that does not exist
    if (!init()) {
        return [{"result"=>"error", "msg" => "CloudFlare is disabled until Net::SSLeay is installed on this server."}];
    }

    if ($args_hr->{'port'} ne "443") {
        ## Downgrade to http
        $logger->warn("Attempted to make call on non SSL Port");
        return [{"result"=>"error", "msg" => "Plugin attempted to call CloudFlare on incorrect port: " . $args_hr->{'port'}}];
    }

    ## initialize headers and add cPanel plugin headers
    $args_hr->{"headers"} ||= {};
    $args_hr->{"headers"}->{"CF-Integration"} = 'cpanel';
    $args_hr->{"headers"}->{"CF-Integration-Version"} = Cpanel::CloudFlare::Config::get_plugin_version();
    #my $headers = make_headers(%{$args_hr->{"headers"}});

    if (Cpanel::CloudFlare::Config::is_debug_mode()) {
        $logger->info("Headers: " . Dumper(%{$args_hr->{"headers"}}));
        $logger->info("Arguments: " . Dumper($args_hr));
    }

    $args_hr->{'method'} ||= 'POST';
    ## TODO: Clean this up so that the absolute url is passed, and we no longer use 'port'

    my $uri = 'https://' . $args_hr->{'host'} . $args_hr->{'uri'};
    my $request;
    if ($args_hr->{'method'} == 'GET') {
        ## TODO: Add query params to the URI in this case...
        $request = GET($uri, %{$args_hr->{"headers"}});
    } else {
        ## Load with the POST function of HTTP::Request::Common
        ## Then update the method to actually match what was sent
        $request = POST($uri, %{$args_hr->{"headers"}}, make_form(%{$args_hr->{'query'}}));
        $request->method($args_hr->{'method'});
    }

    if (Cpanel::CloudFlare::Config::is_debug_mode()) {
        $logger->info("Request: " . Dumper($request));
    }

    $ua = LWP::UserAgent->new;
    $response = $ua->request($request);


#    if ($args_hr->{'method'} == 'GET') {
#        my ($page, $response, %reply_headers)
#            = get_https($args_hr->{'host'}, $args_hr->{'port'}, $args_hr->{'uri'},
#                        $headers,
#                        make_form(%{$args_hr->{'query'}})
#            );
#    } else {
#        my ($page, $response, %reply_headers)
#            = post_https($args_hr->{'host'}, $args_hr->{'port'}, $args_hr->{'uri'},
#                        $headers,
#                        make_form(%{$args_hr->{'query'}})
#            );
#    }

    if (Cpanel::CloudFlare::Config::is_debug_mode()) {
        $logger->info("Response: " . Dumper($response));
    }

    if (!$response->is_success) {
        $logger->info("Error Page: " . "{\"result\":\"error\", \"msg\":\"There was an error communicating with CloudFlare. Error header received: $response\"}");
        return "{\"result\":\"error\", \"msg\":\"There was an error communicating with CloudFlare. Error header received: $response\"}";
    } else {
        if (Cpanel::CloudFlare::Config::is_debug_mode()) {
            $logger->info("Page: " . $response->decoded_content);
        }
        return $response->decoded_content;
    }
}

1;
