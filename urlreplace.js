var tw_url = 'twitter.com/';
var tw_url_r = /(http:)?(https:)?(\/\/)?(www\.)?twitter\.com\/(?:\/\#!)?/g;
var ht_url_r = /(http:)?(https:)?(\/\/)?(www\.)?twitter\.com\/(#\w+)/g;
var username_r = /@([A-Za-z0-9_]+)/ig;
var url_start_r = /(http:\/\/)?(https:\/\/)?(www\.)?/ig;
var username_url_r = /(http:\/\/)?(https:\/\/)?(www\.)?twitter\.com(?:\/\#!)?\/(?!intent|home|share)(\w+)/ig;

var follow_url_r = /(http:\/\/)?(https:\/\/)?(www\.)?twitter\.com(?:\/\#!)?\/(intent\/follow)/ig;

var username_url = 'tweetbot:///user_profile/';
var post_tweet_url = 'tweetbot:///post?text=';
var follow_btn_url = 'tweetbot:///follow/';
var search_url = 'tweetbot:///search/';

var twitter_wigets = 'iframe[class^="twitter-"]';

var p_username;
var p_title = $('h1').eq(0).text();
// p_title = $('title');
var p_url = location.host+location.pathname;

var url_source = '?utm_source=';
var url_vars;

function getShareTxt(_url_vars, is_official_widget){
    var share_txt = '';

    if (_url_vars.text) {
        if (_url_vars.text.search('http') >= 0){
            share_txt += unescape(_url_vars.text)
        }else{

            // share_txt += escape( _url_vars.text ).replace(/ /g, '+');
            if (!is_official_widget){
                share_txt += $.param({text:_url_vars.text}).replace('text=','');
            }else{
                share_txt += _url_vars.text.replace(/ /g, '+');
            }
        }
    }

    if (_url_vars.url) {
        if (!is_official_widget){
            share_txt += '+'+escape(_url_vars.url);
        }else{
            share_txt += '+'+_url_vars.url;
        }
    }

    if (_url_vars.button_hashtag) {
        share_txt += '+'+encodeURIComponent('#'+_url_vars.button_hashtag);
    }

    if (_url_vars.via) {
        share_txt += '+-+'+encodeURIComponent('@')+_url_vars.via ;
    }

    return share_txt;
}

function parseUrl(el){
    //username urls
    if ( $(el).text().match(username_r) ){
        $(el).text().replace(username_r, function(m,k,v){
            url = username_url + k;
        });
        $(el).attr('href', '').attr('href', url).removeAttr('target');
    }

    h = $(el).attr('href');
    if ( h.match(username_url_r) ){
        if ( h.search('intent') ){
            url =  $(el).attr('href').replace(tw_url_r, username_url);
            $(el).attr('href', url).removeAttr('target');
        }
    }
    //hashtag url
    if ( h.match(ht_url_r) ){
        _log(h);
        url =  $(el).attr('href').replace(tw_url_r, search_url ).replace('#', '%23');
        $(el).attr('href', url).removeAttr('target');
    }

    //sharing links
    if ( h.search('share') >= 0  || h.search('tweet') >= 0 ){
        url_vars = getUrlVars(h);
        _log(url_vars);
        t = getShareTxt(url_vars, 1);
        _log(t);
        url = post_tweet_url + getShareTxt(url_vars, 1) ;

        $(el).attr('href', '').attr('href', url).removeAttr('target');
    }
    return false;
}

function parseIframe(el, type){
    var _href, _title, _html;
    switch (type){
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

    renderCustomButton(el, { href:_href, title:_title, html: _html, class: 'tweetbotium-button'});
    return false;
}

function renderCustomButton(el, data){
    var widget_class = 'tweetbotium-widget';
    //create the new button
    var button = $('<a/>', {
        href:  data.href,
        title: data.title,
        html: '<i></i>'+data.html,
        class: data.class,
    });

    var new_widget = $('<iframe/>',{class:widget_class}).insertBefore(el);
    $(new_widget).contents().find('body').append(button)
    .append('<link rel="stylesheet" href="'+chrome.extension.getURL('tweetbotium.css')+'">');

    setTimeout(function(){
        var a = $(new_widget).contents().find("a");

        var h = $(a[0]).outerHeight();
        var w = $(a[0]).outerWidth();

        $(new_widget).height( h );
        $(new_widget).width( w );
    }, 500);

    // $(el).remove();
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

    renderCustomButton(el, { href:url, title:_title, html: '', class: 'tweetbotium-squared-button'});
}

function doTheMagic(){
    //urls
    $('[href*="'+tw_url+'"]').each(function(index, el) {
        parseUrl(el);
    });

    //iframe widgets
    $(twitter_wigets).each(function(index, el) {
        var _type = $(el).attr('class').split(' ');
        parseIframe(el, _type[0]);
    });

    //custom site widgets
    //bbc
    $('.bbc-st-twitter-cta a').each(function(index, el) {
        renderCustomButton(el, {
            href: post_tweet_url + getShareTxt({url: p_url, text: p_title }, 0),
            title: $(el).attr('title'),
            html: '',
            class: 'tweetbotium-button'}
        );
    });
    //pocket
    //pocket sharing
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


    return false;
}

//youtube sharing button
$(document).on('focus','.share-panel-url', function(){
    $('[onclick*="'+tw_url.replace('/','')+'"]').each(function(index, el) {
        parseYtButton(el);
    });
});

//dynamic created urls
$(document).on('mouseenter', '[href*="'+tw_url+'"]', function(){
    parseUrl(this);
});

$(function(){

    doTheMagic();

    // document.addEventListener("DOMNodeInserted", function (ev) {
    //     var node = ev.target;
    //     _log(node);
    //     //urls
    //     if ( $(node).hasClass(sharing_btn_class) ){
    //         _log( sharing_btn_class );
    //     }
    // });

});


function _log(s){console.log(s);return false;}

function getUrlVars(h) {
    var vars = {};
    var parts = h.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
        // vars[key] = value.replace(/\//g, '');
        vars[key] = value;
    });
    return vars;
}
