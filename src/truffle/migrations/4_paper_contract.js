var Papers1 = artifacts.require('./Papers.sol');
var Authors1 = artifacts.require('./Authors.sol');


//lets get the default information like network and number of generated accounts
module.exports = function(deployer, network, accounts) {

    deployer.deploy(Papers1,Authors1.address,{from:accounts[0]});
};