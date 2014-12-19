var tw_url = 'twitter.com/';
var tw_url_r = /(http:|https:)?(\/\/)?(www\.)?twitter\.com\/(?:\/\#!)?/g;//twitter url
var ht_url_r = /(http:|https:)?(\/\/)?(www\.)?twitter\.com\/(#\w+|hashtag\/|search)/g; //hashtag url
var username_r = /@([A-Za-z0-9_]+)/ig;  //@username text
var username_url_r = /(http:\/\/)?(https:\/\/)?(www\.)?twitter\.com(\/\#!)?\/(?!intent\/|home\/|share\/|share?|discussions\/|status\/|statuses\/|hashtag\/|search)(\w+)/ig;
var status_url_r = /(http:|https:)?(\/\/)?(www\.)?twitter\.com\/(?:\/\#!)?(\w+\/)(status|statuses)(\/\w+)/g;
var retweet_fav_url_r = /(http:|https:)?(\/\/)?(www\.)?twitter\.com\/(?:\/\#!)?(intent\/)(retweet|favorite)(\?tweet_id\=)/g;
var share_url_r = /(http:|https:)?(\/\/)?(www\.)?twitter\.com\/(intent)?(share\?|share\/|\/tweet|status\/)/g;
var follow_url_r = /(http:\/\/)?(https:\/\/)?(www\.)?twitter\.com(?:\/\#!)?\/(intent\/follow)/ig;

var services_tw_r  = /(http:|https:)?(\/\/)?(www\.)?(about|api|tweetdeck|support|ads|dev|blog|mobile|oauth|status|platform).twitter\.com\//g;
var tw_url_selector = '[href*="'+tw_url+'"],[data-href*="'+tw_url+'"],[data-url*="'+tw_url+'"]';


var tweetbot_url = 'tweetbot://';
var username_url = tweetbot_url+'/user_profile/';
var post_tweet_url = tweetbot_url+'/post?text=';
var follow_btn_url = tweetbot_url+'/follow/';
var search_url = tweetbot_url+'/search/';


var twitter_wigets = 'iframe[class*="twitter-"], iframe[src*="twitter.com"]';
var twitter_button_class_r = /(twitter-)+\w+(-button)?/g;

var p_username;

var p_url = location.protocol+'//'+location.host+location.pathname;

//trying to fetch the page title
var p_title = '';
if(  $('h1').eq(0).contents().find('img').length == 0 ){
    p_title = $('h1[class*="title"]').eq(0).text();
}

if( !p_title ){
    p_title = $('meta[property="og:title"]').attr('content');
}

if( !p_title ){
    p_title = $('title').text().trim();
}

var url_source = '?utm_source=';
var url_vars;

function getShareTxt(_url_vars, is_official_widget){
    var share_txt = '';

    if (_url_vars.text) {
        if (_url_vars.text.search('http') >= 0){
            share_txt += unescape(_url_vars.text)
        }else{
            if ( !is_official_widget && _url_vars.text.search(' ') >= 0 ){
                share_txt += $.param({text:_url_vars.text}).replace('text=','');
            }else{
                share_txt += _url_vars.text;
            }
        }
        share_txt = share_txt.replace(/(\r\n|\n|\r)/gm,"")
    }

    if (_url_vars.status){
        share_txt += _url_vars.status;
    }

    if (_url_vars.url) {
<<<<<<< HEAD
        if ( url_vars.url.match(/\%/g) ){
        // if (!is_official_widget){
            share_txt += '+'+unescape(_url_vars.url);
        }else{
            share_txt += '+'+_url_vars.url;
        }
=======
        // if (!is_official_widget){
        //     share_txt += '+'+escape(_url_vars.url);
        // }else{
        //     share_txt += '+'+_url_vars.url;
        // }
        share_txt += '+'+ p_url;
>>>>>>> 9b6234342bfaadeeaead35a6461f0c4e891da7e3
    }

    if (_url_vars.button_hashtag) {
        share_txt += '+'+encodeURIComponent('#'+_url_vars.button_hashtag);
    }

    if (_url_vars.via) {
        share_txt += '+-+'+encodeURIComponent('@')+_url_vars.via ;
    }

    if ( _url_vars.in_reply_to ){
        share_txt += '&in_reply_to_status_id='+_url_vars.in_reply_to;
    }

    share_txt = share_txt.replace(/(%20)/igm, '+').replace(/ /g, '+')
    _log(_url_vars);
    _log(share_txt);
    return share_txt;
}

function setupUrlAction(el, url){
<<<<<<< HEAD
    if ( !$(el).hasClass('linkbot') ){
=======
    if ( !$(el).hasClass('tweetbotium') ){
>>>>>>> 9b6234342bfaadeeaead35a6461f0c4e891da7e3
        var n_el = el.cloneNode(true);
        el.parentNode.replaceChild(n_el, el);

        $(n_el)
        .attr('o_href', $(el).attr('href') )
        .attr('href', url)
        .removeAttr('target')
        .removeAttr('onclick')
        .unbind()
        .off()
        .undelegate()
<<<<<<< HEAD
        .addClass('linkbot')
=======
        .addClass('tweetbotium')
>>>>>>> 9b6234342bfaadeeaead35a6461f0c4e891da7e3
        .click(function(e){
            e.preventDefault();
            location.href = url;
            return false;
        });
<<<<<<< HEAD
        // .contents('i, .icon').addClass('linkbot-icon');
=======
        // .contents('i, .icon').addClass('tweetbotium-icon');
>>>>>>> 9b6234342bfaadeeaead35a6461f0c4e891da7e3
    }
}

function parseUrl(el){
    h = $(el).attr('href');
    if ( !h ){
        h = $(el).attr('data-href');
    }if ( !h ){
        h = $(el).attr('data-url');
    }if( !h ){
        return false;
    }

    //exclude SUBDOMAINS.twitter links
    if (h.match(services_tw_r)) {
        return false;
    }

    //username urls
    if ( $(el).text().match(username_r) ){
        _log('username urls ' + h);
        $(el).text().replace(username_r, function(m,k,v){
            url = username_url + k;
        });
        setupUrlAction(el, url);
        return false;
    }

    if ( h.match(username_url_r) && !h.match(status_url_r) ){
        if ( h.search('intent') ){
            _log('username urls 2 ' + h);

            url =  $(el).attr('href').replace(tw_url_r, username_url).replace('\/#!', '');
            setupUrlAction(el, url);
            return false;
        }
    }

    //hashtag url
    if ( h.match(ht_url_r) ){
        _log('hashtag ' + h);
        url =  $(el).attr('href').replace(ht_url_r, search_url ).replace('#', '%23');
        setupUrlAction(el, url);
        return false;
    }

    //tweet id
    if(h.match(status_url_r)){
        _log('tweet id ' + h);
        url =  $(el).attr('href').replace(tw_url_r, tweetbot_url ).replace('statuses', 'status');
        setupUrlAction(el, url);
        return false;
    }

    //retweet fav
    if(h.match(retweet_fav_url_r)){
        _log('retweet & fav '+h);
        url = $(el).attr('href').replace(retweet_fav_url_r, tweetbot_url+'/status/' );
        _log(url);
        setupUrlAction(el, url);
        return false;
    }

    //sharing links
    if ( h.match(share_url_r) ){
        _log('sharing links ' + h);
        url_vars = getUrlVars(h);
        url = post_tweet_url + getShareTxt(url_vars, 0) ;
        setupUrlAction(el, url);
        return false;
    }

    return false;
}

function parseIframe(el, type){
    var _href, _title, _html;

    $(el).ready(function(){

        setTimeout(function(){
            _log('twitter iframe loaded... '+type);

            $(el).contents().find(tw_url_selector)
            .each(function(_i, c_el) {
                parseUrl(c_el);
            });
        }, 1000);

    });

    switch (type){
        case '/tweet_button.html':
        case 'twitter-share-button':
            url_vars = getUrlVars( $(el).attr('src') );
            _href = post_tweet_url + getShareTxt(url_vars, 1);
            _title = 'Tweet';
            _html = '<span>Tweet</span>';
        break;

        case 'twitter-follow-button':
            url_vars = getUrlVars( $(el).attr('src') );
            //pending follow action
            _href = username_url+url_vars.screen_name;
            _title = 'Follow';
            _html = '<span>Follow @'+url_vars.screen_name+'</span>';

        break;

        case 'twitter-mention-button':
            url_vars = getUrlVars( $(el).attr('src') );

            _href = post_tweet_url+'@'+url_vars.screen_name;
            _title = 'Tweet to';
            _html = '<span>Tweet to @'+url_vars.screen_name+'</span>';

        break;

        case 'twitter-hashtag-button':
            url_vars = getUrlVars( $(el).attr('src') );
            _href = post_tweet_url+getShareTxt(url_vars, 1);
            _title = 'Tweet';
            _html = '<span>Tweet #'+url_vars.button_hashtag+'</span>';
        break;

        default:
            return false;
    }

<<<<<<< HEAD
    renderCustomButton(el, { href:_href, title:_title, html: _html, class: 'linkbot-button'});
    return false;
}

function resizeCustomButtonParent(el){
    _w = $(el).width();
    _p_w = $(el).parent().width();
    if ( _w > _p_w ){
        $(el).parent().attr('style', function(i,s) {
            _style = '';
            if (s){
                _style += s;
            }
            _style += 'width: '+_w+'px !important;' ;
            return _style;
        });
    }
    return false;
}

function renderCustomButton(el, data){

    if ( $(el).hasClass('linkbot') ){
        return false;
    }

    var widget_class = 'linkbot-widget';
=======
    renderCustomButton(el, { href:_href, title:_title, html: _html, class: 'tweetbotium-button'});
    return false;
}
function resizeCustomButtonParent(el){
    _w = $(el).width();
    $(el).parent().attr('style', function(i,s) {
        _style = '';
        if (s){
            _style += s;
        }
        _style += 'width: '+_w+'px !important;' ;
        return _style;
    });

    return false;
}
function renderCustomButton(el, data){

    if ( $(el).hasClass('tweetbotium') ){
        return false;
    }

    var widget_class = 'tweetbotium-widget';
>>>>>>> 9b6234342bfaadeeaead35a6461f0c4e891da7e3
    //create the new button
    var button = $('<a/>', {
        href:  data.href,
        title: data.title,
<<<<<<< HEAD
        html: '<i class="linkbot-icon"></i>'+data.html,
=======
        html: '<i class="tweetbotium-icon"></i>'+data.html,
>>>>>>> 9b6234342bfaadeeaead35a6461f0c4e891da7e3
        class: data.class,
    });

    if ( location.protocol == 'https:' ){
        $(button).insertBefore(el);
        resizeCustomButtonParent(button);
    }else{
        var new_widget = $('<iframe/>',{class:widget_class}).insertBefore(el);

        $(new_widget).contents().find('body').append(button)
<<<<<<< HEAD
        .append('<link rel="stylesheet" href="'+chrome.extension.getURL('linkbot.css')+'">');
=======
        .append('<link rel="stylesheet" href="'+chrome.extension.getURL('tweetbotium.css')+'">');
>>>>>>> 9b6234342bfaadeeaead35a6461f0c4e891da7e3

        setTimeout(function(){
            var a = $(new_widget).contents().find("a");

            var h = $(a[0]).outerHeight();
            var w = $(a[0]).outerWidth();

            $(new_widget).height( h );
            $(new_widget).width( w );
            resizeCustomButtonParent(new_widget);
        }, 500);
    }

    $(el).remove();
    return false;
}

//youtube widget
function parseYtButton(el){
    url_vars = {
        url:$('.share-panel-url').eq(0).val(),
        text: $('#watch-headline-title').text().trim(),
        via: 'YouTube'
    }

    url = post_tweet_url + getShareTxt( url_vars, 0 );
    _title = $(el).attr('title');

<<<<<<< HEAD
    renderCustomButton(el, { href:url, title:_title, html: '', class: 'linkbot-squared-button'});
=======
    renderCustomButton(el, { href:url, title:_title, html: '', class: 'tweetbotium-squared-button'});
>>>>>>> 9b6234342bfaadeeaead35a6461f0c4e891da7e3
}

function doTheMagic(){
    //iframe widgets
    $(twitter_wigets).each(function(index, el) {
        if($(el).attr('class')){
            var _type = $(el).attr('class').match(twitter_button_class_r);
        }else if($(el).attr('src')) {
            var _type = $(el).attr('src').match(/(\/\w+\.html)/g)
        }

        if ( _type ){
            parseIframe(el, _type[0]);
        }

    });
    $("#tweet_btn").each(function(index, el) {
        parseIframe(el, "twitter-share-button");
    });

    //CUSTOM SITE WIDGETS
    //OH GOD WHY

    //po.st widget
    $('a.pw-button-twitter').each(function(index, el) {
        renderCustomButton(el, {
            href: post_tweet_url + getShareTxt({url: p_url, text: p_title,via: $('div.pw').eq(0).attr('pw:twitter-via') }, 0),
            title: p_title,
            html: "<span>Tweet</span>",
<<<<<<< HEAD
            class: 'linkbot-button'}
=======
            class: 'tweetbotium-button'}
>>>>>>> 9b6234342bfaadeeaead35a6461f0c4e891da7e3
        );
    });

    //sharethis widget
    $('[class*="st_twitter"]').each(function(index, el) {
        var _type = $(el).attr('class').match(/st_twitter_\w+/g);
<<<<<<< HEAD
        var btn_class = 'linkbot-button';
=======
        var btn_class = 'tweetbotium-button';
>>>>>>> 9b6234342bfaadeeaead35a6461f0c4e891da7e3
        var _html = '';

        if ( _type ){
            switch( _type[0] ){
                case 'st_twitter_large':
                case 'st_twitter_stbar':
<<<<<<< HEAD
                    btn_class = 'linkbot-squared-button';
                break;
                default:
                    btn_class = 'linkbot-button';
=======
                    btn_class = 'tweetbotium-squared-button';
                break;
                default:
                    btn_class = 'tweetbotium-button';
>>>>>>> 9b6234342bfaadeeaead35a6461f0c4e891da7e3
                    _html = '<span>Tweet</span>';
            }
            renderCustomButton(el, {
                href: post_tweet_url + getShareTxt({url: p_url, text: p_title,via: $('div.pw').eq(0).attr('pw:twitter-via') }, 0),
                title: p_title,
                html: _html,
                class: btn_class }
            );
        }
    });

    //buzzfeed
    $('.tweet_share a, .sub-buzz-twitter-share').each(function(index, el) {
        u = post_tweet_url + getShareTxt({
            url: p_url,
            text: p_title,
        }, 0);
        setupUrlAction(el, u);
    });

    //nytimes
    $('[data-share="twitter"]').each(function(index, el) {
        u = post_tweet_url + getShareTxt({
            url: p_url,
            text: p_title,
        }, 0);
        setupUrlAction(el, u);
    });
    //bbc
    $('.bbc-st-twitter-cta a').each(function(index, el) {
        renderCustomButton(el, {
            href: post_tweet_url + getShareTxt({url: p_url, text: p_title }, 0),
            title: $(el).attr('title'),
            html: '',
<<<<<<< HEAD
            class: 'linkbot-button'}
=======
            class: 'tweetbotium-button'}
>>>>>>> 9b6234342bfaadeeaead35a6461f0c4e891da7e3
        );
    });
    //motherboard
    $('a.social-twitter').unbind('click')
<<<<<<< HEAD
    .mouseenter(function(e){
=======
    .click(function(e){
>>>>>>> 9b6234342bfaadeeaead35a6461f0c4e891da7e3
        u = post_tweet_url + getShareTxt({
            url: p_url,
            text: p_title,
            via: 'motherboard'
        }, 0);
        setupUrlAction(this, u);
    });

    //Kinja sites
    $('.js_share-post-item.twitter').each(function(index, el) {
        url_vars = {
            url: p_url,
            text: p_title
        };
        u = post_tweet_url + getShareTxt(url_vars, 0);
        setupUrlAction(el, u);
    });

    //pocket
    $('#pagenav_share').click(function(){
        url_vars = {
            url: $(".share-original").attr('href'),
            text: $('h1').text(),
            via: 'Pocket'
        }
        u = post_tweet_url + getShareTxt(url_vars, 0);
        $('a.share-twitter').text('Tweetbot').unbind('click')
        .click(function(e){
            e.preventDefault();
            location.href = u;
            return false;
        });
    });
    //kickstarter backed proyect
    $('a.share_twitter').click(function(e){
        e.preventDefault();
        url_vars = {
            url: $('.short_url').val(),
            text: 'I just backed '+ $('div.title > h2').text().trim()+ ' on @Kickstarter '
        }

        url = post_tweet_url + getShareTxt(url_vars, 0);
        location.href = url;

        return false;
    });

    //urls
    $(tw_url_selector).each(function(index, el) {
        parseUrl(el);
    });

    return false;
}

//youtube sharing button
$(document).on('focus','.share-panel-url', function(){
    $('[onclick*="'+tw_url.replace('/','')+'"]').each(function(index, el) {
        parseYtButton(el);
    });
});

//addthis
$(document).on('mouseenter', 'a.at-svc-twitter, a.addthis_button_twitter',function(){

<<<<<<< HEAD
    if ( !$(this).hasClass('linkbot') ){
=======
    if ( !$(this).hasClass('tweetbotium') ){
>>>>>>> 9b6234342bfaadeeaead35a6461f0c4e891da7e3
        u = post_tweet_url + getShareTxt({
            url: p_url,
            text: p_title,
        }, 0);
        $(this).removeClass('at4-share-btn');
        setupUrlAction(this, u);
    }

    return false;
});

//addtoany
$(document).on('mouseenter', '[class*="a2a_i"][href*="twitter"], .a2a_button_twitter',function(){

<<<<<<< HEAD
    if ( !$(this).hasClass('linkbot') ){
=======
    if ( !$(this).hasClass('tweetbotium') ){
>>>>>>> 9b6234342bfaadeeaead35a6461f0c4e891da7e3
        u = post_tweet_url + getShareTxt({
            url: p_url,
            text: p_title,
        }, 0);
        setupUrlAction(this, u);
    }

    return false;
});

//share42
$(document).on('mouseenter', '[onclick*="twitter"]',function(){

<<<<<<< HEAD
    if ( !$(this).hasClass('linkbot') ){
=======
    if ( !$(this).hasClass('tweetbotium') ){
>>>>>>> 9b6234342bfaadeeaead35a6461f0c4e891da7e3
        u = post_tweet_url + getShareTxt({
            url: p_url,
            text: p_title,
        }, 0);
        $(this).removeAttr('onclick');
        setupUrlAction(this, u);
    }

    return false;
});

//dynamic created urls
$(document).on('mouseenter', tw_url_selector, function(){
    _log( $(this).attr('href') );
    parseUrl(this);
});

$(function(){
    doTheMagic();

    document.addEventListener("DOMNodeInserted", function (ev) {
        var node = ev.target;
        //dinamically generated iframe widgets
        switch( node.tagName){
            case 'IFRAME':

                if($(node).attr('class')){
                    var _type = $(node).attr('class').match(twitter_button_class_r);

                    if ( _type ){
                        parseIframe($(node), _type[0]);
                    }
                }
            break;
            // _log( $(node).attr('class') );
        }
    });
});

debug = 0;
function _log(s){
    if (debug){
        console.log(s);
    }
    return false;
}

function getUrlVars(h) {
    var vars = {};
    var parts = h.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
        vars[key] = value;
    });
    return vars;
}

