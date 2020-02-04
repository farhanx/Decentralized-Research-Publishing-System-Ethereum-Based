/**
 * Decentralized Research Publishing Platform
 * @file AuthorsContract.js file contains the ABI and deployed address information of Author Contract.
 * @author Farhan Hameed Khan <farhankhan@blockchainsfalcon.com> | <farhanhbk@hotmail.com>
 * @date 1-Feb-2020
 * @version 1.1.0
 * @link http://www.blockchainsfalcon.com
 */

// Make sure to add the correct deployed author contract address in the authorContractAddress variable
// If you are testing on Ganache or on Truffle console then make sure to update below address after deployment or installation on the network
// default ropsten author contract address: 0x0d8cdF89490e494dCeE96C023eb90Bd558d78f52
const authorContractAddress = "0x0d8cdF89490e494dCeE96C023eb90Bd558d78f52";//"0x048853E4d014159812FE79DCdf133bB9ECE6855A";

// Make sure to add the correct ABI information array of the deployed author contract , you can try remix to get this ABI after compiling this contract on it.
const authorContractAbi =[
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "_userContractaddress",
                "type": "address"
            }
        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "uint32",
                "name": "paperId",
                "type": "uint32"
            },
            {
                "indexed": false,
                "internalType": "address",
                "name": "authorId",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "address",
                "name": "paperContractId",
                "type": "address"
            }
        ],
        "name": "addPaper",
        "type": "event"
    },
    {
        "constant": false,
        "inputs": [
            {
                "internalType": "uint32",
                "name": "_paperid",
                "type": "uint32"
            },
            {
                "internalType": "address",
                "name": "_authorAddress",
                "type": "address"
            }
        ],
        "name": "addPaperInUserFolder",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "getAllPaperIds",
        "outputs": [
            {
                "internalType": "uint32[]",
                "name": "_paperIds",
                "type": "uint32[]"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "getNumUsers",
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
        "name": "verifyUser",
        "outputs": [
            {
                "internalType": "bool",
                "name": "ret",
                "type": "bool"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    }
];