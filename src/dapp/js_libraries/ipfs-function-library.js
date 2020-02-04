/**
 * Decentralized Research Publishing Platform
 * @file ipfs-function-library.js file contains the IPFS related functions including loading and managing file upload.
 * @author Farhan Hameed Khan <farhankhan@blockchainsfalcon.com> | <farhanhbk@hotmail.com>
 * @date 1-Feb-2020
 * @version 1.1.0
 * @link http://www.blockchainsfalcon.com
 */

// global ipfs object
let ipfs;
// global ipfc cid or file id object
let ipfsId;
// current ipfs configured gateway or host
const IPFS_Gateway = "localhost";
// current ipfs gateway port
const IPFS_Port = "5001";
// this supposed to be the testing image , first run the IPFS daemon and then upload one small jpeg image on the ipfs. Use its CID hash in below variable
const testing_cid = "QmT3e6myckdVqinVLKRhmXkXZi2LR49kSEeUJqvXryMV2z";


// Load the IPFS
loadIPFSImage();



/**
 * Load IPFS related configuration and run the ipfs client in the page.
 * To view the testing image of IPFS make sure you add a new div with the id "#ipfsTestImage".
 * @param  validCID (Optional) it is the cid string hash of the file which supposed to be loaded after this function gets called
 */
function loadIPFSImage(validCID)
{
    ipfs = window.IpfsHttpClient(IPFS_Gateway, IPFS_Port);

    if(typeof validCID === "undefined") //if no image was given then use a testing one
        validCID = testing_cid

    ipfs.get(validCID, function (err, files)
    {
        if(err)
        {
            console.log("Error "+err);

            if(err==="Failed to fetch");
            alert("Check if IPFS daemon is running because it is "+err);

            //  $("#ipfs_image_msg").text("Check if IPFS daemon is running ? "+err).addClass("alert-danger");

            return;
        }

        files.forEach((file) => {
            console.log(file.path);
            // console.log(file.content.toString('utf8'));
            var arrayBufferView = new Uint8Array( file.content );
            var blob = new Blob( [ arrayBufferView ], { type: "image/png" } );
            var urlCreator = window.URL || window.webkitURL;
            var imageUrl = urlCreator.createObjectURL( blob );
            var img = document.querySelector( "#ipfsTestImage" );
            img.src = imageUrl;

        })
    })
}



/**
 * addIPFSDocFile function allow user to upload the file. This first checks if the event has file upload event fired
 * and then it calls the sub function saveToIpfsWithFilename
 * @param  event  this is a file ipload event and it must be called using
 *                <input name="docfile" id="docfile"  onchange="addIPFSDocFile(event);" type="file" accept=".doc,.docx,.pdf" class="form-control"  placeholder="docfile" required="required" data-validation-required-message="Please select your document.">
 */
function addIPFSDocFile(event)
{
    ret = confirm("Are you sure you want to upload this file?");

    if(ret===false) return;

    event.stopPropagation();
    event.preventDefault();

    console.log(event.target.files);

    // this will save the file in the directory and the file name and extension will be preserved
    if(event.target.files)
        saveToIpfsWithFilename(event.target.files);

    // this will save the file without directory or file name or file extension therefore after it will be reiceved from the server it will need to change to the extension
    //saveToIpfs(event.target.files)

}


/**
 * saveToIpfsWithFilename This is the core ipfs function to add the file on the IPFS server and returns a cid hash back to the caller
 * this function stores the file with a folder, and change the folder name to the file name. This is happen because in ipfs when you add
 * a new file it returns the CID which is later used as its filename, however to persist the filename for the caller it is better to create
 * first a folder with the same filename and then add the original file regardless of its name. Once the file hash arrives it sent to the the
 * sub function displayIPFSCIDOnForm to use at it wants.
 * @param  files  this is a files object must contain a file that needs to be added on the IPFS server
 */
function saveToIpfsWithFilename (files) {

    const file = [...files][0]

    const fileDetails = {
        path: file.name,
        content: file
    };

    const options = {
        wrapWithDirectory: true,
        progress: (prog) => console.log(`received: ${prog}`)
    };

    ipfs.add(fileDetails, options)
        .then((response) =>
        {
            console.log(response)
            // CID of wrapping directory is returned last
            ipfsId = response[response.length - 1].hash;
            console.log(ipfsId);
            displayIPFSCIDOnForm(ipfsId);

        }).catch((err) =>
    {
        console.error(err)
    })
}


/**
 * saveToIpfs This is the core ipfs function to add the file on the IPFS server and returns a cid hash back to the caller
 * this function stores the file without persisting its original file name. Once the file hash arrives it sent to the the
 * sub function displayIPFSCIDOnForm to use at it wants.
 * @param  files  this is a files object must contain a file that needs to be added on the IPFS server
 */
function saveToIpfs (files)
{

    ipfs.add([...files],{ progress: (prog) => console.log("received:" +prog) })
        .then((response) =>
        {
            console.log(response);
            ipfsId = response[0].hash;
            console.log(ipfsId);
            displayIPFSCIDOnForm(ipfsId);
        }).catch((err) =>
    {
        console.error(err);
    })
}


/**
 * getFileFromIPFS  This function gets the validCID e.g. hash of the file and then it returns back the original file
 * data to the function caller. The file gets automatically downloaded which a user can save in his desktop.
 * @param  validCID  file hash (must be existent on the ipfs server)
 */
function getFileFromIPFS(validCID)
{
    console.log("Function Call: getFileFromIPFS");

    ipfs = window.IpfsHttpClient('localhost', '5001');

    if(typeof validCID === "undefined") //if no image was given then use a testing one
    {
        alert("Non-validated CID found");
        console.log("CID for IPFS is incorrect");
        return;
    }

    ipfs.get(validCID, function (err, files)
    {
        if(err)
        {
            console.log("Error "+err);
            if(err==="Failed to fetch");
            alert("Check if IPFS daemon is running because it is "+err);
            return;
        }

        files.forEach((file) =>
        {

            console.log(JSON.stringify(file));
            // this must be the folder we recieve from the IPFS
            if(typeof file.content==="undefined")
            {
                console.log("Its a folder \\"+file.path+"\\");
            }
            // this must be the file inside the folder we recieve from IPFS
            else
            {
                console.log("Its a file \\"+file.path+"\\");

                var n = file.path.lastIndexOf("/");
                var filename = file.path.substring(n+1);
                console.log("Extracted File Name: "+filename);

                var arrayBufferView = new Uint8Array(file.content);
                var blob = new Blob([arrayBufferView], {type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document"});
                var urlCreator = window.URL || window.webkitURL;
                var Url = urlCreator.createObjectURL(blob);
                autoDownloadFile(filename, Url)
                // createDownloadFileLink(filename, Url)
            }
        })
    })
}


/**
 * displayIPFSCIDOnForm  This function gets the valid CID e.g. hash of the file and then it adjusted this information on the
 * HTML divs.
 * @param  cid  file hash
 */
function displayIPFSCIDOnForm(cid)
{
    if(cid.length> 10)
    {
        $("#docfile").prop("disabled",true);
        $("#docfilemsg").text(cid);
    }
}

// html based function to clear form
function refreshFileForm()
{
    $("#docfile").prop("disabled",false);
    $("#docfilemsg").text("");
}

/**
 * autoDownloadFile  This function gets the file name and its content and then automatically allow user to download this file. just
 * like when a user clicks a hyperlink and it allows him to download the file. Similerly here the file gets downloaded automatically.
 * @param  filename  file original name
 * @param  text  file contents
 */
function autoDownloadFile(filename, text) {
    var element = document.createElement('a');
    element.setAttribute('href',  text);
    element.setAttribute('download', filename);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
}

// broken function : it supposed to create a link but its not working yet so do not use it.
// in future it supposed to be fix.
function createDownloadFileLink(filename, url) {

    alert(url);

    if(typeof url !=="undefiend") {
        var urlLink = document.querySelector("#ipfurllink");
        urlLink.src = url;
        urlLink.download = filename;
    }
}

