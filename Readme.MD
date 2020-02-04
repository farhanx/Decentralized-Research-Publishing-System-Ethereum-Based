### **Decentralized Research Publishing Platform**

The purpose of this project is to demonstrate how a 100% decentralized platform can be independently established and run 
without any central body which controls the publishing processes. The idea is to introduce an autonomous organization 
which will allow researcher and scientific community to collaborate without depending on the intermedeiaries. 
Therefore, the Ethereum public blockchain network is used in this project and developed a login system with the simple 
registration process for researchers, reviewers, and authors.  


For this close collaboration between researchers, authors and reviewers required certain processes and rules. Hence, four 
different smart contracts are written to compensate for each role and its operation. The reviewer can review any paper 
which he will assign for himself. Similarly, an author can upload his paper for review based on the interesting keywords
which will define his paper's subject or domain. The IPFS (Inter-planetary file system) is used for storing files, and 
their hashed CIDs are referenced back in the smart contract. 

A reviewer can assign himself on any paper, and then he can upload his remarks, comments, and edited file. His remarked 
or edited file also sent on the IPFS, and it file hash stored under the smart contract. He can put select any status 
based on his reviewing like rejection, resubmit, or passed. 

When an author receives the reviewer's comment like resubmit, then he will modify the paper and upload the new version 
on the platform. All the paper versions and their histories are maintained on the smart contracts. This immutability of 
data will help anyone to trace back all reviewed information and versions concerning the 
particular paper.

So each paper can have multiple versions on the blockchain, with their respective statuses and reviewed information by 
the reviewers. Multiple reviewers can assign themselves to a single paper Version as well to review its content. 
However, there will only be single reviewed information stored against the paper's version. Otherwise, a new review on 
the same version will be overwritten.  


##### **Pre-Requisites**

Minimum requirement to run this code.

1 - Nodejs version 8.11.3

2 - NPM version 5.6.0

3 - Webpack 4.41.2

4 - Truffle v5.0.8 (core: 5.0.8)

5 - Solidity v0.5.0 (solc-js)

6 - Web3.js v1.0.0-beta.37

7 - ipfs version 0.4.21

8 - Ganache v2.1.0

9 - Metamask v7.7.3  


##### **How to install and Run DAPP (Decentralized Application)**

Step 0: Install Nodejs, npm, truffle, Ipfs , Ganache and Metamask plugin on chrome browser or install brave browser. 


Step 1: Download the code , it will show two main directories inside src directory 
  
  a) dapp : this is the decentralized application  
  
  b) truffle : this contains all the smart contract and blockchain migration code
  
  
Step 2 : Go to dapp directory using command prompt and install webpack 

    npm install webpack webpack-cli webpack-dev-server --save-dev

Step 3: Now on the command prompt run the node server 

    npx webpack-dev-server --https

Step 4: Now go to the url (make sure to add HTTPS not HTTP)

    https://localhost:8080

Step 5: On visiting this url you will see a picture on the bottom with text "IPFS running successfully". Otherwise a notification
will come that IPFS is not working. Now dapp is installed properly but we have to run the IPFS and the network.


##### **Connecting DAPP with the IPFS (Decentralized Application)**

Step 0: Now go to the .ipfs directory  (For Windows OS: Users/CurrentUser/) 

Step 1: Open the config file and change the gateway port to 8010 (This is important because default port is 8080 for IPFS 
whereas we are using 8080 for DAPP. Therefore it is important to change the gateway port to something else otherwise one of them will not work)

     "Gateway": "/ip4/127.0.0.1/tcp/8010",
     
     
Step 2: We also need to IPFS API access to our local. Therefore, in the same config file add the below code

    "API": {
        "HTTPHeaders": {
          "Access-Control-Allow-Origin": [
            "https://localhost:8080"
          ]
        }
      }, 
      
or you can use the below command and it will automatically write itself

     > ipfs config --json API.HTTPHeaders.Access-Control-Allow-Origin "[\"https://localhost:8080\"]"
          

Step 3: Go to the the command prompt and now run IPFS daemon. 


Now your dapp is successfully installed and running with the ipfs, you can now refresh the page and go to registration page. 
This time you will not face any IPFS related error. 


##### **Connecting DAPP with the Live Ropsten Ethereum Network**

For the ropsten network, I have already deployed my smart contracts. Therefore, the default smart contracts addresses are 
being used inside js_contracts libraries. 

`Note:- If you are going to use ropsten network then you have referesh pages manually after any state changes or transaction.
In future, this will automatically detect the transactions.`

Step 0: Go to your brave browser or chrome browser and login to the MetaMask.


Step 1: On the Metamask , select network "ropsten" which is an ethereum testing network. 


Step 2: Now browse the DAPP URL 

    https://localhost:8080

Step 3: It will request you to connect Decentralized Research Publishing Platform with MetaMask, confirm it.


Step 4: Now you are ready connected with the live ropsten network.


Step 5: Refresh the page and register your ropsten account (If your account is already registered by someone then try create a new account on the metamask
before using this. Since Ropsten is a testing network so ganache or truffle default testing accounts might be tested by someone else on this platform)  

Congratulations! Your DAPP is now working and connected directly with the Ethereum network without any intermediary or 
centralized entity, hosting, or backend. You are directly connected from your browser using DAPP instance running on your 
computer and connected to the smart contracts. This is the concept of the Web3, where the application is not dependent on 
the third party.


##### **Connecting DAPP with the local Ganache Network**

Step 0: Go to the truffle directory through the command prompt.

Step 1: Make sure to run Ganache.

Step 2: Now connect through truffle on the ganache. (I already mentioned port and url related ganache isnide truffle-config.js)

    truffle console --network ganache

Step 3: Now migrate (compile and deploy) all the contracts on ganache network.

    migrate --network ganache --reset 

Step 4: Now one by one get the latest address of each contract and put the address in their respective JS file. For instance 

    Authors.address
    
This will display latest deployed address on the ganache. Copy the address and paste it inside /dapp/js_contract/AuthorsContract.js

    const authorContractAddress = "0x048853E4d014159812FE79DCdf133bB9ECE6855A";

Step 5: Follow the same step 4 for Papers, Reviewers and Users contract. Copy/Paste their addresses in their respective js files.


Congratulations! Now you have local version which you can use without ropsten issues.
 


##### **(OPTIONAL) Some Technical Notes**

If you are using CDN files directly in your client app and you would like to use IPFS functionality then might get error 403 

so it is better before running ipfs daemon use the config command and set the cors domain as this

` > ipfs config --json API.HTTPHeaders.Access-Control-Allow-Origin "[\"https://localhost:80\"]"
`
Here https://localhost:8080\ is the DAPP which needs the access to the ipfs API. 


**Get your file from IPFS using local daemon hash** 

http://localhost:8010/ipfs/[your CID] 

http://localhost:8010/ipfs/QmbZpqDWrS1DANritmkhAgjAKswwRStGaJwtNVbDaSc2mk


**if you want to store only hash of the file**
ipfs add --only-hash <ipfs-path>
https://docs.ipfs.io/reference/api/cli/


Trouble shooting:
If your metamask does not work properly after retsrating the ganache or truffle then 
go to the account settings and then in the advance
"Reset Account" use this option to clear its history.

For Any othe technique check: https://ethereum.stackexchange.com/questions/37395/past-transactions-inconsistent-on-metamask-with-ganache 


To install from truffle to ganache:
truffle migrate --network ganache --reset

To connect with ganache using truffle
truffle console --network ganache

Make sure ganache is configured ontruffle-config.js

To run IPFS:
D:\>ipfs daemon

### **Future work**


1 - Currently, multiple reviewers cannot provide multiple separate reviews for a single version number of the paper. Therefore,
 numerous remarks for the same version of the paper will be overwritten with the latest remarks by the reviewers. However, 
 they can provide reviews for the same paper, but different versions and their history will be maintained. This limitation 
 should be removed in the future.

2 - If you are using the Ropsten network, then you will need to refresh the page to see the update. In the future, events supposed 
to be monitored, including pending and successful in synchronizing the page refresh.

3 - The search bar is currently not working; this search bar will be used to find papers.

4 - Reviewer will add their interest in their profile, so they can see those papers easily, which are relevant to their interest.
