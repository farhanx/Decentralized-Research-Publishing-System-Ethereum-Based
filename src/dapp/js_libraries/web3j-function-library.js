/**
 * Decentralized Research Publishing Platform
 * @file web3j-function-library.js file contains the WEB3 based functions, configuration and helper process.
 * @author Farhan Hameed Khan <farhankhan@blockchainsfalcon.com> | <farhanhbk@hotmail.com>
 * @date 1-Feb-2020
 * @version 1.1.0
 * @link http://www.blockchainsfalcon.com
 */

// the current account detected from the metamask must be stored in this variable
let currentAccount = null;

// This function will be called when your page will load
// make sure to override a function named loadContractForThisPage() in your page's javascript file
// *** loadContractForThisPage : It will load your necessary stuff for your page where you would call it

/**
 * window.addEventListener Load all the required functions and variables on the html page load  for the web3 based programming.
 * It detects if web3 ethereum plugin is available from the metamask. Make sure you have already installed metamask before using
 * this method.
 */
window.addEventListener('load', async () =>
{
    console.log("EVENT: Windows Loading :");

    // We can use directly ethereum object without window.ethereum as well but on chrome using direct ethereum might not alert user with our condition
    if(!window.ethereum || !ethereum.isMetaMask)
    {
        alert(" Your browser does not support WEB3 , download MetaMask to use this DAPP");
        console.log('Non-Ethereum browser detected. You should consider trying MetaMask!');
        throw new Error("Please install MetaMask to use this DAPP");
    }

    // ethereum object exists
    if (window.ethereum)
    {
        // initialize web3 object
        window.web3 = new Web3(ethereum);
        try
        {
            // Request account access if needed

            const accounts = await ethereum.send('eth_requestAccounts');

            console.log(web3);

            console.log("LOADED: Web3");

            loadContractForThisPage(); // this supposed to be defined as per page requirement e.g. contracts

           // ethereum.on("accountsChanged",handleAccountsChanged);
            ethereum.autoRefreshOnNetworkChange = false;
        }
        catch (error)
        {
            if (error.code === 4001) { // EIP 1193 userRejectedRequest error
                console.log('Please connect to MetaMask.');
                alert('Please connect to MetaMask.');
            } else {
                console.error(error)
                alert("Denied access : User denied account access"+ error);

            }
        }
    }

});

// This function will be called when your page will recieve a notification of wallet change
// on this change your page must have a function overridden
// *** changeWalletAddress  : which will recieve the account address
// *** getCurrentUserInformation_contract(); : which will be used to recieve user info and your own algos


/**
 * handleAccountsChanged :  This function handles the account changes activities. It gets the new account information and set it
 * to the html divs or tags using function "changeWalletAddress". This function also calls the releavent information of the user
 * by calling function "getCurrentUserInformation_contract". The getCurrentUserInformation_contract must be overridden by the
 * caller. So when a new account arrive the overriden function will be called according to the user customized way.
 * @param  accounts This supposed to have the selected new account from the metamask
 */
function handleAccountsChanged(accounts)
{

    console.log("EVENT: HANDLE ACCOUNT CHANGED");

    if(accounts.length ===0) console.log("Please connect metamask");
    else if(accounts[0]!== currentAccount) currentAccount = accounts[0];

    console.log("CURRENT ACCOUNT: "+currentAccount);

    changeWalletAddress(currentAccount);

    if (window.web3 && userContractObj) {

        getCurrentUserInformation_contract();
    }

}//);


/**
 * onConnectAccount :  To test if Metamask is correctly working within the browser
 */
function onConnectAccount()
{

    ethereum.send("eth_requestAccounts").then(handleAccountsChanged).catch(err=>{
        if (err.code === 4001) { // EIP 1193 userRejectedRequest error
            console.log('Please connect to MetaMask.');
            alert('Please connect to MetaMask.');
        } else {
            console.error(err)
            alert("Denied access : User denied account access"+ error);
        }
    });
}


/**
 * ethereum.on('accountsChanged') :  Event based function that fires automatically when a account gets changed in the metamask
 * by the user. So selecting any new account will fire this function and then a sub function "handleAccountsChanged" gets called to
 * handle new account activities.
 */
ethereum.on('accountsChanged', function (accounts) {
    // Time to reload your interface with accounts[0]!
    handleAccountsChanged(accounts);
});
