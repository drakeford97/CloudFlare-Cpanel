var OPEN_HELP=-1,VALID=[],CF_RECS={},NUM_RECS=0,REC_TEXT=[],WWW_DOM_INFO=[],CF_LANG={creating_account:"Creating Your CloudFlare Account. This may take several minutes.",signup_welcome:"Welcome to CloudFlare",signup_info:'Generate a CloudFlare password <a href="https://www.cloudflare.com/forgot-password.html" target="_blank">here</a>. Your CloudFlare email is curently set to {email}. Click <a href="">here</a> to continue.',tooltip_zone_cf_off:"CloudFlare is currently off. Click to enable",tooltip_zone_cf_on:"CloudFlare is currently on. Click to disable"},
get_lang_string=function(d,e){var c=CF_LANG[d];e=e||{};if(c)try{return YAHOO.lang.substitute(c,e)}catch(b){}return""},signup_to_cf=function(){var d,e,c;if(!YAHOO.util.Dom.get("USER_tos").checked)return CPANEL.widgets.status_bar("add_USER_status_bar","error",CPANEL.lang.Error,"Please agree to the Terms of Service before continuing."),!1;var b=YAHOO.util.Dom.get("USER_email").value;c={cpanel_jsonapi_version:2,cpanel_jsonapi_module:"CloudFlare",cpanel_jsonapi_func:"user_create",user:YAHOO.util.Dom.get("USER_user").value,
email:b,password:YAHOO.util.Dom.get("USER_pass").value,homedir:USER_HOME_DIR};YAHOO.util.Connect.asyncRequest("GET",CPANEL.urls.json_api(c),{success:function(c){try{var h=YAHOO.lang.JSON.parse(c.responseText);h.cpanelresult.error?(YAHOO.util.Dom.get("add_USER_record_status").innerHTML="",CPANEL.widgets.status_bar("add_USER_status_bar","error",CPANEL.lang.Error,h.cpanelresult.error)):"success"==h.cpanelresult.data[0].result?(d=get_lang_string("signup_welcome"),e=get_lang_string("signup_info",{email:b}),
YAHOO.util.Dom.get("add_USER_record_status").innerHTML="",CPANEL.widgets.status_bar("add_USER_status_bar","success",d,e),setTimeout("window.location.reload(true)",1E4)):(YAHOO.util.Dom.setStyle("add_USER_record_button","display","block"),124==h.cpanelresult.data[0].err_code?(YAHOO.util.Dom.setStyle("cf_pass_noshow","display","table-row"),YAHOO.util.Dom.get("add_USER_record_status").innerHTML="",CPANEL.widgets.status_bar("add_USER_status_bar","error",CPANEL.lang.Error,"This email is already signed up with CloudFlare. Please provide the user's CloudFlare password to continue.")):
(YAHOO.util.Dom.get("add_USER_record_status").innerHTML="",CPANEL.widgets.status_bar("add_USER_status_bar","error",CPANEL.lang.Error,h.cpanelresult.data[0].msg.replace(/\\/g,""))))}catch(f){YAHOO.util.Dom.get("add_USER_record_status").innerHTML="",CPANEL.widgets.status_bar("add_USER_status_bar","error",CPANEL.lang.json_error,CPANEL.lang.json_parse_failed)}},failure:function(b){YAHOO.util.Dom.setStyle("add_USER_record_button","display","block");YAHOO.util.Dom.get("add_USER_record_status").innerHTML=
"";CPANEL.widgets.status_bar("add_USER_status_bar","error",CPANEL.lang.ajax_error,CPANEL.lang.ajax_try_again)}},"");YAHOO.util.Dom.setStyle("add_USER_record_button","display","none");c=get_lang_string("creating_account");YAHOO.util.Dom.get("add_USER_record_status").innerHTML=CPANEL.icons.ajax+" "+c},reset_form=function(d){VALID=[];CF_RECS={};NUM_RECS=0;REC_TEXT=[];WWW_DOM_INFO=[]},add_validation=function(){},handleLearnMore=function(d){d?(YAHOO.util.Dom.setStyle("cf_def_show","display","none"),YAHOO.util.Dom.setStyle("cf_def_noshow",
"display","block")):(YAHOO.util.Dom.setStyle("cf_def_show","display","block"),YAHOO.util.Dom.setStyle("cf_def_noshow","display","none"));return!1},toggle_domain=function(){"_select_"==YAHOO.util.Dom.get("domain").value?$("#add_record_and_zone_table").slideUp(CPANEL.JQUERY_ANIMATION_SPEED):($("#add_record_and_zone_table").slideDown(CPANEL.JQUERY_ANIMATION_SPEED),update_user_records_table());reset_form("CNAME")},update_zones=function(d,e,c,b){e=[];for(key in CF_RECS)CF_RECS[key]&&e.push(key);e={cpanel_jsonapi_version:2,
cpanel_jsonapi_module:"CloudFlare",cpanel_jsonapi_func:"zone_set",zone_name:YAHOO.util.Dom.get("domain").value,user_key:USER_ID,subdomains:e.join(","),cf_recs:YAHOO.lang.JSON.stringify(CF_RECS),homedir:USER_HOME_DIR};c&&(e.old_rec=c,e.old_line=b);YAHOO.util.Connect.asyncRequest("GET",CPANEL.urls.json_api(e),{success:function(b){try{var c=YAHOO.lang.JSON.parse(b.responseText);c.cpanelresult.error?update_user_records_table(function(){CPANEL.widgets.status_bar("status_bar_"+d,"error",CPANEL.lang.json_error,
CPANEL.lang.json_parse_failed)}):"error"==c.cpanelresult.data[0].result?update_user_records_table(function(){CPANEL.widgets.status_bar("status_bar_"+d,"error",CPANEL.lang.json_error,c.cpanelresult.data[0].msg.replace(/\\/g,""))}):update_user_records_rows([d])}catch(e){update_user_records_table(function(){CPANEL.widgets.status_bar("status_bar_"+d,"error",CPANEL.lang.json_error,CPANEL.lang.json_parse_failed)})}},failure:function(b){YAHOO.util.Dom.get("status_bar_"+d).innerHTML='<div style="padding: 20px">'+
CPANEL.icons.error+" "+CPANEL.lang.ajax_error+": "+CPANEL.lang.ajax_try_again+"</div>"}},"");YAHOO.util.Dom.get("cloudflare_table_edit_"+d).innerHTML='<div style="padding: 20px">'+CPANEL.icons.ajax+" "+CPANEL.lang.ajax_loading+"</div>"},toggle_record_off=function(d,e,c){CF_RECS[e]=0;update_zones(d,"",e,c)},toggle_record_on=function(d,e,c){CF_ON_CLOUD_MESSAGE&&$.cf.notify(CF_ON_CLOUD_MESSAGE,"message",60,"cf-toggle-on");CF_RECS[e]=c;update_zones(d,"_off")},is_domain_cf_powered=function(d){for(var e=
!1,c=0,b=d.length;c<b;c++)if(d[c].type.match(/^(CNAME)$/)&&d[c].cloudflare){e=!0;break}return e},build_dnszone_cache=function(d){NUM_RECS=d.length;for(var e=get_lang_string("tooltip_zone_cf_on"),c=get_lang_string("tooltip_zone_cf_off"),b=0;b<d.length;b++)d[b].type.match(/^(CNAME)$/)&&(1==d[b].cloudflare?(CF_RECS[d[b].name]=d[b].line,REC_TEXT[b]=e):REC_TEXT[b]=c,d[b].name.match(/^(www\.)/)&&(WWW_DOM_INFO=[b,d[b].name,d[b].line]))},build_dnszone_row_markup=function(d,e,c){var b="";"CNAME"==d&&(b+='<td id="name_value_'+
e+'">'+c.type+"</td>",b+='<td id="type_value_'+e+'">'+c.name.substring(0,c.name.length-1)+"</td>","CNAME"==c.type&&(b+='<td colspan="2" id="value_value_hehe_'+e+'">points to '+c.cname+"</td>"),b+="<td>",b=1==c.cloudflare?b+('<span class="action_link" id="cloudflare_table_edit_'+e+'" onclick="toggle_record_off('+e+", '"+c.name+"', "+c.line+' )"><img src="../images/cloudflare/solo_cloud-55x25.png" class="cf_enabled" /></span>'):b+('<span class="action_link" id="cloudflare_table_edit_'+e+'" onclick="toggle_record_on('+
e+", '"+c.name+"', "+c.line+' )"><img src="../images/cloudflare/solo_cloud_off-55x25.png" class="cf_disabled'+e+'"/></span>'),b+="</td>");return b},build_dnszone_table_markup=function(d){var e="rowA",c=YAHOO.util.Dom.get("domain").value,b;b='<table id="table_dns_zone" class="dynamic_table" border="0" cellspacing="0" cellpadding="0"><tr class="dt_header_row"><th>type</th>';b+="<th>name</th>";b+='<th colspan="2">record</th>';b+="<th>CloudFlare status</th>";b+="</tr>";build_dnszone_cache(d);for(var g=
0;g<d.length;g++)d[g].type.match(/^(CNAME)$/)&&(b+='<tr id="info_row_'+g+'" class="dt_info_row '+e+'">',b+=build_dnszone_row_markup("CNAME",g,d[g]),b+="</tr>",b+='<tr id="module_row_'+g+'" class="dt_module_row '+e+'"><td colspan="7">',b+='<div id="dnszone_table_edit_div_'+g+'" class="dt_module"></div>',b+='<div id="dnszone_table_delete_div_'+g+'" class="dt_module"></div>',b+='<div id="status_bar_'+g+'" class="cjt_status_bar"></div>',b+="</td></tr>",e="rowA"==e?e="rowB":"rowA");for(g=0;g<d.length;g++)d[g].type.match(/^(A)$/)&&
(b+='<tr id="info_row_a_'+g+'" class="dt_info_row '+e+'">',b+='<td id="name_value_a_'+g+'">'+d[g].type+"</td>",b+='<td id="type_value_a_'+g+'">'+d[g].name.substring(0,d[g].name.length-1)+"</td>","A"==d[g].type&&(b+='<td colspan="2" id="value_value_hehe_a_'+g+'">'+d[g].address+"</td>"),b+="<td>",b+='<a href="javascript:void(0);" onclick="show_a_help('+g+",'"+d[g].name+"')\">Want to run on CloudFlare?</a>",b+="</td>",b+="</tr>",b+='<tr id="module_row_a_'+g+'" class="dt_module_row '+e+'"><td colspan="7">',
b+="</td></tr>",e="rowA"==e?e="rowB":"rowA");b+="</table>";0<NUM_RECS&&(is_domain_cf_powered(d)?(YAHOO.util.Dom.get("cf_powered_"+c).innerHTML="Powered by CloudFlare",YAHOO.util.Dom.get("cf_powered_stats"+c).innerHTML='<a href="javascript:void(0);" onclick="return get_stats(\''+c+"');\">Statistics and Settings</a>",YAHOO.util.Dom.get("cf_powered_check"+c).innerHTML='<img src="../images/cloudflare/solo_cloud-55x25.png" onclick="toggle_all_off(\''+c+"')\" />"):(YAHOO.util.Dom.get("cf_powered_"+c).innerHTML=
"Not Powered by CloudFlare",YAHOO.util.Dom.get("cf_powered_stats"+c).innerHTML="&nbsp;",YAHOO.util.Dom.get("cf_powered_check"+c).innerHTML='<img src="../images/cloudflare/solo_cloud_off-55x25.png" onclick="toggle_www_on(\''+c+"')\" />"));return b},update_user_records_rows=function(d,e){var c=YAHOO.util.Dom.get("domain").value,b={cpanel_jsonapi_version:2,cpanel_jsonapi_module:"CloudFlare",cpanel_jsonapi_func:"fetchzone",domain:YAHOO.util.Dom.get("domain").value,homedir:USER_HOME_DIR};YAHOO.util.Connect.asyncRequest("GET",
CPANEL.urls.json_api(b),{success:function(b){try{var g=YAHOO.lang.JSON.parse(b.responseText);if(g.cpanelresult.error)YAHOO.util.Dom.get("user_records_div").innerHTML='<div style="padding: 20px">'+CPANEL.icons.error+" "+CPANEL.lang.ajax_error+": "+CPANEL.lang.ajax_try_again+"</div>";else if(g.cpanelresult.data){build_dnszone_cache(g.cpanelresult.data);b=0;for(var l=d.length;b<l;b++){var k=d[b],a=build_dnszone_row_markup("CNAME",k,g.cpanelresult.data[k]);$("#info_row_"+k).html(a);new YAHOO.widget.Tooltip("tt_cf_enabled_"+
k,{context:"cloudflare_table_edit_"+k,text:REC_TEXT[k],showDelay:300})}0<NUM_RECS&&(is_domain_cf_powered(g.cpanelresult.data)?(YAHOO.util.Dom.get("cf_powered_"+c).innerHTML="Powered by CloudFlare",YAHOO.util.Dom.get("cf_powered_stats"+c).innerHTML='<a href="javascript:void(0);" onclick="return get_stats(\''+c+"');\">Statistics and Settings</a>",YAHOO.util.Dom.get("cf_powered_check"+c).innerHTML='<img src="../images/cloudflare/solo_cloud-55x25.png" onclick="toggle_all_off(\''+c+"')\" />"):(YAHOO.util.Dom.get("cf_powered_"+
c).innerHTML="Not Powered by CloudFlare",YAHOO.util.Dom.get("cf_powered_stats"+c).innerHTML="&nbsp;",YAHOO.util.Dom.get("cf_powered_check"+c).innerHTML='<img src="../images/cloudflare/solo_cloud_off-55x25.png" onclick="toggle_www_on(\''+c+"')\" />"));e&&e();var q=YAHOO.util.Dom.getY("user_records_div");window.scrollTo(0,q)}else YAHOO.util.Dom.get("user_records_div").innerHTML='<div style="padding: 20px">'+CPANEL.icons.error+" "+CPANEL.lang.ajax_error+": "+CPANEL.lang.ajax_try_again+"</div>"}catch(t){CPANEL.widgets.status_bar("add_CNAME_status_bar",
"error",CPANEL.lang.json_error,CPANEL.lang.json_parse_failed)}},failure:function(b){YAHOO.util.Dom.get("user_records_div").innerHTML='<div style="padding: 20px">'+CPANEL.icons.error+" "+CPANEL.lang.ajax_error+": "+CPANEL.lang.ajax_try_again+"</div>"}},"");for(var b=0,g=d.length;b<g;b++)YAHOO.util.Dom.get("cloudflare_table_edit_"+d[b]).innerHTML='<div style="padding: 20px">'+CPANEL.icons.ajax+" "+CPANEL.lang.ajax_loading+"</div>"},update_user_records_table=function(d){var e={cpanel_jsonapi_version:2,
cpanel_jsonapi_module:"CloudFlare",cpanel_jsonapi_func:"fetchzone",domain:YAHOO.util.Dom.get("domain").value,homedir:USER_HOME_DIR};YAHOO.util.Connect.asyncRequest("GET",CPANEL.urls.json_api(e),{success:function(c){try{var b=YAHOO.lang.JSON.parse(c.responseText);if(b.cpanelresult.error)YAHOO.util.Dom.get("user_records_div").innerHTML='<div style="padding: 20px">'+CPANEL.icons.error+" "+CPANEL.lang.ajax_error+": "+CPANEL.lang.ajax_try_again+"</div>";else if(b.cpanelresult.data){var e=build_dnszone_table_markup(b.cpanelresult.data);
YAHOO.util.Dom.get("user_records_div").innerHTML='<a name="user_recs_'+YAHOO.util.Dom.get("domain").value+'"></a>'+e;for(c=0;c<NUM_RECS;c++)new YAHOO.widget.Tooltip("tt_cf_enabled_"+c,{context:"cloudflare_table_edit_"+c,text:REC_TEXT[c],showDelay:300});d&&d();var h=YAHOO.util.Dom.getY("user_records_div");window.scrollTo(0,h)}else YAHOO.util.Dom.get("user_records_div").innerHTML='<div style="padding: 20px">'+CPANEL.icons.error+" "+CPANEL.lang.ajax_error+": "+CPANEL.lang.ajax_try_again+"</div>"}catch(f){CPANEL.widgets.status_bar("add_CNAME_status_bar",
"error",CPANEL.lang.json_error,CPANEL.lang.json_parse_failed)}},failure:function(c){YAHOO.util.Dom.get("user_records_div").innerHTML='<div style="padding: 20px">'+CPANEL.icons.error+" "+CPANEL.lang.ajax_error+": "+CPANEL.lang.ajax_try_again+"</div>"}},"");YAHOO.util.Dom.get("user_records_div").innerHTML='<div style="padding: 20px">'+CPANEL.icons.ajax+" "+CPANEL.lang.ajax_loading+" [This may take several minutes]</div>"},refresh_records=function(d){var e={cpanel_jsonapi_version:2,cpanel_jsonapi_module:"CloudFlare",
cpanel_jsonapi_func:"fetchzone",domain:YAHOO.util.Dom.get("domain").value,homedir:USER_HOME_DIR};YAHOO.util.Connect.asyncRequest("GET",CPANEL.urls.json_api(e),{success:function(c){try{var b=YAHOO.lang.JSON.parse(c.responseText);b.cpanelresult.error?YAHOO.util.Dom.get("user_records_div").innerHTML='<div style="padding: 20px">'+CPANEL.icons.error+" "+CPANEL.lang.ajax_error+": "+CPANEL.lang.ajax_try_again+"</div>":b.cpanelresult.data?(build_dnszone_cache(b.cpanelresult.data),d&&d()):YAHOO.util.Dom.get("user_records_div").innerHTML=
'<div style="padding: 20px">'+CPANEL.icons.error+" "+CPANEL.lang.ajax_error+": "+CPANEL.lang.ajax_try_again+"</div>"}catch(e){CPANEL.widgets.status_bar("add_CNAME_status_bar","error",CPANEL.lang.json_error,CPANEL.lang.json_parse_failed)}},failure:function(c){YAHOO.util.Dom.get("user_records_div").innerHTML='<div style="padding: 20px">'+CPANEL.icons.error+" "+CPANEL.lang.ajax_error+": "+CPANEL.lang.ajax_try_again+"</div>"}},"");YAHOO.util.Dom.get("user_records_div").innerHTML='<div style="padding: 20px">'+
CPANEL.icons.ajax+" "+CPANEL.lang.ajax_loading+" [This may take several minutes]</div>"},push_all_off=function(){var d=[];for(key in CF_RECS)CF_RECS[key]&&d.push(key+":"+CF_RECS[key]);d={cpanel_jsonapi_version:2,cpanel_jsonapi_module:"CloudFlare",cpanel_jsonapi_func:"zone_delete",zone_name:YAHOO.util.Dom.get("domain").value,user_key:USER_ID,subdomains:d.join(","),homedir:USER_HOME_DIR};YAHOO.util.Connect.asyncRequest("GET",CPANEL.urls.json_api(d),{success:function(d){try{var c=YAHOO.lang.JSON.parse(d.responseText);
c.cpanelresult.error?update_user_records_table(function(){CPANEL.widgets.status_bar("status_bar_0","error",CPANEL.lang.json_error,CPANEL.lang.json_parse_failed)}):"error"==c.cpanelresult.data[0].result?update_user_records_table(function(){CPANEL.widgets.status_bar("status_bar_0","error",CPANEL.lang.json_error,c.cpanelresult.data[0].msg.replace(/\\/g,""))}):update_user_records_table()}catch(b){update_user_records_table(function(){CPANEL.widgets.status_bar("status_bar_0","error",CPANEL.lang.json_error,
CPANEL.lang.json_parse_failed)})}},failure:function(d){YAHOO.util.Dom.get("status_bar_0").innerHTML='<div style="padding: 20px">'+CPANEL.icons.error+" "+CPANEL.lang.ajax_error+": "+CPANEL.lang.ajax_try_again+"</div>"}},"")},toggle_www_on=function(d){reset_form();YAHOO.util.Dom.get("domain").value=d;update_user_records_table(function(){WWW_DOM_INFO[2]&&toggle_record_on(WWW_DOM_INFO[0],WWW_DOM_INFO[1],WWW_DOM_INFO[2])});return!1},toggle_all_off=function(d){reset_form();YAHOO.util.Dom.get("domain").value=
d;refresh_records(push_all_off);return!1},enable_domain=function(d){reset_form();YAHOO.util.Dom.get("domain").value=d;toggle_domain();return!1},change_cf_accnt=function(){window.open("https://www.cloudflare.com/cloudflare-settings.html?z="+YAHOO.util.Dom.get("domain").value,"_blank")},change_cf_setting=function(d,e,c){YAHOO.util.Dom.get("domain").value=d;"SecurityLevelSetting"==c?c=YAHOO.util.Dom.get(c).value:"AlwaysOnline"==c?c=YAHOO.util.Dom.get(c).value:"AutomaticIPv6"==c?c=YAHOO.util.Dom.get(c).value:
"CachingLevel"==c&&(c=YAHOO.util.Dom.get(c).value);e={cpanel_jsonapi_version:2,cpanel_jsonapi_module:"CloudFlare",cpanel_jsonapi_func:"zone_edit_cf_setting",zone_name:YAHOO.util.Dom.get("domain").value,user_email:USER_EMAIL,user_api_key:USER_API_KEY,v:c,a:e,homedir:USER_HOME_DIR};YAHOO.util.Connect.asyncRequest("GET",CPANEL.urls.json_api(e),{success:function(b){try{var c=YAHOO.lang.JSON.parse(b.responseText);if(c.cpanelresult.error)YAHOO.util.Dom.get("user_records_div").innerHTML='<div style="padding: 20px">'+
CPANEL.icons.error+" "+CPANEL.lang.ajax_error+": "+CPANEL.lang.ajax_try_again+"</div>";else if("error"==c.cpanelresult.data[0].result)YAHOO.util.Dom.get("user_records_div").innerHTML='<div style="padding: 20px">'+CPANEL.icons.error+" "+c.cpanelresult.data[0].msg+"</div>";else return get_stats(d),!1}catch(e){YAHOO.util.Dom.get("user_records_div").innerHTML='<div style="padding: 20px">'+CPANEL.icons.error+" "+e+"</div>"}},failure:function(b){YAHOO.util.Dom.get("user_records_div").innerHTML='<div style="padding: 20px">'+
CPANEL.icons.error+" "+CPANEL.lang.ajax_error+": "+CPANEL.lang.ajax_try_again+"</div>"}},"");return!1},hide_a_help=function(d){YAHOO.util.Dom.get("module_row_a_"+d).innerHTML='<td colspan="7"></td>';OPEN_HELP=-1},show_a_help=function(d,e){0<=OPEN_HELP&&(YAHOO.util.Dom.get("module_row_a_"+OPEN_HELP).innerHTML='<td colspan="7"></td>');YAHOO.util.Dom.get("module_row_a_"+d).innerHTML='<td colspan="7"><div style="padding: 20px">A type records cannot be directly routed though the CloudFlare network. Instead, click <a href="../zoneedit/advanced.html">here</a> and either switch the type of '+
e+" to CNAME, or else make a new CNAME record pointing to "+e+"</div></td>";OPEN_HELP=d;return!1},showHelp=function(d){var e={devmode:"CloudFlare makes your website load faster by caching static resources like images, CSS and Javascript. If you are editing cachable content (like images, CSS, or JS) and want to see the changes right away, you should enter <b>Development mode</b>. This will bypass CloudFlare's cache. Development mode will automatically toggle off after <b>3 hours</b>. Hint: Press shift-reload if you do not see your changes immediate. If you forget to enter Development mode, you should log in to your CloudFlare.com account and use Cache Purge.",
seclvl:" CloudFlare provides security for your website and you can adjust your security setting for each website. A <b>low</b> security setting will challenge only the most threatening visitors. A <b>high</b> security setting will challenge all visitors that have exhibited threatening behavior within the last 14 days. We recommend starting with a high or medium setting.",uniques:"Visitors are classified by regular traffic, search engine crawlers and threats. Unique visitors is defined by unique IP addresses.",
visits:"Traffic is classified by regular, search engine crawlers and threats. Page Views is defined by the number of requests to your site which return HTML.",pageload:"CloudFlare visits the home page of your website from several locations around the world from shared hosting. We do the same request twice: once through the CloudFlare system, and once directly to your site, so bypassing the CloudFlare system. We report both page load times here. CloudFlare improves the performance of your website by caching static resources like images, CSS and Javascript closer to your visitors and by compressing your requests so they are delivered quickly.",
hits:"CloudFlare sits in front of your server and acts as a proxy, which means your traffic passes through our network. Our network nodes are distributed all over the world. We cache your static resources like images, CSS and Javascript at these nodes and deliver them to your visitors in those regions. By serving certain resources from these nodes, not only do we make your website load faster for your visitors, but we save you requests from your origin server. This means that CloudFlare offsets load so your server can perform optimally. CloudFlare does not cache html.",
bandwidth:"Just like CloudFlare saves you requests to your origin server, CloudFlare also saves you bandwidth. By serving cached content from CloudFlare's nodes and by stopping threats before they reach your server, you will see less bandwidth usage from your origin server.",fpurge_ts:"Immediately purge all cached resources for your website. This will force CloudFlare to expire all static resources cached prior to the button click and fetch a new version.",ipv46:"Automatically enable IPv6 networking for all your orange-clouded websites. CloudFlare will listen to <a href='http://en.wikipedia.org/wiki/IPv6'>IPv6</a> even if your host or server only supports IPv4.",
ob:"Automatically enable always online for web pages that lose connectivity or time out. Seamlessly bumps your visitors back to normal browsing when your site comes back online.",cache_lvl:"Adjust your caching level to modify CloudFlare's caching behavior. The <b>basic</b> setting will cache most static resources (i.e., css, images, and JavaScript). The <b>aggressive</b> setting will cache all static resources, including ones with a query string.<br /><br />Basic: http://example.com/pic.jpg<br />Aggressive: http://example.com/pic.jpg?with=query",
pro:"Choose your CloudFlare plan. Upgrading will make your website even faster, even safer and even smarter. <b>SSL support</b> is included in every plan and will be <b>automatically</b> provisioned. All plans are month to month: no long-term contracts! ",railgun:"Railgun is a WAN optimization technology that caches dynamic content. It speeds up the delivery of previously non-cached pages, making your site even faster."};if("DN"in window){var c;"CF"in window&&"lightbox"in window.CF?(c=window.CF.lightbox,
c.cfg.contentString=e[d]):(window.CF=window.CF||{},window.CF.lightbox=c=new DN.Lightbox({contentString:e[d],animate:!1,maxWidth:500}));c.show.call(c,this)}return!1},set_railgun=function(d,e){YAHOO.util.Dom.get("domain").value=d;tag=YAHOO.util.Dom.get(e).value;var c="set_railgun";"remove"==tag&&(c="remove_railgun");c={cpanel_jsonapi_version:2,cpanel_jsonapi_module:"CloudFlare",cpanel_jsonapi_func:c,zone_name:YAHOO.util.Dom.get("domain").value,user_email:USER_EMAIL,user_api_key:USER_API_KEY,tag:tag,
homedir:USER_HOME_DIR};YAHOO.util.Connect.asyncRequest("GET",CPANEL.urls.json_api(c),{success:function(b){try{var c=YAHOO.lang.JSON.parse(b.responseText);if(c.cpanelresult.error)YAHOO.util.Dom.get("user_records_div").innerHTML='<div style="padding: 20px">'+CPANEL.icons.error+" "+CPANEL.lang.ajax_error+": "+CPANEL.lang.ajax_try_again+"</div>";else if("error"==c.cpanelresult.data[0].result)YAHOO.util.Dom.get("user_records_div").innerHTML='<div style="padding: 20px">'+CPANEL.icons.error+" "+c.cpanelresult.data[0].msg+
"</div>";else return get_stats(d),!1}catch(e){YAHOO.util.Dom.get("user_records_div").innerHTML='<div style="padding: 20px">'+CPANEL.icons.error+" "+e+"</div>"}},failure:function(b){YAHOO.util.Dom.get("user_records_div").innerHTML='<div style="padding: 20px">'+CPANEL.icons.error+" "+CPANEL.lang.ajax_error+": "+CPANEL.lang.ajax_try_again+"</div>"}},"");return!1},set_railgun_mode=function(d,e,c){YAHOO.util.Dom.get("domain").value=d;tag=YAHOO.util.Dom.get(e).value;e="enabled";"0"==YAHOO.util.Dom.get(c).value&&
(e="disabled");c={cpanel_jsonapi_version:2,cpanel_jsonapi_module:"CloudFlare",cpanel_jsonapi_func:"set_railgun_mode",zone_name:YAHOO.util.Dom.get("domain").value,user_email:USER_EMAIL,user_api_key:USER_API_KEY,tag:tag,mode:e,homedir:USER_HOME_DIR};YAHOO.util.Connect.asyncRequest("GET",CPANEL.urls.json_api(c),{success:function(b){try{var c=YAHOO.lang.JSON.parse(b.responseText);if(c.cpanelresult.error)YAHOO.util.Dom.get("user_records_div").innerHTML='<div style="padding: 20px">'+CPANEL.icons.error+
" "+CPANEL.lang.ajax_error+": "+CPANEL.lang.ajax_try_again+"</div>";else if("error"==c.cpanelresult.data[0].result)YAHOO.util.Dom.get("user_records_div").innerHTML='<div style="padding: 20px">'+CPANEL.icons.error+" "+c.cpanelresult.data[0].msg+"</div>";else return get_stats(d),!1}catch(e){YAHOO.util.Dom.get("user_records_div").innerHTML='<div style="padding: 20px">'+CPANEL.icons.error+" "+e+"</div>"}},failure:function(b){YAHOO.util.Dom.get("user_records_div").innerHTML='<div style="padding: 20px">'+
CPANEL.icons.error+" "+CPANEL.lang.ajax_error+": "+CPANEL.lang.ajax_try_again+"</div>"}},"");return!1},get_stats=function(d){reset_form();YAHOO.util.Dom.get("domain").value=d;var e=[];for(key in CF_RECS)CF_RECS[key]&&e.push(key);e={cpanel_jsonapi_version:2,cpanel_jsonapi_module:"CloudFlare",cpanel_jsonapi_func:"zone_get_stats",zone_name:YAHOO.util.Dom.get("domain").value,user_email:USER_EMAIL,user_api_key:USER_API_KEY,homedir:USER_HOME_DIR};YAHOO.util.Connect.asyncRequest("GET",CPANEL.urls.json_api(e),
{success:function(c){try{var b=YAHOO.lang.JSON.parse(c.responseText);if(b.cpanelresult.error)YAHOO.util.Dom.get("user_records_div").innerHTML='<div style="padding: 20px">'+CPANEL.icons.error+" "+CPANEL.lang.ajax_error+": "+CPANEL.lang.ajax_try_again+"</div>";else if("error"==b.cpanelresult.data[0].result)YAHOO.util.Dom.get("user_records_div").innerHTML='<div style="padding: 20px">'+CPANEL.icons.error+" "+b.cpanelresult.data[0].msg+"</div>";else{var e;(function(a){a={cpanel_jsonapi_version:2,cpanel_jsonapi_module:"CloudFlare",
cpanel_jsonapi_func:"get_active_railguns",zone_name:YAHOO.util.Dom.get("domain").value,user_email:USER_EMAIL,user_api_key:USER_API_KEY,homedir:USER_HOME_DIR};connection=YAHOO.util.Connect.asyncRequest("GET",CPANEL.urls.json_api(a),{success:function(a){try{var b=YAHOO.lang.JSON.parse(a.responseText);b.cpanelresult.error?console.log("Hey, it didn't work."):"error"==b.cpanelresult.data[0].result?console.log("Seriously, it didn't work."):e=null==b.cpanelresult.data[0].response.railgun_conn.obj?null:b.cpanelresult.data[0].response.railgun_conn.obj}catch(c){console.log("It was an exception. Happy?")}},
failure:function(a){console.log("It failed.")}},"")})(d);var h=b.cpanelresult.data[0].response.result,f=h.objs[0],b={decimalPlaces:0,decimalSeparator:".",thousandsSeparator:","};c={decimalPlaces:2,decimalSeparator:".",thousandsSeparator:","};var l=new Date(parseInt(h.timeZero)),k=new Date(parseInt(h.timeEnd)),a;if(l>k)a="<p><b>Basic Statistics for "+YAHOO.util.Dom.get("domain").value+"</b></p>",a+='<p>Basic statistics update every 24 hours for the free service. For 15 minute statistics updates, advanced security and faster performance, upgrade to the <a href="https://www.cloudflare.com/plans" target="_blank">Pro service</a>.</p>';
else{var q=YAHOO.util.Date.format(l,{format:"%B %e, %Y"}),t=YAHOO.util.Date.format(k,{format:"%B %e, %Y"});a=q===t?"<p><b>Basic Statistics for "+YAHOO.util.Dom.get("domain").value+" &middot; "+q+"</b></p>":"<p><b>Basic Statistics for "+YAHOO.util.Dom.get("domain").value+" &middot; "+q+" to "+t+"</b></p>";a+='<table id="table_dns_zone" class="dynamic_table" border="0" cellspacing="0">';a+='<tr class="dt_header_row">';a+='<th width="100">&nbsp;</th>';a+="<th>regular traffic</th>";a+="<th>crawlers/bots</th>";
a+="<th>threats</th>";a+="<th>info</th>";a+="</tr>";a+='<tr class="dt_module_row rowA">';a+='<td width="100">Page Views</td>';a+='<td style="text-align:center;">'+YAHOO.util.Number.format(parseInt(f.trafficBreakdown.pageviews.regular),b)+"</td>";a+='<td style="text-align:center;">'+YAHOO.util.Number.format(parseInt(f.trafficBreakdown.pageviews.crawler),b)+"</td>";a+='<td style="text-align:center;">'+YAHOO.util.Number.format(parseInt(f.trafficBreakdown.pageviews.threat),b)+"</td>";a+='<td style="text-align:center;"><image src="../images/cloudflare/Info_16x16.png" width="13" height="13" onclick="showHelp(\'visits\')"></td>';
a+="</tr>";a+='<tr class="dt_module_row rowB">';a+='<td width="100">Unique Visitors</td>';a+='<td style="text-align:center;">'+YAHOO.util.Number.format(parseInt(f.trafficBreakdown.uniques.regular),b)+"</td>";a+='<td style="text-align:center;">'+YAHOO.util.Number.format(parseInt(f.trafficBreakdown.uniques.crawler),b)+"</td>";a+='<td style="text-align:center;">'+YAHOO.util.Number.format(parseInt(f.trafficBreakdown.uniques.threat),b)+"</td>";a+='<td style="text-align:center;"><image src="../images/cloudflare/Info_16x16.png" width="13" height="13" onclick="showHelp(\'uniques\')"></td>';
a+="</tr>";a+="</table>";a+='<p><table id="table_dns_zone" class="dynamic_table" border="0" cellspacing="0" cellpadding="0">';a+="<tr><td>";var y=YAHOO.util.Number.format(parseInt(f.requestsServed.cloudflare+f.requestsServed.user),b),z=YAHOO.util.Number.format(parseInt(f.requestsServed.cloudflare),b),r=100*(parseInt(f.requestsServed.cloudflare)/parseInt(f.requestsServed.cloudflare+f.requestsServed.user));isNaN(r)&&(r=0);var m=parseFloat(f.bandwidthServed.cloudflare)+parseFloat(f.bandwidthServed.user),
n=parseFloat(f.bandwidthServed.cloudflare),h=100*(n/m);isNaN(h)&&(h=0);k=l=" KB";102.4<=m&&(m/=1024,l=" MB");102.4<=n&&(n/=1024,k=" MB");m=YAHOO.util.Number.format(m,c);n=YAHOO.util.Number.format(n,c);f.pageLoadTime&&(parseFloat(f.pageLoadTime.without),parseFloat(f.pageLoadTime.cloudflare));a+="</tr></td>";a+="</table></p>";a+='<div id="analytics-stats">';a+='<div class="analytics-speed-column" id="analytics-speed-request"><h4 class="analytics-chartTitle"><span class="analytics-chartTitle-inner">Requests Saved <image src="../images/cloudflare/Info_16x16.png" width="13" height="13" onclick="showHelp(\'hits\')"></span></h4> <table><tr><td> <div class="analytics-chart" id="analytics-speed-requs-chart"> <img src="https://chart.googleapis.com/chart?cht=p&chco=ed7200|505151&chs=80x80&chd=t:'+
r+","+(100-r)+'" width="80" height="80"> </div> </td><td> <div class="analytics-speed-savedByCF"><span id="analytics-speed-reqs-savedByCF">'+z+'</span> requests saved by CloudFlare</div> <div class="analytics-speed-total"><span id="analytics-speed-reqs-total">'+y+"</span> total requests</div>  </td></tr></table></div>";a+='<div class="analytics-speed-column analytics-right-rail">';a+='<div class="analytics-speed-column" id="analytics-speed-bandwidth"><h4 class="analytics-chartTitle"><span class="analytics-chartTitle-inner">Bandwidth Saved <image src="../images/cloudflare/Info_16x16.png" width="13" height="13" onclick="showHelp(\'bandwidth\')"></span></h4> <table><tr><td> <div class="analytics-chart" id="analytics-speed-bandwidth-chart"> <img src="https://chart.googleapis.com/chart?cht=p&chco=ed7200|505151&chs=80x80&chd=t:'+
h+","+(100-h)+'" width="80" height="80"> </div> </td><td> <div class="analytics-speed-savedByCF"><span id="analytics-speed-bandwidth-savedByCF">'+n+k+'</span> bandwidth saved by CloudFlare</div> <div class="analytics-speed-total"><span id="analytics-speed-bandwidth-total">'+m+l+"</span> total bandwidth</div>  </td></tr></table> </div>";a+="</div>";a+="</div>";a+='<div id="analytics-cta-row"><div id="analytics-cta" class="ctaButton"><a class="inner" href="http://www.cloudflare.com/analytics.html" target="_blank"><span class="label">See more statistics</span></a></div></div>';
a+='<p>Note: Basic statistics update every 24 hours. For 15 minute statistics updates, advanced security and faster performance, upgrade to the <a href="https://www.cloudflare.com/pro-settings.html" target="_blank">Pro service</a>.</p>'}a+='<A NAME="infobox"></A>';a+='<p id="cf-settings"><b>Cloudflare Settings for '+YAHOO.util.Dom.get("domain").value+"</b></p>";a+='<p><table id="table_dns_zone" class="dynamic_table" border="0" cellspacing="0" cellpadding="0">';var s=f.userSecuritySetting,u=f.cache_lvl,
v=f.ipv46,w=1E3*f.dev_mode,x=f.ob,A=f.currentServerTime;(new Date).getTimezoneOffset();a+='<tr class="dt_module_row rowB">';a+='<td width="280">CloudFlare Account Type</td>';a+='<td><select name="AccountType" id="AccountType" onChange="change_cf_accnt()">';a+='<option value="free"'+(f.pro_zone?"":"selected")+">Free</option>";a+='<option value="pro"'+(f.pro_zone?"selected":"")+">CloudFlare Pro</option>";a+="</select></td><td>&nbsp;</td>";a+='<td style="text-align:center;"><image src="../images/cloudflare/Info_16x16.png" width="13" height="13" onclick="showHelp(\'pro\')"></td></tr>';
a+='<tr class="dt_module_row rowA">';a+='<td width="280">CloudFlare security setting</td>';a+='<td><select name="SecurityLevelSetting" id="SecurityLevelSetting" onChange="change_cf_setting(\''+d+"', 'sec_lvl', 'SecurityLevelSetting')\">";a+='<option value="high"'+("High"==s?"selected":"")+">High</option>";a+='<option value="med"'+("Medium"==s?"selected":"")+">Medium</option>";a+='<option value="low"'+("Low"==s?"selected":"")+">Low</option>";a+='<option value="help"'+("I'm under attack!"==s?"selected":
"")+">I'm under attack!</option>";a+="</select></td><td>&nbsp;</td>";a+='<td style="text-align:center;"><image src="../images/cloudflare/Info_16x16.png" width="13" height="13" onclick="showHelp(\'seclvl\')"></td></tr>';a+='<tr class="dt_module_row rowB">';a=w>A?a+('<td width="280">Development Mode will end at</td><td>'+YAHOO.util.Date.format(new Date(w),{format:"%D %T"})+'</td><td>Click <a href="javascript:void(0);" onclick="change_cf_setting(\''+d+"', 'devmode', 0)\">here</a> to disable</td>"):a+
('<td width="280">Development Mode</td><td>Off</td><td>Click <a href="javascript:void(0);" onclick="change_cf_setting(\''+d+"', 'devmode', 1)\">here</a> to enable</td>");a+='<td style="text-align:center;"><image src="../images/cloudflare/Info_16x16.png" width="13" height="13" onclick="showHelp(\'devmode\')"></td>';a+="</tr>";a+='<tr class="dt_module_row rowA">';a+='<td width="280">Cache Purge</td><td>&nbsp;</td><td>Click <a href="javascript:void(0);" onclick="change_cf_setting(\''+d+"', 'fpurge_ts', 1)\">here</a> to purge</td>";
a+='<td style="text-align:center;"><image src="../images/cloudflare/Info_16x16.png" width="13" height="13" class="info-icon" onclick="showHelp(\'fpurge_ts\')"></td>';a+="</tr>";a+='<tr class="dt_module_row rowB">';a+='<td width="280">Always Online</td>';a+='<td><select name="AlwaysOnline" id="AlwaysOnline" onChange="change_cf_setting(\''+d+"', 'ob', 'AlwaysOnline')\">";a+='<option value="0"'+("0"==x?"selected":"")+">Off</option>";a+='<option value="1"'+("1"==x?"selected":"")+">On</option>";a+="</select></td><td>&nbsp;</td>";
a+='<td style="text-align:center;"><image src="../images/cloudflare/Info_16x16.png" width="13" height="13" class="info-icon" onclick="showHelp(\'ob\')"></td></tr>';a+='<tr class="dt_module_row rowA">';a+='<td width="280">Automatic IPv6</td>';a+='<td><select name="AutomaticIPv6" id="AutomaticIPv6" onChange="change_cf_setting(\''+d+"', 'ipv46', 'AutomaticIPv6')\">";a+='<option value="0"'+("0"==v?"selected":"")+">Off</option>";a+='<option value="3"'+("3"==v?"selected":"")+">Full</option>";a+="</select></td><td>&nbsp;</td>";
a+='<td style="text-align:center;"><image src="../images/cloudflare/Info_16x16.png" width="13" height="13" class="info-icon" onclick="showHelp(\'ipv46\')"></td></tr>';a+='<tr class="dt_module_row rowB">';a+='<td width="280">CloudFlare caching level</td>';a+='<td><select name="CachingLevel" id="CachingLevel" onChange="change_cf_setting(\''+d+"', 'cache_lvl', 'CachingLevel')\">";a+='<option value="agg"'+("agg"==u?"selected":"")+">Aggressive</option>";a+='<option value="basic"'+("basic"==u?"selected":
"")+">Basic</option>";a+="</select></td><td>&nbsp;</td>";a+='<td style="text-align:center;"><image src="../images/cloudflare/Info_16x16.png" width="13" height="13" class="info-icon" onclick="showHelp(\'cache_lvl\')"></td></tr>';a+='<tr id="rglist" class="dt_module_row rowA">';a+="</tr>";a+="</table></p>";a+='<p>For more statistics and settings, sign into your account at <a href="https://www.cloudflare.com/analytics.html" target="_blank">CloudFlare</a>.</p>';YAHOO.util.Dom.get("user_records_div").innerHTML=
a;var p;setTimeout(function(a){a={cpanel_jsonapi_version:2,cpanel_jsonapi_module:"CloudFlare",cpanel_jsonapi_func:"get_railguns",zone_name:YAHOO.util.Dom.get("domain").value,user_email:USER_EMAIL,user_api_key:USER_API_KEY,homedir:USER_HOME_DIR};connection=YAHOO.util.Connect.asyncRequest("GET",CPANEL.urls.json_api(a),{success:function(a){try{var b=YAHOO.lang.JSON.parse(a.responseText);if(b.cpanelresult.error)console.log("Hey, it didn't work.");else if("error"==b.cpanelresult.data[0].result)console.log("Seriously, it didn't work.");
else{var c=b.cpanelresult.data[0].response.railguns.objs;a="";if(null!=c){p=c;a+='<td width="280">Railgun</td>';a+='<td><select name="Railgun" id="Railgun" onChange="set_railgun(\''+d+"','Railgun')\">";a+='<option value="remove">Railgun Not Selected</option>';for(var b=c=!1,f=0;f<p.length;f++)a+='<option value="'+p[f].railgun_tag+'" ',null!=e&&e.railgun_pubname==p[f].railgun_pubname&&(a+="selected",b=!0),a+=">"+p[f].railgun_pubname,"0"==p[f].railgun_mode&&(a+=" (Disabled)",c=!0),a+="</option>";a+=
"</select></td>";b?c?a+="<td>&nbsp;</td>":(a+="<td>",a+='<select name="RailgunStatus" id="RailgunStatus" onChange="set_railgun_mode(\''+d+"','Railgun', 'RailgunStatus')\">",a+='<option value="0">Off</option>',a+='<option value="1"'+("1"==e.railgun_conn_mode?"selected":"")+">On</option>",a+="</select></td>"):a+="<td>&nbsp;</td>";a+='<td style="text-align:center;"><image src="../images/cloudflare/Info_16x16.png" width="13" height="13" class="info-icon" onclick="showHelp(\'railgun\')"></td></tr>';YAHOO.util.Dom.get("rglist").innerHTML=
a}}}catch(h){console.log("It was an exception. Happy?")}},failure:function(a){console.log("It failed.")}},"")},500)}}catch(B){YAHOO.util.Dom.get("user_records_div").innerHTML='<div style="padding: 20px">'+CPANEL.icons.error+" "+B+"</div>"}},failure:function(c){YAHOO.util.Dom.get("user_records_div").innerHTML='<div style="padding: 20px">'+CPANEL.icons.error+" "+CPANEL.lang.ajax_error+": "+CPANEL.lang.ajax_try_again+"</div>"}},"");YAHOO.util.Dom.get("user_records_div").innerHTML='<div style="padding: 20px">'+
CPANEL.icons.ajax+" "+CPANEL.lang.ajax_loading+"</div>";return!1},init_page=function(){var d=document.getElementById("USER_submit");YAHOO.util.Event.addListener(d,"click",signup_to_cf);YAHOO.util.Event.on("domain","change",toggle_domain);add_validation();"_select_"!=YAHOO.util.Dom.get("domain").value&&update_user_records_table()};YAHOO.util.Event.onDOMReady(init_page);
(function(){var d=[["div.dt_module","display:none"]],e=document.styleSheets[0];"insertRule"in e?d.forEach(function(c){e.insertRule(c[0]+" {"+c[1]+"}",0)}):d.forEach(function(c){e.addRule(c[0],c[1],0)})})();
