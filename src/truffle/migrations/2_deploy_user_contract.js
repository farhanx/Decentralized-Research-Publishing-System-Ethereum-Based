var Users1 = artifacts.require('./Users.sol');

//lets get the default information like network and number of generated accounts
module.exports = function(deployer, network, accounts) {

    deployer.deploy(Users1);
};