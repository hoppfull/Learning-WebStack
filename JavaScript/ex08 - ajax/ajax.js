var xmlHttp = new XMLHttpRequest();

function loadXMLDoc(pageElement, url){
	xmlHttp.onreadystatechange = function(){
		if(xmlHttp.readyState==4 && xmlHttp.status==200){
			document.getElementById(pageElement).innerHTML = xmlHttp.responseText;
		}
	};
	xmlHttp.open("GET", url, true);
	xmlHttp.send(null);
}