/**
 * Decentralized Research Publishing Platform
 * @file PapersContract.js file contains the ABI and deployed address information of Paper Contract.
 * @author Farhan Hameed Khan <farhankhan@blockchainsfalcon.com> | <farhanhbk@hotmail.com>
 * @date 1-Feb-2020
 * @version 1.1.0
 * @link http://www.blockchainsfalcon.com
 */

// Make sure to add the correct deployed Paper contract address in the paperContractAddress variable
// If you are testing on Ganache or on Truffle console then make sure to update below address after deployment or installation on the network
// default ropsten paper contract address: 0x25eB70618843351d7be79AEdE1D6F4653dA870c6
const paperContractAddress = "0x25eB70618843351d7be79AEdE1D6F4653dA870c6";//"0x2194805B028888844E8509C2d8A6b628050A570a";

// Make sure to add the correct ABI information array of the deployed paper contract , you can try remix to get this ABI after compiling this contract on it.
const paperContractAbi =[
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "_authorContractAddress",
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
                "internalType": "uint256",
                "name": "paperid",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "address",
                "name": "useraccount",
                "type": "address"
            }
        ],
        "name": "assignedReviewerEvent",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "uint32",
                "name": "paperid",
                "type": "uint32"
            },
            {
                "indexed": false,
                "internalType": "address",
                "name": "useraccount",
                "type": "address"
            }
        ],
        "name": "submittedPaper",
        "type": "event"
    },
    {
        "constant": false,
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_paperId",
                "type": "uint256"
            }
        ],
        "name": "assignReviewerToPaper",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "getAllLatestPapersIds",
        "outputs": [
            {
                "internalType": "uint256[]",
                "name": "ids",
                "type": "uint256[]"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "getAllPapersIds",
        "outputs": [
            {
                "internalType": "uint256[]",
                "name": "ids",
                "type": "uint256[]"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "getBytes32Test",
        "outputs": [
            {
                "internalType": "bytes32",
                "name": "",
                "type": "bytes32"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "getLatestId",
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
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_paperId",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "keywordIndex",
                "type": "uint256"
            }
        ],
        "name": "getPaperKeyword",
        "outputs": [
            {
                "internalType": "bytes32",
                "name": "",
                "type": "bytes32"
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
                "internalType": "uint256",
                "name": "_paperId",
                "type": "uint256"
            }
        ],
        "name": "getPaperValues",
        "outputs": [
            {
                "internalType": "string",
                "name": "title",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "ipfscid",
                "type": "string"
            },
            {
                "internalType": "address",
                "name": "author",
                "type": "address"
            },
            {
                "internalType": "enum Papers.PaperStatus",
                "name": "status",
                "type": "uint8"
            },
            {
                "internalType": "address[]",
                "name": "reviewers",
                "type": "address[]"
            },
            {
                "internalType": "bytes32[]",
                "name": "keywords",
                "type": "bytes32[]"
            },
            {
                "internalType": "uint256",
                "name": "version",
                "type": "uint256"
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
                "internalType": "bytes32",
                "name": "para1",
                "type": "bytes32"
            }
        ],
        "name": "getSetBytes32Test",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_paperId",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "version_number",
                "type": "uint256"
            }
        ],
        "name": "getVersionHistory",
        "outputs": [
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            },
            {
                "internalType": "enum Papers.PaperStatus",
                "name": "",
                "type": "uint8"
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
                "internalType": "uint256",
                "name": "_paperId",
                "type": "uint256"
            }
        ],
        "name": "isPaperExist",
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
    },
    {
        "constant": true,
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_paperId",
                "type": "uint256"
            }
        ],
        "name": "isReviewerAlreadyAssigned",
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
        "name": "setPaperStatusByReviewer",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "internalType": "uint32",
                "name": "_paper_id",
                "type": "uint32"
            },
            {
                "internalType": "string",
                "name": "_ipfs",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "_title",
                "type": "string"
            },
            {
                "internalType": "bytes32[]",
                "name": "_keywords",
                "type": "bytes32[]"
            }
        ],
        "name": "uploadModifiedPaper",
        "outputs": [
            {
                "internalType": "uint32",
                "name": "",
                "type": "uint32"
            }
        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "internalType": "string",
                "name": "_ipfs",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "_title",
                "type": "string"
            },
            {
                "internalType": "bytes32[]",
                "name": "_keywords",
                "type": "bytes32[]"
            }
        ],
        "name": "uploadNewPaper",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    }
];
