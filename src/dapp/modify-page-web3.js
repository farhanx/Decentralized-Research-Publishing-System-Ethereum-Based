/**
 * Decentralized Research Publishing Platform
 *
 *  @file modify-page-web3.js file contains the java script based functions for the modify.html page
 * it display the form to submit new paper on the existing paper data.
 *
 * @author Farhan Hameed Khan <farhankhan@blockchainsfalcon.com> | <farhanhbk@hotmail.com>
 * @date 1-Feb-2020
 * @version 1.1.0
 * @link http://www.blockchainsfalcon.com
 */

// this will contain the User contract Object once it is loaded
let userContractObj;

// this will contain the Paper contract Object once it is loaded
let paperContractObj;

// active existing paper id which must be modified.
let modify_paper_id = -1;

/**
 * @override
 * changeWalletAddress  A special overridden function to handle manual customization processes on changing wallet.
 * @param   accounts this contains the latest selected account.
 */
function changeWalletAddress(accounts)
{
    $("#wallet").text(accounts);
}

/**
 * @override
 * loadContractForThisPage  A special overridden function to handle manual customization processes when web3 gets initialize.
 */
function loadContractForThisPage() {
    //  userContractObj = new web3.eth.Contract(userContractAbi, userContractAddress);

    modify_paper_id = GetParameterValues("modify");

    if(modify_paper_id<=-1){ alert("Incorrect Request!!!"); return;}

    //alert(modify_paper_id);

    if (window.web3)
    {
        changeWalletAddress(web3.eth.defaultAccount);

        // loaded user contract
        userContractObj = web3.eth.contract(userContractAbi).at(userContractAddress);

        // loaded paper contract
        paperContractObj = web3.eth.contract(paperContractAbi).at(paperContractAddress);

        console.log("LOADED 1: Users Contract Address: --- "+userContractObj.address);
        console.log("LOADED 2: Papers Contract Address: --- "+paperContractObj.address);


        web3.eth.getAccounts(console.log);

        web3.eth.getBlockNumber(console.log);

        getCurrentUserInformation_contract();

        getPaperInfo(modify_paper_id);
    }
    else
    {
        console.log("ERROR: WEB3 is not initialized : loadContractForThisPage");
    }

}

/**
 * @override
 * getCurrentUserInformation_contract  This is a special overridden function which gets calls and return the active user information like role , name etc
 * on a successful call it sets the role , address and name. Which can be customized like here it is being set on the html tags
 * using sub function called showFullNameInputField
 */
function getCurrentUserInformation_contract()
{
    if (window.web3 && userContractObj)
    {
        const account = $("#wallet").text();
        userContractObj.getCurrentUserInformation({},{from:account},function (err, result) {

            if (err) {

                console.log("Error  " + JSON.stringify(err));
                console.log("Unable to call getCurrentUserInformation");

            } else {

                console.log("Current user information: " + JSON.stringify(result));

                if (result[1].length > 2)
                {

                    if(parseInt(result[0])===0) $("#role").text("Author");
                    else if (parseInt(result[0])===1) $("#role").text("Reviewer");
                    else  $("#role").text("Researcher");

                    $("#fullname").text(result[1]);

                    $("#paperSubmitMessage").text("You are a registered user , you can submit the paper").removeClass("alert-danger").addClass("alert-success");

                    $('form *').prop('disabled', false);

                }
                else
                {
                    $("#paperSubmitMessage").text(" Your wallet is not registered, you cannot upload your file.").removeClass("alert-success").addClass("alert-danger");

                    $("#fullname").text(result[1]);

                    $('form *').prop('disabled', true);

                    $("#role").text("None");

                }

             }

        });
    }
    else
    {
        console.log("ERROR: Unable to Load Contract and unable to call getCurrentUserInformation function");
    }

}

/**
 * submitPaper  This function gather all the required data to be sent on the smart contract to store the
 * new paper associated with the existing paperid. This basically a upload function for modified version.
 */
function submitPaper()
{
    // inputs for the contract from the form
    var userWallet = $("#wallet").text();
    var userRole =   $("#role").text();
    var username =   $("#fullname").text();
    var keywords =   $("#keywords").val();
    var title    =   $("#papertitle").val();
    var cid      =   $("#docfilemsg").text();

    // inputs validation

    if(title.length<5)
    {
        alert("Title must be minimum five characters long");
        return;
    }

    if(keywords.length<3)
    {
        alert("There is no keyword added with this paper , add atleast one keyword");
        return;
    }

    if(cid.length<20)
    {
        alert("There is no file attached make sure to attach a IPFS file system");
        return;
    }

    // keywords extraction in bytes32
    var bytes32array = splitTextForKeywords(keywords);
    console.log(bytes32array);

    // logging

    console.log("FUNCTION-C-CALL: uploadModifiedPaper ");
    console.log("PARAMETERS :"+modify_paper_id+ " - "+cid+" - "+title+" - "+bytes32array);
    console.log("WALLET ACCOUNT:"+userWallet);



    // contract call for upload file

    if(paperContractObj && web3)
    {
        paperContractObj.uploadModifiedPaper.sendTransaction(modify_paper_id,cid,title,bytes32array,{from:userWallet,gasPrice: web3.toWei(4.1, 'Gwei')},(err, result) => {

            if (result) {
                console.log("CALL SUCCESS: Modified existing paper on the network successfully, cid ="+cid);
                console.log("CALL ACHIEVE:"+ JSON.stringify(result));

                // show the transaction id on the form and hide rest of the document.
                onSuccessfulUpload(result,cid);

                var events = paperContractObj.submittedPaper({}, {fromBlock: 'latest', toBlock: 'pending'});
                // watch for changes
                events.watch(function (error, event) {
                    if (!error) {
                        events.stopWatching();
                        console.log("Old transaction: " + JSON.stringify(event));
                    } else { console.log("error in event: " + JSON.stringify(error)); }
                });
            }

            if(err)
            {
                console.log("ERROR : Unable to call uploadModifiedPaper" + JSON.stringify(result));
            }
        });
    }
    else
    {
        console.log("ERROR: Paper Contract is not Loaded");
    }

}


/**
 * splitTextForKeywords  This utility function gets the keywords texts all togather with the spaces and the split them and make each of them
 * converted to bytes32 data. It is important to convert any string data to byte32 which is a more reliable way to store string in the
 * smart contract.
 */
function splitTextForKeywords(str)
{
    var userWallet = $("#wallet").text();

    var words = str.split(" ");
    console.log(words);

    let byt32array = new Array();

    words.map((arg) =>  {
       // web3.toHex(arg);
        console.log(web3.toHex(arg));

        var hexval = web3.toHex(arg);

        if(hexval!=="0x0")
            byt32array.push(hexval);
    });

    console.log(byt32array);

    /*
    //test convert to hex
    console.log(web3.toHex(words[0]));

    //test convert back from hex to utf8
    console.log(web3.toUtf8(web3.toHex(words[0])));

    console.log(web3.toUtf8("0x46617268616e0000000000000000000000000000000000000000000000000000"));

    console.log(web3.fromAscii("Farhan"));
    */


    return byt32array;

}

/**
 * onSuccessfulUpload  This adjusted the congratulation screen with the transaction id , this calls when a successful file gets uploaded.
 */
function onSuccessfulUpload(tx,cid)
{
    $("#filesubmitForm").hide();
    $("#congratsMsg").text("Your paper is uploaded successfully on the existing paper, the transaction id is "+tx+ " <br> your document id is : "+cid );
    $("#congratsCid").text("Your paper Unique id is "+cid);

}

/**
 * @deprecated
 * getSubmittedPaperEvent  This is an unused function in future must be removed
 */
function getSubmittedPaperEvent(txresult) {
    // THIS EVENT IS GOOD IF YOU WANT TO TRACK NAME EVENT WITHOUT RECALLING IT AGAIN FROM THE FUNCTION
    // IT WILL START MONITORING TILL YOU DO NOT CALL events.stopWatching(); FUNCTION.
    var events = paperContractObj.submittedPaper({}, {fromBlock: 'latest', toBlock: 'pending'});
    // watch for changes
    events.watch(function (error, event) {
        if (!error) {

            if (event.transactionHash === txresult) {
                //  alert(event.args.name);
                console.log("W Correct transaction Transaction: " + JSON.stringify(event));
                events.stopWatching();
            } else {
                console.log("Old transaction: " + JSON.stringify(event));

                if ($("#latest-transaction-status").text() !== "Completed") {

                    console.debug("Initiating another try to get event ");

                    setTimeout(function () {
                        getNameEvent(txresult);
                    }, 5000);
                }
            }
        } else
            console.log("W Other transaction error: " + JSON.stringify(error));
    });
}


/**
 * GetParameterValues  This function used for getting the query string from the url and then return that value to the caller
 * @param param the key which must be searched inside url query string
 * @return string it returns the value from the key.
 */
function GetParameterValues(param) {
    var url = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for (var i = 0; i < url.length; i++) {
        var urlparam = url[i].split('=');
        if (urlparam[0] == param) {
            return urlparam[1];
        }
    }
}

/**
 * getPaperInfo  This function returns the paper related information from the paper smart contract associated with the paperid.
 * @param paperId The paperId
 * @return string it returns the value from the key.
 */
function getPaperInfo(paperId)
{
    // inputs for the contract from the form
    var userWallet = $("#wallet").text();
    var userRole =   $("#role").text();

    // logging
    console.log("FUNCTION-C-CALL: getPaperValues ");
    console.log("PARAMETERS : paperId");
    console.log("WALLET ACCOUNT:"+userWallet);

    // contract call to get paper info

    if(paperContractObj && web3)
    {

        paperContractObj.getPaperValues.call(paperId,{from:userWallet},(err, result) => {

            if (result) {
                console.log("CALL SUCCESS: paper data found");
                console.log("CALL ACHIEVE:"+ JSON.stringify(result));
                // add html based data
               // addListHtmlDivs(result,paperId);
                console.log(result);

                var keywords ="";
                result[5].forEach((keyword)=>keywords=web3.toUtf8(keyword)+" "+keywords);

                $("#keywords").val(keywords);
                $("#papertitle").val(result[0]);

            }

            if(err)
            {
                console.log("ERROR : Unable to call getAllPaperIds" + JSON.stringify(result));
            }
        });
    }
    else
    {
        console.log("ERROR: paper Contract is not Loaded");
    }
}
