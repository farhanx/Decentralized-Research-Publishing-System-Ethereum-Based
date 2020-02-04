pragma solidity ^0.5.0;
import "./Users.sol";

/// @title  Decentralized Research Publishing Platform , Author's Smart contract
/// @author Farhan Hameed Khan (farhankhan@blockchainsfalcon.com | farhanhbk@hotmail.com)
/// @dev    The main purpose of this contract is to store a paper information in the associated author address or account
///         which means any user can be an author who can have one or many papers.
///         http://www.blockchainsfalcon.com

contract Authors{

    // user contract object
    Users userContract;

    // user contract address
    address userContractAddress;

    // when a paper gets added under a author address then this event gets fire
    event addPaper(uint32 paperId,address authorId, address paperContractId);

    // Folder structure to hold multiple paper ids
    struct Folder {
        uint32 [] paperIds;
        uint32 totalPapers;
    }

    // an author address can have a folder which can have more than one paper informations
    mapping (address => Folder) private paperReferences;


    /** @dev the constructor simply gets the user contract address and store it in the user contract address
     *       this address is later used for initializing the user contract.
     * @param   _userContractaddress must be the existing deployed user contract address
     */
    constructor(address _userContractaddress) public {

        userContractAddress =_userContractaddress;
        userContract = Users(userContractAddress);
    }

    /*
        modifier onlyAuthorRole() {
            require(user_detail[msg.sender].exists," User not authorized or registerd user");
            _;
        }
    */


    /** @dev addPaperInUserFolder -  This function is used for adding a new paper under the author's name. For this the
     * the paperReference stores the paperid under the author's address by calling. The returned storage acts like a
     * folder for the the user. Where a user can hold more than one paper ids under their address.
     * @param  _paperid  paper id which must be stored under author's address
     * @param  _authorAddress  the author address
     */
    function addPaperInUserFolder(uint32 _paperid,address _authorAddress) public //returns(uint32)// onlyAuthorRole public
    {
        //call the paper contract to add new stuff
        // get unique folder
        Folder storage folder = paperReferences[_authorAddress];

        uint32[] storage paperId = folder.paperIds;

        paperId.push(_paperid); //by default it will store value from 0 portion and then it will move on automatically you do not need specifically to mention element idenx like paperId[index]

        folder.totalPapers++;

        emit addPaper(folder.totalPapers,tx.origin,msg.sender);
    }


    /** @dev getAllPaperIds -  This function returns all the paper ids associated to the calling address or user.
     * @return uint32[]  _paperIds  The array of paper ids.
     */
    function getAllPaperIds() public view returns (uint32[] memory _paperIds)
    {
        uint32 [] memory paperIds = paperReferences[msg.sender].paperIds;

        return paperIds;
    }


    /** @dev getNumUsers -  returns number of users by calling inter-contract-calls to User contract
     * @return uint  number of users
     */
    function getNumUsers() public view returns(uint )
    {
        return userContract.getNumberofUsers();
    }


    /** @dev verifyUser -  verufy if the calling user is a registered user or non-registered . by calling inter-contract-calls to User contract
     * @return bool    true if user is registered else false.
     */
    function verifyUser() public view returns(bool ret)
    {
        return userContract.isUserExist_SmartCall();
    }

}
