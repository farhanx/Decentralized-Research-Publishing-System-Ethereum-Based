pragma solidity ^0.5.0;
import "./Users.sol";
import "./papers.sol";

/// @title  Decentralized Research Publishing Platform , Reviewer's Smart contract
/// @author Farhan Hameed Khan (farhankhan@blockchainsfalcon.com | farhanhbk@hotmail.com)
/// @dev    The main purpose of this contract is to store a reviewers information associated with the reviewers address or account
///         The reviewer can upload their reviewing comments and remarked file against their assigned paper. They can also select
///         resubmit, reject or pass the status for the paper. Multiple reviewers can assign themselves to the single paper but a
///         paper will be passed by one of the reviewer to pass it.
///         http://www.blockchainsfalcon.com

contract Reviewers{

    // User contract object
    Users userContract;

    // User contract deployed address
    address userContractAddress;

    // Paper contract object
    Papers paperContract;

    // Paper contract deployed address
    address paperContractAddress;

    // Event that is fired when a new review gets added by the reviewer on any paper
    event addReviewEvent(uint32 paperId,uint32 versionid, string reviewdDocCid);


    // a single keyword can be interested by more than one reviewers
    // e.g. "cybersecurity" keyword interested by Address1 and Address 2
    mapping (bytes32 =>address[]) private interestedKeywordReviewers;


    /// Begin: Data structures for reviewed paper --------------------------------------------

    // a single reviewed data included reviewer's address, comments, and CID of IPFS file along paper status
    struct ReviewData
    {
        address reviewerAddress;
        string  reviewerComments;
        string  reviewerEditedCid;
        uint status;
    }

    // a single version has single reviewed data : Note ( We are not saving multiple reviewer's comments for a single version at this moment)
    struct Versions {
        mapping(uint32 =>ReviewData) versionBasedData;
    }

    /// paperid associated with version and version is associated with recommednation , cid and ratings
    /// Since a paper may have more than one versions and each version might have comments and seprate cid there for
    /// paperBasedVersion (paperId) -> Many Versions -> Each version has ReviewData ( Comments + CID )
    /// paperBasedVersions[_paperid].versionBasedData[_version].
    mapping (uint32 =>Versions) private paperBasedVersions;

    /// End: Data structures for reviewed paper -------------------------------------------------


    /** @dev the constructor simply gets the author contract address and store it in the authors contract object.
    *       this address is later used for initializing the author contract.
    * @param _userContractAddress must be the existing deployed Author contract address
    * @param _paperContractAddress must be the existing deployed paper contract address
    */
    constructor(address _userContractAddress,address _paperContractAddress) public {

        userContractAddress =_userContractAddress;
        userContract = Users(userContractAddress);

        paperContractAddress =_paperContractAddress;
        paperContract = Papers(paperContractAddress);
    }

    /** @dev addPaperReview -  This function verify registered reviewer and verify paper existence. Then it allows to
     *                        add the comment, status and cid hash file against the paper id.
     *  @param   _paperid            Paper ID, or which reviewed data being added
     *  @param   _version            Paper version, for which reviewed data being added
     *  @param   _reviewerComments   complete comments
     *  @param   _reviewerCid        remarked document hash cid from IPFS
     *  @param   _status             Status of the paper given by the reviewer e.g. passed , reject or resubmit.
     */
    function addPaperReview(uint32 _paperid,uint32  _version,string memory _reviewerComments,string memory _reviewerCid,uint _status) public
    {
        //call the paper contract to add new stuff
        // get unique folder

        require(verifyUser(),"User must be existent in the system");
        require(verifyPaper(_paperid),"Paper id must be existent in the system");
        require(verifyReviewer(_paperid),"Reviewer must be existebt for this paperid");

        Versions storage version = paperBasedVersions[_paperid];

        ReviewData storage reviewData = version.versionBasedData[_version];

        reviewData.reviewerComments = _reviewerComments;

        reviewData.reviewerAddress = msg.sender;

        reviewData.reviewerEditedCid = _reviewerCid;

        reviewData.status = _status;

        emit addReviewEvent(_paperid,_version,_reviewerCid);
    }


    /** @dev getPaperReview -  get the reviewing data based on the paper and paper's version.
     *  @param     _paperid            Paper ID , the target paper
     *  @param     _version            Paper version , the targetted version of the paper
     *  @return    _reviewerComments   complete comments
     *  @return    _reviewerCid        remarked document hash cid from IPFS
     *  @return   _reviewer        remarked document hash cid from IPFS
     *  @return   _status             Status of the paper given by the reviewer e.g. passed , reject or resubmit.
     */
    function getPaperReview(uint32 _paperid,uint32 _version) public view returns (string memory _reviewercomments,string memory _cid, address _reviewer,uint status)
    {
        return  (paperBasedVersions[_paperid].versionBasedData[_version].reviewerComments,
        paperBasedVersions[_paperid].versionBasedData[_version].reviewerEditedCid,
        paperBasedVersions[_paperid].versionBasedData[_version].reviewerAddress,
        paperBasedVersions[_paperid].versionBasedData[_version].status
        );
    }


    /** @dev  the inter-contract communication to verify if the calling user is registered one or not in user contract
    * @return bool  true if caller is registered else false if not.
    */
    function verifyUser() private view returns(bool ret)
    {
        return userContract.isUserExist_SmartCall();
    }

    /** @dev  The inter-contract communication to verify if the given paper id exist in the paper contract
    * @param  _paperId   paper id
    * @return bool    return true if paper exist else return false
    */
    function verifyPaper(uint _paperId ) private view returns(bool ret)
    {
        return paperContract.isPaperExist(_paperId);
    }

    /** @dev  verifyReviewer - The inter-contract communication to verify if the caller is allowed to review this paper
    * @param  _paperId   paper id
    * @return bool    return true if verifier allowed to review this paper else return false
    */
    function verifyReviewer(uint _paperId) view private returns(bool ret)
    {
        return paperContract.isReviewerAlreadyAssigned(_paperId);
    }

    /** @dev  setPaperStatus - The inter-contract communication to a new status against the paper e.g. resubmit,  reject or passed.
    * @param  _paperId     Paper id
    * @param  _status   Status e.g.   resubmit,  reject or passed.
    */
    function setPaperStatus(uint _paperId ,Papers.PaperStatus _status) public
    {
        paperContract.setPaperStatusByReviewer(_paperId,_status);
    }


    /// This is for my future work: The reviewer's can view latest paper requests based on their interested keywords
    /// ####################################################################################################################################################
    /// Begin: Data structures for reviewer's interesteted topic or keywords ---------------



    /** @dev  addReviewerInterestedInKeyword - add the new caller as a reviewer if he is not enrolled to this keyword before m, otherwise reject him if he is already a part of this keyword
     * @param _keyword    a single keyword to be added under reviewer's interest group
     */
    function addReviewerInterestedInKeyword(bytes32 _keyword) public {

        require(isReviewerAlreadyAddedInKeywordList(_keyword)==false,"Reviewer has already added his interested keyword");

        address[] storage rewvierArray = interestedKeywordReviewers[_keyword];

        rewvierArray.push(msg.sender);
    }

    /** @dev  getAllReviewerInterestedInKeyword - get all those reviewers whose interest is in this following keyword
    * @param  _keyword    a single keyword e.g. cybersecurity
    * @return address[]  reviewers   list of reviewers who are interested in the given keywork
    */
    function getAllReviewerInterestedInKeyword(bytes32 _keyword) public view returns (address[] memory reviewerArray)
    {
        return interestedKeywordReviewers[_keyword];
    }


    /** @dev  isReviewerAlreadyAddedInKeywordList - check the keyword list if it has already this new caller or not.
    * @param  _keyword    a single keyword e.g. cybersecurity
    * @return bool       isexist     return true if keyword is already added under reviewer's address else false will return.
    */
    function isReviewerAlreadyAddedInKeywordList(bytes32 _keyword) public view returns (bool isexist)
    {
        if( interestedKeywordReviewers[_keyword].length>0)
        {
            address[] storage reviewerArray =  interestedKeywordReviewers[_keyword];

            for(uint loop = 0; loop<reviewerArray.length;loop++)
            {
                if(reviewerArray[loop] == msg.sender)
                    return true;
            }
        }

        return false;
    }

    /// End: Data structures for reviewer's interesteted topic or keywords ---------------
    /// ####################################################################################################################################################


}
