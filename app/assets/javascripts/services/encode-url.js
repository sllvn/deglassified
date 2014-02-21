angular.module('service.encode-url', [])

.service('encodeUrlService', function() {
    console.log('loaded');
    return function encodeUrl(string) {
        var urlSlug = string.toLowerCase();

        // Remove any character that is not a word character, digit, dash or whitespace.
        urlSlug = urlSlug.replace(/[^a-zA-Z0-9\-\s]/g, '');

        // Now replace white space with a dash
        urlSlug = urlSlug.replace(/\s+/g, '-');

        return urlSlug;
    }
})

;