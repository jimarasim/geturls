/**
 * This is called when the document is loaded
 * @param {type} param1
 * @param {type} param2
 */
document.addEventListener('DOMContentLoaded', function () {

    //generate the tab list
    UpdateTabList();
    
    //add listener for when tabs are removed
    chrome.tabs.onRemoved.addListener(function(tabId,removeInfo){
            //remove all list items
            $("#urls li").remove(); 

            //re-do list
            UpdateTabList();
    });

    
    //create event to close all but the current tab
    $("#closeAllButCurrent").click(function(){
        CloseAllButCurrentTab();
    });
});

/**
 * This function builds the tab list in the default_popup
 * @returns {undefined}
 */
function UpdateTabList(){
    //query chrome for its tabs
    chrome.tabs.query({}, function (tabs) {
        
        //cycle through all the tabs, and add them to the list in the default_popup
        for (var i = 0; i < tabs.length; i++) {
            
            //append a list item for each tab.  one for the title, and on for the url
            $("<li/>").appendTo("#urls").html("<b>"+tabs[i].title+"</b>");
            
            //url list item has a bottom margin, to space the entries apart
            $("<li class='withmargin'/>").appendTo("#urls").html("<a id='"+i+"'>"+tabs[i].url+"</a>");
            
            //when the url is clicked, highlight the tab
            $("#"+i).click(function(event){
                chrome.tabs.highlight({tabs:[parseInt(event.target.id)]},function(window){
                    
                    //set the window as active, in case there are multiple
                    //chrome.windows.update(window.id, {focused:true});
                    
                    
                });
                
            });
        }

    });
}

/**
 * This function closes all but the current tab
 * @returns {undefined}
 */
function CloseAllButCurrentTab(){
    var currentTab;
    chrome.tabs.query({ currentWindow: true, active: true },function(tabs) {
        currentTab = tabs[0].id;
        chrome.tabs.query({}, function (tabs) {
            for (var i = 0; i < tabs.length; i++) {
                if(tabs[i].id!=currentTab)
                {
                    chrome.tabs.remove(tabs[i].id, function(){});
                }
            }
            
            
        });
    });
}


