var Users1 = artifacts.require('./Users.sol');
var Papers1 = artifacts.require('./Papers.sol');

var Reviewer1 = artifacts.require('./Reviewers.sol');


//lets get the default information like network and number of generated accounts
module.exports = function(deployer, network, accounts) {

    deployer.deploy(Reviewer1,Users1.address,Papers1.address,{from:accounts[0]});
};