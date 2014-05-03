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
            //re-do list
            UpdateTabList();
    });

    
    //create event to close all but the current tab
    $("#closeAllButCurrent").click(function(){
        CloseAllButCurrentTab();
    });
    
    //create event to scrub images
    $("#scrapeimages").click(function(){
        ScrapeImages();
    });
});

/**
 * This function builds the tab list in the default_popup
 * @returns {undefined}
 */
function UpdateTabList(){
    //remove all list items
    $("#urls li").remove(); 

            
    //query chrome for its tabs
    chrome.tabs.query({}, function (tabs) {
        
        //cycle through all the tabs, and add them to the list in the default_popup
        for (var i = 0; i < tabs.length; i++) {
            
            //append a list item for each tab.  one for the title, and on for the url
            $("<li/>").appendTo("#urls").html("<b>"+tabs[i].title+"</b>");
            
            //url list item has a bottom margin, to space the entries apart
            $("<li class='withmargin'/>").appendTo("#urls").html("<a href='#' id='"+i+"'>"+tabs[i].url+"</a>");
            
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

/**
 * This function scrapes all images off the current highlighted page
 * @returns {undefined}
 */
function ScrapeImages(){
    
    chrome.tabs.getSelected(null,function(tab) 
    {
        //execute javascript on current tab, with jquery injected
        chrome.tabs.executeScript(null, { file: "jquery-1.11.1.min.js" }, function() {
            var script="var images;";
            script+="images=$( 'img' );";
            script+="$('body').empty();";
            script+="images.each(function( index ) {document.write('<img src=\"'+$( this ).attr('src')+'\" /><br />');} ); ";
            //script+="$( 'img' ).each(function( index ) {console.log( index + ': ' + $( this ).attr('src'));} ); ";
            
            chrome.tabs.executeScript(null,{code: script});
        });
        
        
        console.log("currenttab:"+tab.id);
        
    });
    
    
}


