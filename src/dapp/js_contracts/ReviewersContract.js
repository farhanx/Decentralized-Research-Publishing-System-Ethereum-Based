/**
 * Decentralized Research Publishing Platform
 * @file ReviewersContract.js file contains the ABI and deployed address information of Reviewers Contract.
 * @author Farhan Hameed Khan <farhankhan@blockchainsfalcon.com> | <farhanhbk@hotmail.com>
 * @date 1-Feb-2020
 * @version 1.1.0
 * @link http://www.blockchainsfalcon.com
 */

// Make sure to add the correct deployed Reviewer contract address in the reviewerContractAddress variable
// If you are testing on Ganache or on Truffle console then make sure to update below address after deployment or installation on the network
// default reviewer ropsten contract address 0xD5b76d0826BD8473f44a4dBD9D6b8b570Df25Bb1
const reviewerContractAddress = "0xD5b76d0826BD8473f44a4dBD9D6b8b570Df25Bb1";//"0xfF836Ba11f58CD22c05E9e76696541aB23b1d0e4";

// Make sure to add the correct ABI information array of the deployed reviewer contract , you can try remix to get this ABI after compiling this contract on it.
const reviewerContractAbi = [
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "_userContractAddress",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "_paperContractAddress",
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
                "internalType": "uint32",
                "name": "versionid",
                "type": "uint32"
            },
            {
                "indexed": false,
                "internalType": "string",
                "name": "reviewdDocCid",
                "type": "string"
            }
        ],
        "name": "addReviewEvent",
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
                "internalType": "uint32",
                "name": "_version",
                "type": "uint32"
            },
            {
                "internalType": "string",
                "name": "_reviewerComments",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "_reviewerCid",
                "type": "string"
            },
            {
                "internalType": "uint256",
                "name": "_status",
                "type": "uint256"
            }
        ],
        "name": "addPaperReview",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "internalType": "bytes32",
                "name": "_keyword",
                "type": "bytes32"
            }
        ],
        "name": "addReviewerInterestedInKeyword",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [
            {
                "internalType": "bytes32",
                "name": "_keyword",
                "type": "bytes32"
            }
        ],
        "name": "getAllReviewerInterestedInKeyword",
        "outputs": [
            {
                "internalType": "address[]",
                "name": "reviewerArray",
                "type": "address[]"
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
                "internalType": "uint32",
                "name": "_paperid",
                "type": "uint32"
            },
            {
                "internalType": "uint32",
                "name": "_version",
                "type": "uint32"
            }
        ],
        "name": "getPaperReview",
        "outputs": [
            {
                "internalType": "string",
                "name": "_reviewercomments",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "_cid",
                "type": "string"
            },
            {
                "internalType": "address",
                "name": "_reviewer",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "status",
                "type": "uint256"
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
                "internalType": "bytes32",
                "name": "_keyword",
                "type": "bytes32"
            }
        ],
        "name": "isReviewerAlreadyAddedInKeywordList",
        "outputs": [
            {
                "internalType": "bool",
                "name": "isexist",
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
                "internalType": "uint256",
                "name": "_paperId",
                "type": "uint256"
            },
            {
                "internalType": "enum Papers.PaperStatus",
                "name": "_status",
                "type": "uint8"
            }
        ],
        "name": "setPaperStatus",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    }
];