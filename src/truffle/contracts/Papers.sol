pragma solidity ^0.5.0;
import "./Authors.sol";

/// @title  Decentralized Research Publishing Platform , Paper's Smart contract
/// @author Farhan Hameed Khan (farhankhan@blockchainsfalcon.com | farhanhbk@hotmail.com)
/// @dev    The main purpose of this contract is to store a paper information along its history and versions
///         http://www.blockchainsfalcon.com

contract Papers {

    // events
    event submittedPaper(uint32 paperid,address useraccount);
    event assignedReviewerEvent(uint paperid,address useraccount);



    // author contract object
    Authors authorsContractObj;

    // author contract deployed address
    address authorContractAddress;


    // enum states
    enum PaperStatus {LATEST,REVIEWING,PASSED,RESUBMIT,REJECTED,MODIFIED,NONE}

    // history information which contains the author's previous paper status and previous file stored on the IPFS server
    struct History {
        PaperStatus status;
        string ipfs_cid;
    }

    // Paper structure
    struct PaperFiles
    {
        // always unique assigned number to the paper
        uint32 paperUniqueNumber; // must be unique

        // New state of the paper
        address author;
        string title;
        string ipfs_cid;

        // reviewing data
        PaperStatus status;

        // Every paper has more than one keywords or tags assoiciated with it (String must be converted to bytes32 )
        bytes32 [] keywords; //experiment: ["0x63616e6469646174653100000000000000000000000000000000000000000000","0x6332000000000000000000000000000000000000000000000000000000000000","0x6333000000000000000000000000000000000000000000000000000000000000"]

        address [] reviewers;
        uint    totalReviewer;

        //put old state in this array associated with version number (which should be incremented on every modification)
        // old state should be inserted when new state is ready
        uint version_number; //should be incremeneted

        mapping(uint=> History)  versionHistory;

        bool paperExist;
    }

    // unique PaperID is associated with its information in PaperFiles structure which has version and other info
    mapping(uint=> PaperFiles) private paperFiles;

    uint32 totalPapers; // represent id as well

    bytes32 testingBytes; // testing variable


    /** @dev the constructor simply gets the author contract address and store it in the authors contract object.
     *       this address is later used for initializing the author contract.
     * @param   _authorContractAddress must be the existing deployed Author contract address
     */
    constructor(address _authorContractAddress) public {
        totalPapers = 0;
        authorContractAddress =_authorContractAddress;
        authorsContractObj = Authors(authorContractAddress);
    }



    /** @dev uploadNewPaper - This function adds a new paper information by taking all the paper related information
     *                         from the caller.
     * then it stores them by associating it with the new paper id.
     * @param  _ipfs  newly added ipfs based file hash CID
     * @param  _title the title of the paper
     * @param  _keywords string keywords for the paper in bytes32
     */
    function uploadNewPaper(string memory _ipfs,string memory _title,bytes32[] memory _keywords) public
    {
        //   _keywords[0] =0x63616e6469646174653100000000000000000000000000000000000000000000; //always remmember we cant insert  value like this
        // but you can get the value using         bytes32 keywordFirst= updateP.keywords[0];
        // updateP.keywords.push(0x63616e6469646174653100000000000000000000000000000000000000000000); // always use this way to insert
        // updateP.keywords.push(0x43316e6469646174653100000000000000000000000000000000000000000000); // always use this way to insert
        require(bytes(_title).length <= 100, "Title is too long.");
        require(bytes(_ipfs).length <= 69, "IPFS CID is wrong");

        uint32 paperId = totalPapers;
        PaperFiles storage updateP = paperFiles[paperId];

        //LATEST PAPER
        paperId = totalPapers; //new paper id
        updateP.status = PaperStatus.LATEST;
        updateP.author = msg.sender;
        updateP.title = _title;
        updateP.ipfs_cid = _ipfs;
        updateP.keywords = _keywords;
        updateP.paperUniqueNumber = paperId;
        updateP.totalReviewer = 0;
        updateP.version_number = 0;
        updateP.paperExist = true;
        totalPapers++;

        authorsContractObj.addPaperInUserFolder(paperId,msg.sender);
        emit submittedPaper(paperId,msg.sender);
    }

    /** @dev uploadModifiedPaper - This function takes new information and stored against the existing paperid
     * then it stores them by associating it with the new paper id.
     * @param  _paper_id  existing paper id
     * @param  _ipfs  newly added ipfs based file hash CID
     * @param  _title the title of the paper
     * @param  _keywords string keywords for the paper in bytes32
     */
    function uploadModifiedPaper(uint32 _paper_id,string memory _ipfs,string memory _title,bytes32[] memory _keywords) public returns(uint32)
    {
        //   _keywords[0] =0x63616e6469646174653100000000000000000000000000000000000000000000; //always remmember we cant insert  value like this
        // but you can get the value using         bytes32 keywordFirst= updateP.keywords[0];
        // updateP.keywords.push(0x63616e6469646174653100000000000000000000000000000000000000000000); // always use this way to insert
        // updateP.keywords.push(0x43316e6469646174653100000000000000000000000000000000000000000000); // always use this way to insert

        require(paperFiles[_paper_id].paperExist,"Paper must be exist");

        require(bytes(_title).length <= 100, "Title is too long.");
        require(bytes(_ipfs).length <= 69, "IPFS CID is wrong");

        uint32 paperId = _paper_id;
        uint oldversion = paperFiles[paperId].version_number;

        History storage updateH =  paperFiles[paperId].versionHistory[oldversion];

        // Since we never assing anything to version history therefore we need to have a seprate variable
        updateH.ipfs_cid = paperFiles[paperId].ipfs_cid; // save old ipfs id
        updateH.status = paperFiles[paperId].status; // save old ipfs status

        //Since we have this existting object in our array so we will directly call the structure to update
        paperFiles[paperId].author = msg.sender; // again add author name
        paperFiles[paperId].title = _title; // change title name if required
        paperFiles[paperId].ipfs_cid = _ipfs; // new ipfs
        paperFiles[paperId].status = PaperStatus.MODIFIED;

        // remove all the previous keywords which this paper had
        for(uint loop = 0; loop<=paperFiles[paperId].keywords.length;loop++)
            paperFiles[paperId].keywords.pop();

        // add the new keywords
        paperFiles[paperId].keywords = _keywords;

        // add the new version id
        paperFiles[paperId].version_number = paperFiles[paperId].version_number + 1 ; // increase the version number

        return paperId;
    }


    /** @dev getLatestId - This function  only returns the number of papers on the paper contract
     * @return uint  returns the total stored papers
     */
    function getLatestId() public view returns(uint)
    {
        return totalPapers;
    }

    /** @dev getPaperValues - This function returns the paper attributes associated with its paper id
     * @param _paperId  paper id
     * @return string _title the title of the paper
     * @return string _ipfs  ipfs based file hash CID
     * @return address author  author address of the associated paper
     * @return PaperStatus status the status of the paper
     * @return address[]  reviewers the array of reviewer addresses
     * @return bytes32[]  keywords  the keywords attached to the paper
     * @return uint     version    the current paper version
       */
    function getPaperValues(uint _paperId) public view returns(string memory title,string memory ipfscid,address author,PaperStatus status,address[] memory reviewers,bytes32[] memory keywords,uint version)
    {
        return (paperFiles[_paperId].title,paperFiles[_paperId].ipfs_cid,paperFiles[_paperId].author,paperFiles[_paperId].status,paperFiles[_paperId].reviewers,paperFiles[_paperId].keywords, paperFiles[_paperId].version_number);
    }

    /** @dev getVersionHistory - This function returns the author's old paper ipfs hash cid and its status.
     * @param _paperId  paper id
     * @param version_number  number of the version
     * @return string _ipfs  ipfs based file hash CID
     * @return PaperStatus status the status of the paper
     */
    function getVersionHistory(uint _paperId,uint version_number) public view returns(string memory,PaperStatus )
    {
        return (paperFiles[_paperId].versionHistory[version_number].ipfs_cid,paperFiles[_paperId].versionHistory[version_number].status);
    }

    /** @dev getPaperKeyword - This function returns the keyword value
     * @param _paperId  paper id
     * @param keywordIndex  the index of the keyword you are looking for(Make sure index exist)
     * @return bytes32  the keyword value
     */
    function getPaperKeyword(uint _paperId,uint keywordIndex) public view returns(bytes32)
    {
        return paperFiles[_paperId].keywords[keywordIndex];
    }

    /** @dev getSetBytes32Test - testing function
    */
    function getSetBytes32Test(bytes32 para1) public
    {
        testingBytes = para1;
    }

    /** @dev getBytes32Test - testing function
    */
    function getBytes32Test() public view returns(bytes32)
    {
        return testingBytes;
    }

    /** @dev getAllLatestPapersIds - This function returns only the latest paper ids.
    * @return uint[] paperids  the array of latest paper ids.
    */
    function getAllLatestPapersIds() public view returns(uint[] memory ids)
    {
        uint index = 0;
        ids = new uint[](totalPapers+1);

        for(uint loop=0; loop<totalPapers;loop++)
        {
            if(paperFiles[loop].status == PaperStatus.LATEST)
            {
                ids[index] = loop;
                index++;
            }
        }

        ids[index] = 0; //end of array

        return ids;
    }


    /** @dev getAllPapersIds - This function returns all the stored paper ids regardless their status
   * @return uint[] paperids  the array of latest paper ids.
   */
    function getAllPapersIds() public view returns(uint[] memory ids)
    {
        uint index = 0;
        ids = new uint[](totalPapers+1);

        for(uint loop=0; loop<totalPapers;loop++)
        {
            ids[index] = loop;
            index++;
        }

        // ids[index] = 0; //end of array

        return ids;
    }


    /** @dev isPaperExist - This function verify if the paper id exist in the paper contract or not.
    * @param _paperId  the paper id
    * @return bool          returns true if paper id exist otherwise false.
    */
    function isPaperExist(uint _paperId) public view returns (bool ret)
    {
        if(paperFiles[_paperId].paperExist)
            return true;

        return false;
    }


    /** @dev isReviewerAlreadyAssigned - Verify if the caller who wants to get assigned on this paper is already assigned
    * on this paper. Otherwise return false.
    * @param _paperId  the paper id
    * @return bool          returns true if the reviewer is already assigned on this paper id otherwise false.
    */
    function isReviewerAlreadyAssigned(uint _paperId) public view returns(bool ret)
    {
        if(paperFiles[_paperId].totalReviewer>0)
        {
            // check if this reviewer exist already inside this paper
            for(uint loop =0; loop<paperFiles[_paperId].totalReviewer; loop++)
            {
                if(paperFiles[_paperId].reviewers[loop]==tx.origin)
                {
                    return true;
                }
            }
        }

        return false;
    }

    // All below functions must be called by Reviewer contract ================================================================

    /** @dev assignReviewerToPaper - This function assign the caller to the paper as a reviewer. This function will only be called
      * by the reviewer contract.
      * @param _paperId  the paper id
      */
    function assignReviewerToPaper(uint _paperId) public
    {
        require(paperFiles[_paperId].paperExist,"Paper must be exist");

        require(!isReviewerAlreadyAssigned(_paperId),"Reviewer is already assigned for this paper");

        if(paperFiles[_paperId].totalReviewer==0)
        {
            paperFiles[_paperId].status = PaperStatus.REVIEWING;
        }

        paperFiles[_paperId].reviewers.push(tx.origin);

        paperFiles[_paperId].totalReviewer++;

    }

    /** @dev setPaperStatusByReviewer - This function allows the reviewer to set the new status for the paper associated with paper id
      * by the reviewer contract.
      * @param _paperId  the paper id
      * @param _status the new status to be set for the paper
      */
    function setPaperStatusByReviewer(uint _paperId,PaperStatus _status) public
    {
        require(paperFiles[_paperId].paperExist,"Paper must be exist");
        require(isReviewerAlreadyAssigned(_paperId),"Reviewer is not assigned for this paper, he must be assigned on this before changing any status");

        paperFiles[_paperId].status = _status;

        emit assignedReviewerEvent(_paperId,tx.origin);
    }

}
