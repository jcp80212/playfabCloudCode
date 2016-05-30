///////////////////////////////////////////////////////////////////////////////////////////////////////
// Just testing to see if this works
// Welcome to your first Cloud Script revision!
//
// Cloud Script runs in the PlayFab cloud and has full access to the PlayFab Game Server API 
// (https://api.playfab.com/Documentation/Server), and it runs in the context of a securely
// authenticated player, so you can use it to implement logic for your game that is safe from
// client-side exploits. 
//
// Cloud Script functions can also make web requests to external HTTP
// endpoints, such as a database or private API for your title, which makes them a flexible
// way to integrate with your existing backend systems.
//
// There are several different options for calling Cloud Script functions:
//
// 1) Your game client calls them directly using the "ExecuteCloudScript" API,
// passing in the function name and arguments in the request and receiving the 
// function return result in the response.
// (https://api.playfab.com/Documentation/Client/method/ExecuteCloudScript)
// 
// 2) You create PlayStream event actions that call them when a particular 
// event occurs, passing in the event and associated player profile data.
// (https://api.playfab.com/playstream/docs)
// 
// 3) For titles using the Photon Add-on (https://playfab.com/marketplace/photon/),
// Photon room events trigger webhooks which call corresponding Cloud Script functions.
// 
// The following examples demonstrate all three options.
//
///////////////////////////////////////////////////////////////////////////////////////////////////////


// This is a Cloud Script function. "args" is set to the value of the "FunctionParameter" 
// parameter of the ExecuteCloudScript API.
// (https://api.playfab.com/Documentation/Client/method/ExecuteCloudScript)
// "context" contains additional information when the Cloud Script function is called from a PlayStream action.
handlers.helloWorld = function (args, context) {
    
    // The pre-defined "currentPlayerId" variable is initialized to the PlayFab ID of the player logged-in on the game client. 
    // Cloud Script handles authenticating the player automatically.
    var message = "Hello " + args.inputValue + "!";

    // You can use the "log" object to write out debugging statements. It has
    // three functions corresponding to logging level: debug, info, and error. These functions
    // take a message string and an optional object.
    log.info(message);
    log.debug("helloWorld:", { input: args.inputValue });

    // The value you return from a Cloud Script function is passed back 
    // to the game client in the ExecuteCloudScript API response, along with any log statements
    // and additional diagnostic information, such as any errors returned by API calls or external HTTP
    // requests. They are also included in the optional player_executed_cloudscript PlayStream event 
    // generated by the function execution.
    // (https://api.playfab.com/playstream/docs/PlayStreamEventModels/player/player_executed_cloudscript)
    return { messageValue: message };
}
//used to handle when a player kills something in the game.
handlers.enemyKilled = function (args, context) {
    var monsterKilled = args.monsterKilled;
    var expAmount = args.expAmount;
    var skillPoints = args.skillPointsAmount;
    
    if (monsterKilled == "testing") {
        log.debug("worked");
        
        var AddUserVirtualCurrencyRequest = {
	    "PlayFabId" : currentPlayerId,
	    "VirtualCurrency": "SP",
	    "Amount": skillPoints
    };
    var AddUserVirtualCurrencyResult = server.AddUserVirtualCurrency(AddUserVirtualCurrencyRequest);
        
    }
}

handlers.enemyLooted = function (args, context) {
    var monsterKilled = args.monsterKilled;
    
    if (monsterKilled == "testing") {
        
        var GrantItemsToUserRequest = {
       		"PlayFabId" : currentPlayerId,
       		"ItemIds" : ["OutPostDog"],
       		"Annotaion" : "Granted Item for killing" + monsterKilled
       		};
       		
       	var GrantItemsToUserResult = server.GrantItemsToUser(GrantItemsToUserRequest);
       	var item = GrantItemsToUserResult[0];
       	var itemID = item.ItemInstanceId;
       	
       	var ConsumeItemRequest = {
       		"PlayFabId" : currentPlayerId,
       		"ItemInstanceId" : itemID,
       		"ConsumeCount" : 1
       	};
       	
       	var ConsumeItemResult = server.ConsumeItem(ConsumeItemRequest);
       	
       	log.debug("worked");
       	
        
    }
}

handlers.itemUpdate = function (args, context) {
    var ItemInstanceId = args.ItemInstanceId;
    var Data = args.Data;
    return server.UpdateUserInventoryItemCustomData = {
       		"PlayFabId" : currentPlayerId,
       		"ItemInstanceId" : ItemInstanceId,
       		"Data" : Data
       		};
       	log.debug("worked");	

       	
        
    }
}

