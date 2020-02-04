/**
 * Decentralized Research Publishing Platform
 *
 *  @file review-page-web3.js file contains the java script based functions for the review.html page
 * it displays the papers waiting for review or submitted as final or rejected. This page also allows a reviewer
 * to assign himself as a reviewer for any paper and provide comments or notes along with a modified paper.
 *
 * Note:- The comment about single version of the paper will be overwritten by the reviewer if there are
 * multiple reviewers reviewing the same paper with same version. Hence this model does not reflect multiple
 * reviews as per the single version of the paper.
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

// this will contain the reviewer contract Object once it is loaded
let reviewerContractObj;

// user role
let userRole = -1;

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

        reviewerContractObj = web3.eth.contract(reviewerContractAbi).at(reviewerContractAddress);

        console.log("LOADED 1: Users Contract Address: --- "+userContractObj.address);
        console.log("LOADED 2: Papers Contract Address: --- "+paperContractObj.address);
        console.log("LOADED 3: Reviewer Contract Address: --- "+reviewerContractObj.address);


        web3.eth.getAccounts(console.log);

        console.log("Latest block: ");
        web3.eth.getBlockNumber(console.log);

        getCurrentUserInformation_contract ();
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
function getCurrentUserInformation_contract ()
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

                htmlBasedAlertsAndText(result);

                generateListHtmlBlocks(result);

            }

        });
    }
    else
    {
        console.log("ERROR: Unable to Load Contract and unable to call getCurrentUserInformation function");
    }

}


/**
 * htmlBasedAlertsAndText  display and adjusted user data like role , fullname etc on the html divs
 */
function htmlBasedAlertsAndText(result)
{

    if (result[1].length > 2)
    {
        $("#roleAlert").show();

        userRole = result[0];

        if(parseInt(result[0])===1)
        {
            $("#role").text("Reviewer");
            $("#roleAlert").hide();
        }
        else if (parseInt(result[0])===0) $("#role").text("Author");
        else  $("#role").text("Researcher");

        $("#fullname").text(result[1]);
    }
    else
    {
        userRole = -1;

        $("#fullname").text(result[1]);

        $('total_papers').text("0");

        $("#role").text("None Registered User");

        clearBlocks();

    }

}

/**
 * generateListHtmlBlocks  remove old list of papers and display all new and old papers togather
 * @param result contract's result array
 */
function generateListHtmlBlocks(result)
{
    if (result[1].length > 2)
    {
        clearBlocks();
        listAllLatestPapers();
    }
    else
    {
        clearBlocks();
    }
}

function clearBlocks()
{
    $("#list-paperblock").text("");
}

/**
 * listAllLatestPapers  this function list all the papers , first it queries all latest papers ids and then it requests their
 * associative values. In the end it display those information on the html divs sub function
 */
function listAllLatestPapers()
{
    if (window.web3 && userContractObj && paperContractObj)
    {
        const account = $("#wallet").text();
        console.log("FUNCTION-C-CALL: getAllPapersIds ");
        console.log("WALLET ACCOUNT:"+account);

        paperContractObj.getAllPapersIds({},{from:account},function (err, result) {

            if (err) {
                console.log("CALL-ERROR-REASON: "+JSON.stringify(err));
                console.log("REASON: Unable to retrieve latest Ids");
            }
            else
            {
                console.log("CALL-SUCCESS: "+JSON.stringify(result));
                console.log("CALL-ACHIEVE: Recieved current papers ids successfully");

                if(result.length>1)
                {
                    console.log("FUNCTION-C-CALL: getPaperValues ");

                    for (loop = 0; loop < result.length-1; loop++)
                    {
                        // make sure to use const otherwise due to async function this index value will be changed inside contract function call body
                        const index = result[loop];

                        console.log("loop: "+index);

                        console.log("FUNCTION-C-CALL: getPaperValues ");
                        console.log("PARAMETERS:"+result[loop]);

                             paperContractObj.getPaperValues(index, {from: account}, function (err, result2) {

                                console.log("loop: -" + index); //need to fix this part loop id not coming properly

                                if (err) {
                                    console.log("CALL-ERROR-REASON: " + JSON.stringify(err));
                                    console.log("REASON: Unable to retrieve Paper values by Ids");
                                } else {
                                    console.log("CALL-SUCCESS: " + JSON.stringify(result2));
                                    console.log("CALL-ACHIEVE: Recieved current papers values via ids successfully" + result[loop]);
                                    addListHtmlDivs(result2, index); //index supposed to be const (For a correct value)
                                }
                            });


                    }

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
 * addListHtmlDivs  this function list all the papers values in html format and divs
 * @param result the result from the contract function
 * @param _paperId the associated paper id
 */
function addListHtmlDivs(result,_paperId)
{

    var status= result[3];
    var classtype = "label-info";
    var fullname = $("#fullname").text();
    var wallet = $("#wallet").text();
    var cid = result[1];
    var paperId = _paperId;
    var reviewersArray = result[4];
    var reviewers ="NONE";
    var reviewerForm ="";
    var _paperVersion =result[6];
    var assignme_reviewer_button ="";

    if(status==0) { status="LATEST"; classtype = "label-info";}
    else if(status==1){status="REVIEWING";classtype = "label-warning";}
    else if(status==2){status="PASSED";classtype = "label-success";}
    else if(status==3){status="RESUBMIT";classtype = "label-primary";}
    else if(status==4){status="REJECTED";classtype = "label-danger";}
    else if(status==5){status="MODIFIED";classtype = "label-primary";}
    else {status="NONE";classtype = "label-info";}

    //alert(web3.toUtf8(result[5]));
    // console.log(web3.toUtf8(result[5][0]));

    //convert byte32 keywords back to normal utf
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

        // reviewer should have the operational options form till he does not pass the paper
        if(status!=="PASSED") {
            reviewerForm = generateReviewerForm(_paperId, _paperVersion);

        }
    }

    if(status!=="PASSED") {

        assignme_reviewer_button = "<button type='button' class='btn btn-default' onclick='assignedReviewerOfPaper(" + _paperId + ");'>Assign me as Reviewer</button>\n";
    }


    $("<div><h2>Paper Name: "+result[0]+"</h2>"+
        "<h5><span class=\"glyphicon glyphicon-book\"></span> Tags / Keywords:"+keywords+"</span> </h5>"+
        "<h5>Review Status <span class=\"label "+classtype+"\">"+status+"</span></h5>"+
        "<h5>Paper Id : <span class=\"label "+classtype+"\">"+_paperId+"</span></h5>"+

        "<h5>Download Link <a href='#' onclick='getFileFromIPFS(\""+cid+"\")'><span class=\"label label-primary\">Download Paper</span></a> " +
        "<h5>Revision Version: "+_paperVersion+"</span></h5>"+
        "<h5>Reviewers: "+reviewers+"</h5>"+
      //  "<h5>Author Name : "+fullname +"</span></h5>"+
      //  "<h5>Author AccountId : "+wallet+"</span></h5>"+
        assignme_reviewer_button+
        "<div id='remarks-'></div>"+
        "<p></p>"+
        reviewerForm+
        "</div><hr>").appendTo("#list-paperblock");


}


/**
 * assignedReviewerOfPaper  this function calls the reviewer smart contract and allow the calling user to add himself as a
 * reviewer for the associated paper id.
 *
 * @param _paperId the paper id
 */
function assignedReviewerOfPaper(_paperId) {

    if (userRole!=1) {
        alert(userRole+"You are not allowed to act like a reviewer, you have to registered as a reviewer to review any paper");
        return 0;
    }

    var confirmedRet = confirm("Are you sure you want to assign yourself as a reviewer?");

    if (confirmedRet) {
        if (window.web3 && userContractObj && paperContractObj) {
            const account = $("#wallet").text();
            console.log("FUNCTION-C-CALL: assignReviewerToPaper ");
            console.log("PARAMETER:_paperId - " + _paperId);
            console.log("WALLET ACCOUNT:" + account);

            paperContractObj.assignReviewerToPaper(_paperId, {from: account}, function (err, result) {

                if (err) {
                    console.log("CALL-ERROR-REASON: " + JSON.stringify(err));
                    console.log("REASON: Unable to assign reviewer on this paper");
                } else {
                    console.log("CALL-SUCCESS: " + JSON.stringify(result));
                    console.log("CALL-ACHIEVE: Store a new reviewer on this paper");
                    alert("You have assigned yourself to be a reviewer of this paper");
                    getCurrentUserInformation_contract();
                }

            });
        } else {
            console.log("ERROR: Unable to Load Contract and unable to call assignReviewToPaper function");
        }

    }
}

/**
 * generateReviewerForm  reviewer dynamic form in html string
 *
 * @param _paperId the paper id
 * @param _paperVersion the current paper version
 */

function generateReviewerForm(_paperId,_paperVersion)
{
    var htmlcodeFile =
        "<button data-toggle=\"collapse\" data-target=\"#operation_"+_paperId+"\">Operations</button>\n"+
        "<div id=\"operation_"+_paperId+"\" class=\"collapse\" style='background-color: #d4eaff;margin-left: 30px;'>" +
        "   <b>Upload remarks on the paper</b>\n" +
        "          <input  id='file_"+_paperId+"' style='width: min-content' onchange=\"uploadRemakrsFileOnIPFS(event);\" type=\"file\" accept=\".doc,.docx,.pdf\" class=\"form-control\"  placeholder=\"docfile\" required=\"required\" data-validation-required-message=\"Please select your document.\">\n" +
        "   <b>Comments</b><br>\n" +
        "          <textarea id='remarks_"+_paperId+"'></textarea><br>"+
        "   <b>Change Status</b><br>\n" +
        "          <select id='status_"+_paperId+"'><option value='3'>Resubmit </option> <option value='2'>Passed </option><option value='4'>Rejected </option>  </select>"+
        "   <br><br><button type='button' class='btn btn-default' onclick='submitReviewedContent("+_paperId+");'>Submit My Review</button>\n"+
        " <input type='hidden' value='"+_paperVersion+"' id='version_"+_paperId+"'>"+
        "</div>";

    return htmlcodeFile;

}


/**
 * uploadRemakrsFileOnIPFS  This function allows the reviewer to add his file on the IPFS. Once it is added using addIPFSDocFile
 * function it provides a unique CID from IPFS.
 *
 * @param event this event supposed to have file object
 */
function uploadRemakrsFileOnIPFS(event)
{
    if (userRole!=1) {
        alert("You are not allowed to act like a reviewer, you have to registered as a reviewer to use reviewer operation");
        return 0;
    }

    addIPFSDocFile(event);
}

/**
 * submitReviewedContent  This function allows the reviewer upload his comments and information about the authors paper
 * on the reviewer smart contract.
 *
 * @param _paperId paper Id
 */
function submitReviewedContent(_paperId)
{
    if (userRole!=1) {
        alert("You are not allowed to act like a reviewer, you have to registered as a reviewer to use reviewer operation");
        return 0;
    }

    var wallet = $("#wallet").text();
    var cid = ipfsId;
    var comments = $("#remarks_"+_paperId).val();
    var version = $("#version_"+_paperId).val();
    var status = $("#status_"+_paperId).val();
    var paperId = _paperId;

    console.log(" PaperID : "+paperId);
    console.log(" Comments : "+comments);
    console.log(" Version : "+version);
    console.log(" CID : "+cid);
    console.log(" Status : "+status);

    if (window.web3 && userContractObj && paperContractObj) {
        const account = $("#wallet").text();
        console.log("FUNCTION-C-CALL: addPaperReview ");
        console.log("PARAMETERS:");
        console.log(" PaperID : "+paperId);
        console.log(" Comments : "+comments);
        console.log(" Version : "+version);
        console.log(" CID : "+cid);
        console.log(" Status : "+status);
        console.log("WALLET ACCOUNT:" + account);

        reviewerContractObj.addPaperReview(_paperId,version,comments,cid,status, {from: account}, function (err, result) {

            if (err) {
                console.log("CALL-ERROR-REASON: " + JSON.stringify(err));
                console.log("REASON: Unable to upload reviewers remarks about the paper");
            } else {
                console.log("CALL-SUCCESS: " + JSON.stringify(result));
                console.log("CALL-ACHIEVE: Reviewer's comments and remakrs are recorded on the blockchain");

                reviewerContractObj.setPaperStatus(_paperId,status,{from: account}, function (err, result) {

                    if (err) {
                        console.log("CALL-ERROR-REASON: " + JSON.stringify(err));
                        console.log("REASON: Unable setPaperStatus about the paper");
                    } else {
                        console.log("CALL-SUCCESS: " + JSON.stringify(result));
                        console.log("CALL-ACHIEVE: Reviewer's setPaperStatus recorded on the blockchain");
                        getCurrentUserInformation_contract();
                    }
                });

            }

        });
    } else {
        console.log("ERROR: Unable to Load Contract and unable to call addPaperReview function");
    }
}