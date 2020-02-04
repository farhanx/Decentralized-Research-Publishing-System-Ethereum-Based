/**
 * Decentralized Research Publishing Platform
 * @file login-page-initializer.js file contains the java script based functions for the login.html page
 * it handles all the registration and login methods. Also displaying dynamic data on the html page dives.
 * @author Farhan Hameed Khan <farhankhan@blockchainsfalcon.com> | <farhanhbk@hotmail.com>
 * @date 1-Feb-2020
 * @version 1.1.0
 * @link http://www.blockchainsfalcon.com
 */

// this will contain the User contract Object once it is loaded
let userContractObj;

// It holds the current wallet or account address string once it is loaded or changed
let _gCurrentWallet ="";

/**
 * @override
 * changeWalletAddress  A special overridden function to handle manual customization processes on changing wallet.
 * @param   accounts this contains the latest selected account.
 */
function changeWalletAddress(accounts)
{
    // change form value
    $("#wallet").val(accounts);
    _gCurrentWallet = accounts;
}

/**
 * @override
 * loadContractForThisPage  A special overridden function to handle manual customization processes when web3 gets initialize.
 */
function loadContractForThisPage() {

    $("#progress-div").hide();

    changeWalletAddress(web3.eth.defaultAccount);

    userContractObj = web3.eth.contract(userContractAbi).at(userContractAddress);

    console.log("LOADED: Contract Address: --- "+userContractObj.address);

    web3.eth.getAccounts(console.log);

    web3.eth.getBlockNumber(console.log);

    loadUserProfile();
}


/**
 * submitNewUser  This function helps in registring a new user on the blockchain smart contract by calling registerUser
 * smart contract function of Users contract.
 * @param   userRole caller user role e.g. researcher , author or reviewer
 * @param   username caller user name
 */
function submitNewUser(userRole,username)
{
    var userWallet = $("#wallet").val();

    console.log("FUNCTION-C-CALL: registerUser ");
    console.log("PARAMETERS :"+userRole+ " "+username);
    console.log("WALLET ACCOUNT:"+userWallet);

    $("#progress-div").show();
    $("#form_buttons").hide();

    userContractObj.registerUser.sendTransaction(userRole,username,{from:userWallet,gasPrice: web3.toWei(4.1, 'Gwei')},(err, result) =>
    {
        if(result)
        {
            $("#progress-div").hide();
            $("#form_buttons").show();

            console.log("CALL-SUCCESS: "+JSON.stringify(result));
            console.log("CALL-ACHIEVE: User registered successfully");

            alert("Account is successfully registered");

            showFullNameInputField(username,userRole,false);

        }

        if(err)
        {
            $("#progress-div").hide();
            $("#form_buttons").show();

            console.log("CALL-ERROR-REASON: "+JSON.stringify(err));
            console.log("REASON: Unable to registered successfully");
            alert("Unable to register this account");
        }



    });

}


/**
 * onSubmitForm  This function is used for adjusting names and role information the html page screen.
 */
function onSubmitForm()
{
    if($("#fullname").val().length > 1)
    {
        alert($("#fullname").val()+" --------- "+$("#role").val())

        submitNewUser($("#role").val(),$("#fullname").val())
    }
    else {
        alert("Make sure to enter full user name");
    }
}

/**
 * isUserExist_contract  This function gets calls to verify if a current active user is registered before or he is new user.
 * @return it return false if it does not find the user otherwise it returns the user related data in result object
 */
async function isUserExist_contract()
{
    console.log("FUNCTION-C-CALL: isUserExist ");
    var userWallet = $("#wallet").val();

   await userContractObj.isUserExist({from:userWallet,gasPrice: web3.toWei(4.1, 'Gwei')},function(err, result)
    {

        if(err)
        {
            console.log("CALL-ERROR-REASON: "+JSON.stringify(err));
            console.log("REASON: Unable to call isUserExist");
            return false;
        }
        else {

            if(result)
            {
                console.log("Current user :"+_gCurrentWallet+" is already registered: "+JSON.stringify(result));

            }
            else
            {
                console.log("Current user :"+_gCurrentWallet+" is not registered: "+JSON.stringify(result));

            }
            return result;
        }
    });

   // this is a testing function just to see if communication is working fine , in future it should be removed
    userContractObj.getMessageSender(function(err, result)
    {

        if(err)
        {

            console.log("message sender error"+JSON.stringify(err));
        }
        else
        {
            console.log("message sender error"+JSON.stringify(err));

        }

    });
}

/**
 * @override
 * getCurrentUserInformation_contract  This is a special overridden function which gets calls and return the active user information like role , name etc
 * on a successful call it sets the role , address and name. Which can be customized like here it is being set on the html tags
 * using sub function called showFullNameInputField
 */
function getCurrentUserInformation_contract()
{
    if (window.web3 && userContractObj) {
        const account = $("#wallet").val();
        userContractObj.getCurrentUserInformation({}, {from: account}, function (err, result) {

            if (err) {

                console.log("Error  " + JSON.stringify(err));
                console.log("Unable to call getCurrentUserInformation");

            } else {

                console.log("Current user information: " + JSON.stringify(result));

                if (result[1].length > 2)
                    showFullNameInputField(result[1], result[0], false);
                else
                    showFullNameInputField(result[1], result[0], true);
            }

        });
    }
    else
    {
        console.log("ERROR: Unable to Load User Contract and unable to call getCurrentUserInformation function");
    }

}

/**
 * getNumberofUsers_contract  This function  returns number of users and display in the java script console. A testing function.
 */
function getNumberofUsers_contract()
{
    userContractObj.getNumberofUsers(function(err, result)
    {

        if(err)
        {
            console.log(" Error "+JSON.stringify(err));
            console.log("Unable to call getNumberofUsers");
        }
        else
        {
            console.log("Total number of users retrieve from Contract : "+JSON.stringify(result));
        }

    });
}

/**
 * getTestingText_contract  This function is A testing function. In future it should be removed.
 */
function getTestingText_contract()
{
    userContractObj.getTestTxt(function(err, result)
    {

        if(err)
        {
            console.log(" Error "+JSON.stringify(err));
            console.log("Unable to call getTestTxt");
        }
        else
        {
            console.log("result getTestTxt : "+JSON.stringify(result));
        }

    });

    userContractObj.getandSetTestTxt("This is new test text",function(err, result)
    {

        if(err)
        {
            console.log(" Error "+JSON.stringify(err));
            console.log("Unable to call getandSetTestTxt");
        }
        else
        {
            console.log("result getandSetTestTxt : "+JSON.stringify(result));
        }

    });
}


/**
 * loadUserProfile  A single function that tests if the contract communication is fine , also it checks if the user exists in
 * the user contract. It retrieve the current information if active user is a already registered user in the smart contract
 */
async function loadUserProfile() {

    getTestingText_contract();

    await isUserExist_contract();

    getCurrentUserInformation_contract();

    getNumberofUsers_contract();

}

/**
 * onRefresh   A function that calls the sub function to retireve the user data.
 */
function onRefresh()
{
    getCurrentUserInformation_contract();

}


/**
 * showFullNameInputField   A function that calls the sub function to retireve the user data.
 * @param  name retrieved user name
 * @param  role retrieved user role
 * @param  reset a boolean just to referesh or clean the divs or inputs
 */
function showFullNameInputField(name,role,reset)
{
    if(!reset)
    {
        $("#fullname").val(name);
        $("#fullname").prop("readonly", true);
       // $("#role").val(role);//select(role);
        $( "#role option:selected" ).select(role);
        $("#role option[value='"+role+"']").prop('selected',true);


        $("#register").prop("disabled", true);
    }
    else
    {
        $("#fullname").prop("readonly", false);
        $("#fullname").val("");
        $("#register").prop("disabled", false);
    }
}