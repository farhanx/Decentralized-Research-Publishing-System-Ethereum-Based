pragma solidity ^0.5.0;

/// @title  Decentralized Research Publishing Platform , User's Smart contract
/// @author Farhan Hameed Khan (farhankhan@blockchainsfalcon.com | farhanhbk@hotmail.com)
/// @dev    The main purpose of this contract is to provide user registration and user information retrieval techniques
///         http://www.blockchainsfalcon.com

contract Users {


    enum Roles {AUTHOR,REVIEWER,RESEARCHER} // only three roles are provided and each user can have a single role

    uint private userCount; // number of transactions is recorded in this variable

    struct UserInfo
    {
        string name;
        Roles  role;
        bool exists;
    } // a structure contains user Information like role associated with name

    string  testString; // testing string (in future must be deleted)

    mapping(address => UserInfo) internal user_detail; // An associated array of the user detail data with his account address

    /** @dev the constructor simply added a testing string. Shall be removed in future this is just for testing purpose */
    constructor() public {

        testString = "test string to check";
    }


    /** @dev registerUser -  take the information like role and name, then it store against the caller's address.
   *  @param _role          The role of the user which should be added
   *  @param _username      The full name of the user
   *  @return userCount     number of users added till now (On JS the return value will only be a transaction hash)
   */
    function registerUser(Roles _role,string memory _username)  public  returns(uint)
    {
        //  require(bytes(_username).length <= 50, "Name is too long.");
        //  require(!user_detail[msg.sender].exists," Already registerd");

        user_detail[msg.sender] = UserInfo({name:_username,role:_role,exists:true});

        userCount++;

        return userCount;
    }


    /** @dev isUserExist -  Verify if the calling user is registered user or not.
    *   @return boolean     true if registered user / false on non-registered user
    */
    function isUserExist() public view returns (bool)
    {
        if(user_detail[msg.sender].exists)
            return true;

        return false;
    }

    /** @dev getMessageSender -  testing function, shall be removed in future.
   *   @return address     return the caller's address
   */
    function getMessageSender() public view returns (address)
    {
        return msg.sender;
    }


    /** @dev getNumberofUsers -  returns the number of registered user in this contract
     *   @return uint     return total number of users
     */
    function getNumberofUsers()public view returns (uint)
    {
        return userCount;
    }

    /** @dev getCurrentUserInformation -  returns the role and fullname of the function caller
    *   @return (Roles role, string memory fullname)
    */
    function getCurrentUserInformation() public view returns(Roles role, string memory fullname)
    {
        return (user_detail[msg.sender].role,user_detail[msg.sender].name);
    }

    /** @dev getTestTxt -  just a test function - shall be removed in future.
    *   @return string testing message
    */
    function getTestTxt() public view returns(string memory)
    {
        return testString;
    }

    /** @dev getTestTxt -  just a test function - shall be removed in future.
     *   @return string testing message
     */
    function getandSetTestTxt(string memory val) public returns(string memory )
    {
        testString = val;
        return testString;
    }


    /** @dev isUserExist_SmartCall -  if a calling user is a registered user on this smart contract
     *   @return bool       if user is registered then return true else false.
     */
    function isUserExist_SmartCall() external view returns (bool)
    {
        // if the main caller account exists or not.

        if(user_detail[tx.origin].exists)
            return true;

        return false;
    }
}
