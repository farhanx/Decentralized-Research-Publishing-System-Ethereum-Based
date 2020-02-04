/**
 * Decentralized Research Publishing Platform
 * @file UsersContract.js file contains the ABI and deployed address information of Users Contract.
 * @author Farhan Hameed Khan <farhankhan@blockchainsfalcon.com> | <farhanhbk@hotmail.com>
 * @date 1-Feb-2020
 * @version 1.1.0
 * @link http://www.blockchainsfalcon.com
 */

// Make sure to add the correct deployed Users contract address in the userContractAddress variable
// If you are testing on Ganache or on Truffle console then make sure to update below address after deployment or installation on the network
// default ropsten contract address : 0x22000B9df525ee6BDdBc2E79F01f79F5A6414B1C
const userContractAddress = "0x22000B9df525ee6BDdBc2E79F01f79F5A6414B1C";//"0x6436fb83BC18b5a165db4F067327F95f473bbf28";

// Make sure to add the correct ABI information array of the deployed user contract , you can try remix to get this ABI after compiling this contract on it.
const userContractAbi =[
    {
        "inputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "getCurrentUserInformation",
        "outputs": [
            {
                "internalType": "enum Users.Roles",
                "name": "role",
                "type": "uint8"
            },
            {
                "internalType": "string",
                "name": "fullname",
                "type": "string"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "getMessageSender",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "getNumberofUsers",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "getTestTxt",
        "outputs": [
            {
                "internalType": "string",
                "name": "testString",
                "type": "string"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [
            {
                "internalType": "string",
                "name": "val",
                "type": "string"
            }
        ],
        "name": "getandSetTestTxt",
        "outputs": [
            {
                "internalType": "string",
                "name": "testString",
                "type": "string"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "isUserExist",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "isUserExist_SmartCall",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "internalType": "enum Users.Roles",
                "name": "_role",
                "type": "uint8"
            },
            {
                "internalType": "string",
                "name": "_username",
                "type": "string"
            }
        ],
        "name": "registerUser",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    }
];