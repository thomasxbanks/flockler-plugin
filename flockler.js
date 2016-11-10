;
(function($, window, document, undefined) {
    'use strict'

    let pluginName = 'flockler',
        defaults = {
            siteid: '1433',
            sectionid: '15352',
            yourMum: 'epic'
        }

    function Plugin(element, options) {
        this.element = element

        this.options = $.extend({}, defaults, options)

        this._defaults = defaults
        this._name = pluginName

        this.init()
    }

    Plugin.prototype.init = function() {
        //console.log(this)
        // Define your API url
        const apiEndPoint = 'https://api.flockler.com/v1/sites/' + this.options.siteid + '/sections/' + this.options.sectionid + '/articles?'
            // Declare your variables
        let id, image, text, title, type, username, userpic, userurl, video
            // Create the empty array for your Flockler objects
        let feed = []
            // Define the current Flockler block
        let thisFlockler = this.element.id
            // Add the container to the Flockler block
        $(this.element).append("<ul id='flockler-" + thisFlockler + "' />")
            // Call the API
        $.get(apiEndPoint, function(data) {
            for (let i = 0; i < data.articles.length; i++) {
                // Define shorthand for current article
                let article = data.articles[i]
                    // log for debug
                    //console.log(article)
                if (article.type == 'tweet') {
                    id = article.id
                    type = article.type
                    username = article.attachments.tweet.name
                    userpic = article.attachments.tweet.profile_image_url
                    userurl = 'https://twitter.com/' + article.attachments.tweet.screen_name
                    image = article.attachments.tweet.media_url
                    video = ''
                    text = article.attachments.tweet.text
                } else if (article.type == 'instagram') {
                    id = article.id
                    type = article.type
                    username = article.attachments.instagram_item.user_full_name
                    userpic = article.attachments.instagram_item.profile_picture
                    userurl = 'https://instagram.com/' + article.attachments.instagram_item.username
                    image = article.cover_url
                    video = article.attachments.instagram_item.video_standard_resolution
                    text = ''
                } else if (article.type == 'video') {
                    id = article.id
                    type = article.type
                    username = article.attachments.video.username
                    userpic = 'http://blog.coyoteproductions.co.uk/wp-content/uploads/2013/11/animated-youtube-logo.jpg'
                    userurl = article.attachments.video.original_url
                    image = article.attachments.video.cover_url
                    video = article.attachments.video.embed_src
                    title = article.title
                    text = article.body
                } else {
                    id = article.id
                    type = article.type
                    username = ''
                    userpic = ''
                    userurl = ''
                    image = ''
                    video = ''
                    text = ''
                }

                // Create the Flockler Item object
                let fi = {
                    id: id,
                    type: type,
                    username: username,
                    userpic: userpic,
                    userurl: userurl,
                    image: image,
                    video: video,
                    title: title,
                    text: text
                }
                // Add each Flockler Item object to the array
                feed.push(fi)
                // Add each item-wrapper to the container in the Flockler block
                $('ul#flockler-' + thisFlockler).append("<li class='flockler-item-" + feed[i].id + "'></div>")
                // Run the function that creates the Flockler Item layout
                makeFlocklerBlock(feed[i], thisFlockler)
            }
        })
        // Log for debug
        //console.log(feed)

    }


    $.fn[pluginName] = function(options) {
        return this.each(function() {
            if (!$.data(this, 'plugin_' + pluginName)) {
                $.data(this, 'plugin_' + pluginName,
                    new Plugin(this, options))
            }
        })
    }


}(jQuery, window, document))

function makeFlocklerBlock(item, thisFlockler) {
    // log for debug
    //console.log(item)

    // Declare your variables for layout
    let imageEl = "<img src='" + item.image + "' alt='" + item.username + "' />"
    let userpicEl = "<img src='" + item.userpic + "' alt='" + item.username + "' />"
    let usernameEl = "<a href='" + item.userurl + "'>" + item.username + "</a>"
    let titleEl = "<h2>" + item.title + "</h2>"
    let textEl = "<p>" + item.text + "</p>"
    var videoEl
    if (item.type == 'video') {
        var videoEl = "<iframe src='" + item.video + "'></iframe>"
    } else {
        var videoEl = "<video controls><source src='" + item.video + "' type='video/mp4'></video>"
    }

    // define your template for the layout
    let template = [
        "<div class='image-wrapper'></div>",
        "<div class='content-wrapper'><div class='author-wrapper'>" + userpicEl + usernameEl + "</div></div>"
    ].join("\n")

    // Find the current Flockler item-wrapper in the current Flockler block and add the template
    $('ul#flockler-' + thisFlockler).find('.flockler-item-' + item.id).html(template)
    // Append the template with current data
    $('.flockler-item-' + item.id).find('.image-wrapper').html((!item.video) ? imageEl : videoEl)
    $('.flockler-item-' + item.id).find('.content-wrapper').append((item.title) ? titleEl : null)
    $('.flockler-item-' + item.id).find('.content-wrapper').append((item.text) ? textEl : null)
}
