/**
 * Decentralized Research Publishing Platform
 *
 *  @file list-page-web3.js file contains the java script based functions for the list.html page
 * it display all the papers which were submmited by the users. It also includes the dynamic display and removal of
 * the data based on the active user. So if a user has uploaded papers on the contract then he could see on the iist page.
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

// this will contain the author contract Object once it is loaded
let authorContractObj;

// this will contain the reviewer contract Object once it is loaded
let reviewerContractObj;

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

    if (window.web3)
    {
        changeWalletAddress(web3.eth.defaultAccount);

        // loaded user contract
        userContractObj = web3.eth.contract(userContractAbi).at(userContractAddress);

        // loaded paper contract
        paperContractObj = web3.eth.contract(paperContractAbi).at(paperContractAddress);

        // loaded author contract

        authorContractObj = web3.eth.contract(authorContractAbi).at(authorContractAddress);

        // loaded reviewer contract

        reviewerContractObj = web3.eth.contract(reviewerContractAbi).at(reviewerContractAddress);

        console.log("LOADED 1: Users Contract Address: --- "+userContractObj.address);
        console.log("LOADED 2: Papers Contract Address: --- "+paperContractObj.address);
        console.log("LOADED 3: Author Contract Address: --- "+authorContractObj.address);
        console.log("LOADED 4: Reviewer Contract Address: --- "+reviewerContractObj.address);



        web3.eth.getAccounts(console.log);

        console.log("Latest block: ");
        web3.eth.getBlockNumber(console.log);

        getCurrentUserInformation_contract();
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

            }
            else
            {
                console.log("Current user information: " + JSON.stringify(result));

                if (result[1].length > 2)
                {
                    if(parseInt(result[0])===0) $("#role").text("Author");
                    else if (parseInt(result[0])===1) $("#role").text("Reviewer");
                    else  $("#role").text("Researcher");

                    $("#fullname").text(result[1]);

                    listAllPapers();

                }
                else
                {
                    $("#fullname").text(result[1]);

                    $('total_papers').text("0");

                    $("#role").text("None Registered User");

                    clearBlocks();

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
 * listAllPapers  This function retrieve all the existing papers ids on the blockchain for the active user. On a succesful call
 * it calls the sub function addPaperListBlock to create html based divs for each paper. Which will call another smart contract
 * function; then it will display title and other info.
 * informations.
 */
function listAllPapers()
{
    // inputs for the contract from the form
    var userWallet = $("#wallet").text();
    var userRole =   $("#role").text();

    // logging
    console.log("FUNCTION-C-CALL: getAllPaperIds ");
    console.log("PARAMETERS : None");
    console.log("WALLET ACCOUNT:"+userWallet);

    // contract call for upload file

    if(authorContractObj && web3)
    {
        authorContractObj.getAllPaperIds.call({},{from:userWallet},(err, result) => {

            if (result) {
                console.log("CALL SUCCESS: number of paper found");
                console.log("CALL ACHIEVE:"+ JSON.stringify(result));

                var papersIdsArray = result;
                addPaperListBlocks(papersIdsArray);
            }

            if(err)
            {
                console.log("ERROR : Unable to call getAllPaperIds" + JSON.stringify(result));
            }
        });
    }
    else
    {
        console.log("ERROR: author Contract is not Loaded");
    }

}

function clearBlocks()
{
    $("#list-paperblock").text("");
}

/**
 * addPaperListBlocks   This function loop through all the paper ids and one by one get the associated paper information
 * by calling sub function getPaperInfo()
 *
 * @param papersIdsArray This array contains all the paper ids of the active users
 */
function addPaperListBlocks(papersIdsArray)
{

    // looping
    // papersIdsArray.forEach((paperid)=>console.log(paperid.c[0]));
    // users.forEach((user)=>console.log(user.id,user.name));

    // remove all children blocks
    clearBlocks();

    // add new blocks
    for(let id of papersIdsArray){
        console.log("Paper extraction: "+id);
        getPaperInfo(id);
    }

    $("#total_papers").text(papersIdsArray.length);
}

/**
 * getPaperInfo   This function retrieve the associated information of the given paper id, and adjusted this information using
 * a sub function called addListHtmlDivs.
 *
 * @param paperId This is a paper id
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
                addListHtmlDivs(result,paperId);
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


/**
 * addListHtmlDivs   This function design the html tags to display the retrieved paper data associated with the paperid.
 *
 * @param result array of returned data from the paper smart contract
 * @param _paperId the associated paper id
 */

function addListHtmlDivs(result,_paperId)
{

    var status= result[3];
    var classtype = "label-info";
    var fullname = $("#fullname").text();
    var wallet = $("#wallet").text();
    var cid = result[1];
    var reviewersArray = result[4];
    var reviewers ="NONE";
    var reviewerForm ="";
    var _paperVersion =result[6];


    if(status==0) { status="LATEST"; classtype = "label-info";}
    else if(status==1){status="REVIEWING";classtype = "label-warning";}
    else if(status==2){status="PASSED";classtype = "label-success";}
    else if(status==3){status="RESUBMIT";classtype = "label-primary";}
    else if(status==4){status="REJECTED";classtype = "label-danger";}
    else if(status==5){status="MODIFIED";classtype = "label-primary";}
    else {status="NONE";classtype = "label-info";}


    //convert byte32 keywords back to normal utf
    console.log("Encoded Keywords:");
    console.log(result[5]);

    var keywords ="";
    result[5].forEach((keyword)=>keywords=keywords+" "+web3.toUtf8(keyword));

    // display reviewers assigned on this paper
    if(reviewersArray.length>0)
    {
        reviewers ="";
        index = 1;
        for(let id of reviewersArray){
            console.log("Reviewers assigned: "+id);
            if(wallet==id) {reviewers += "<br>"+index+") "+fullname+" ";}
            else {
                reviewers += "<br>"+index+") "+id;
            }
            index++;
        }

    }

    generatePaperHtmlCode(_paperId,result,_paperVersion,status,keywords,fullname,wallet,reviewers,classtype,cid,reviewersArray);
}


/**
 * onSuccessfulUpload   This function adjust the successful transaction id and ipfs document hash on the screen through html
 *
 * @param tx transaction hash from the blockchain
 * @param cid the associated document hash of the ipfs
 */
function onSuccessfulUpload(tx,cid)
{
    $("#filesubmitForm").hide();
    $("#congratsMsg").text("Your paper is uploaded successfully, the transaction id is "+tx+ " <br> your document id is : "+cid );
    $("#congratsCid").text("Your paper Unique id is "+cid);

}

/**
 * getSubmittedPaperEvent   This function monitors the submitted paper transaction event in smart contract. Currently it is notbeong used.
 *
 * @param txresult transaction hash
 */

function getSubmittedPaperEvent(txresult) {

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
 * getPaperReview   This function retrieve the reviewers addresses from the smart contract which are associated with the paper Id.
 *
 * @param _paperId Paper id
 * @param _paperVersion the version paper.
 */
function getPaperReview(_paperId,_paperVersion)
{
    if (window.web3 && userContractObj && reviewerContractObj) {
        const account = $("#wallet").text();
        console.log("FUNCTION-C-CALL: getPaperReview ");
        console.log("PARAMETERS:");
        console.log(" PaperID : "+_paperId);
        console.log(" Version : "+_paperVersion);
        console.log("WALLET ACCOUNT:" + account);

         reviewerContractObj.getPaperReview(_paperId,_paperVersion,{from: account}, function (err, result) {

            if (err) {
                console.log("CALL-ERROR-REASON: " + JSON.stringify(err));
                console.log("REASON: Unable to retrieve reviewers remarks about the paper");
            } else {
                console.log("CALL-SUCCESS: " + JSON.stringify(result));
                console.log("CALL-ACHIEVE: Successfully retrieve remarks about the paper");
                //getCurrentUserInformation_contract();
                generateReviewHtmlCode(result,_paperId,_paperVersion);
            }

        });
    } else {
        console.log("ERROR: Unable to Load Contract and unable to call addPaperReview function");
    }

    return "";
}


/**
 * generatePaperHtmlCode   This function adjust the retrieved attributes from the paper contract associated with the paperid.
 *
 * @param _paperId      Paper id
 * @param result        result array from paper smart contract
 * @param _paperVersion the version paper.
 * @param status        status of the paper e.g. resubmit, reviewing etc.
 * @param keywords      Keywords strings of the associated papers
 * @param fullname      Full name of the paper
 * @param wallet        Author wallet or address
 * @param reviewers     Array of reviewer addresses (assigned ones)
 * @param classtype     CSS stylesheet for label
 * @param cid           Paper document hash on the IPFS
 * @param reviewersArray  reviewers array
 */
function generatePaperHtmlCode(_paperId,result,_paperVersion,status,keywords,fullname,wallet,reviewers,classtype,cid,reviewersArray)
{
    // HTML code to display

    modify_link ="";

    if(status!=="PASSED") modify_link = "<a class=\"label label-info\"  href=\"modify.html?modify="+_paperId+"\">Modify Paper</a></h5>";

    $("<div><h2>Paper Name: "+result[0]+"</h2>"+
        "<h5><span class=\"glyphicon glyphicon-book\"></span> Tags / Keywords:"+keywords+"</span> </h5>"+
        "<h5>Review Status <span class=\"label "+classtype+"\">"+status+"</span></h5>"+
        "<h5>Download Link <a href='#' onclick='getFileFromIPFS(\""+cid+"\")'><span class=\"label label-primary\">Download Paper</span></a> " +
        modify_link+
        "<h5>Revision Version: "+_paperVersion+"</span></h5>"+
        "<h5>Author Name : "+fullname +"</span></h5>"+
        "<h5>Author AccountId : "+wallet+"</span></h5>"+
        "<h5>Reviewers: "+reviewers+"</h5>"+
        "<p></p>"+
        "<div id='paper-review-"+_paperId+"'></div>"+
      //  generateModifyForm(_paperId)+
        "</div><hr>").appendTo("#list-paperblock");

    if(reviewersArray.length>0) {

        //if paper version is greater than 0 then recursively retrieve all version's reviewing histories
        for(loop=_paperVersion;loop>=0;loop--) {
            getPaperReview(_paperId, loop);
        }
    }
}



/**
 * generateReviewHtmlCode   This function adjust the retrieved reviewers attributes in a from the reviewers contract associated with the paperid.
 *
 * @param result        result array from paper smart contract
 * @param _paperVersion the version paper.
 * @param _paperId      Paper id
 */

function generateReviewHtmlCode(result,_paperId,_paperVersion) {

    var reviewerAddress = result[2];
    var cid = result[1];
    var comments = result[0];
    var downloadlink =" No Review Recieved on this version"; //default text


    if(comments.length<=0)  comments ="None";

    if(cid.length>8) downloadlink = "<a href='#' onclick='getFileFromIPFS(\""+cid+"\")'><span class=\"label label-primary\">Download Paper</span></a> ";

    var htmlcodeFile =
        "<button data-toggle=\"collapse\" data-target=\"#operation_"+_paperId+"_"+_paperVersion+"\">Remarks Ver:"+_paperVersion+"</button>\n"+
        "<div id=\"operation_"+_paperId+"_"+_paperVersion+"\" class=\"collapse\" style='background-color: #d4eaff;margin-left: 30px;'>" +
        "<b>Download Link</b> : "+downloadlink+"<br>" +
        "   <b>Revision Version</b> : <span class=\"label label-primary\"> "+_paperVersion+"</span><br>\n" +
        "   <b>Comments</b><br>\n" +
        "          "+comments+" <br>"+
        "   <b>Reviewer</b><br>\n" +
        "   "+reviewerAddress+"<br>"+
        "</div>";

    $(htmlcodeFile).appendTo("#paper-review-"+_paperId);
}



/**
 * @deprecated
 * generateModifyForm   This function adjust the modify form
 * @param _paperId      Paper id
 */

function generateModifyForm(_paperId)
{
    var htmlcodeFile =
        "<a data-toggle=\"collapse\" data-target=\"#modify_"+_paperId+"\" href='#'>Operations</a>\n"+
        "<div id=\"modify_"+_paperId+"\" class=\"collapse\" style='background-color: #d4eaff;margin-left: 30px;'>" +
        "   <b>Upload remarks on the paper</b>\n" +
        "          <input  id='file_"+_paperId+"' style='width: min-content' onchange=\"uploadRemakrsFileOnIPFS(event);\" type=\"file\" accept=\".doc,.docx,.pdf\" class=\"form-control\"  placeholder=\"docfile\" required=\"required\" data-validation-required-message=\"Please select your document.\">\n" +
        "   <b>Comments</b><br>\n" +
        "          <textarea id='remarks_"+_paperId+"'></textarea><br>"+
        "   <b>Change Status</b><br>\n" +
        "          <select id='status_"+_paperId+"'> <option value='1'>Reviewing</option><option value='2'>Passed </option><option value='3'>Resubmit </option> <option value='4'>Rejected </option>  </select>"+
        "   <br><br><button type='button' class='btn btn-default' onclick='submitReviewedContent("+_paperId+");'>Submit My Review</button>\n"+
        " <input type='hidden' value='"+2+"' id='version_"+_paperId+"'>"+
        "</div>";

    return htmlcodeFile;

}