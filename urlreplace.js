function _log(s){console.log(s);return false;}

function getUrlVars(h) {
    var vars = {};
    var parts = h.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
        vars[key] = value;
    });
    return vars;
}

var tw_url = 'twitter.com/';

var username_r = /@([A-Za-z0-9_]+)/ig;
var url_start_r = /(http:\/\/)?(https:\/\/)?(www\.)?/ig;
var username_url_r = /(http:\/\/)?(https:\/\/)?(www\.)?twitter\.com(?:\/\#!)?\/(?!intent|home|share)(\w+)/ig;

var username_tw = 'tweetbot:///user_profile/';

var sharing_btn_class = '.twitter-share-button';
var sharing_btn = 'iframe' + sharing_btn_class;
var sharing_btn_tw = 'tweetbot:///post?text=';

var p_username;
var p_title = jQuery('h1').eq(0).text();
// p_title = jQuery('title');
var p_url = location.host+location.pathname;

var url_source = '?utm_source=';
var url_vars;

function parse_url(el){

    //username urls
    if ( jQuery(el).text().match(username_r) ){
        jQuery(el).text().replace(username_r, function(m,k,v){
            url = username_tw + k;
        });
        jQuery(el).attr('href', url).removeAttr('target');
    }

    h = jQuery(el).attr('href');
    if ( h.match(username_url_r) ){
        if ( h.search('intent') ){
            url =  jQuery(el).attr('href').replace(url_start_r, '').replace(tw_url,username_tw );
            jQuery(el).attr('href', url).removeAttr('target');
        }
    }
    //follow button


    //sharing links
    if ( h.search(tw_url+'share') >= 0 ){
        url_vars = getUrlVars(h);
        url = sharing_btn_tw;

        if (url_vars.text) {
            url += encodeURIComponent(url_vars.text);
        }

        if (url_vars.url) {
            url += encodeURIComponent(url_vars.url);
        }

        if (url_vars.via) {
            url += encodeURIComponent(' - @'+ url_vars.via) ;
        }

        jQuery(el).attr('href', url).removeAttr('target');
    }
    return false;
}

function parse_iframe(el){
    var new_sharer =
    jQuery('<a/>', {
        href:  sharing_btn_tw+encodeURIComponent( p_title + ' ' + p_url),
        title: 'Tweet',
        html: '<span>Tweet</span>',
        class: 'tweetbotium-share-button',
    }).insertBefore(el).prepend('<i></i>');
    // $(el).remove();
    return false;
}

function do_the_magic(){
    //urls
    jQuery('[href*="'+tw_url+'"]').each(function(index, el) {
        parse_url(el);
    });

    //sharing widgets
    jQuery(sharing_btn).each(function(index, el) {
        parse_iframe(el);
    });
    return false;
}

jQuery(function(){

    do_the_magic();

    // document.addEventListener("DOMNodeInserted", function (ev) {
    //     var node = ev.target;
    //     _log(node);
    //     //urls
    //     if ( jQuery(node).hasClass(sharing_btn_class) ){
    //         _log( sharing_btn_class );
    //     }
    // });

});

jQuery(document).on('mouseenter', '[href*="'+tw_url+'"]', function(){
    parse_url(this);
})
