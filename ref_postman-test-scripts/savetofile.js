// Please read the documentation https://github.com/sivcan/ResponseToFile-Postman
// The opts for the server, also includes the data to be written to file
let opts = {
	requestName: request.name || request.url,
	fileExtension: "csv",
	mode: "writeFile", // Change this to any function of the fs library of node to use it.
	uniqueIdentifier: false,
	responseData: csv
};

pm.sendRequest(
	{
		url: "http://localhost:3000/write",
		method: "POST",
		header: "Content-Type:application/json",
		body: {
			mode: "raw",
			raw: JSON.stringify(opts)
		}
	},
	function (err, res) {
		console.log(err ? err : res);
	}
);
