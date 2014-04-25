document.addEventListener('DOMContentLoaded', function () {

    chrome.tabs.query({}, function (tabs) {
        for (var i = 0; i < tabs.length; i++) {
            console.log(tabs[i].url);
            $("<li/>").appendTo("#urls").html("<u>"+tabs[i].title+"</u>");
            $("<li/>").appendTo("#urls").html(tabs[i].url);

        }

    });
});

