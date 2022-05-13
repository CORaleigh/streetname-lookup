function getJurisdiction(fields, value) {
  const field = fields.find(f => {
    return f.name === 'PLAN_JURIS';
  });
  if (field) {
    return field.domain.codedValues.find(cv => {
      return cv.code === value;
    }).name;
  }
}

function loadResults(text,offset, count) {
    const list = document.querySelector('calcite-list');
    list.innerHTML = '';  
  const results = checkStreetName(text,offset,count);
    results.features.forEach(result => {
      const item = document.createElement('calcite-list-item');
      const block = document.createElement('calcite-block');
      block.setAttribute('collapsible','');
      block.heading = `${result.attributes['DIR_PREFIX'] === null ? '' : result.attributes['DIR_PREFIX']} ${result.attributes['ST_NAME']} ${result.attributes['ST_TYPE']}`;
      const content = document.createElement('div');
      content.innerHTML += `Jurisdiction: ${getJurisdiction(results.fields,result.attributes['PLAN_JURIS'])}<br>`;
      content.innerHTML += `Subdivision: ${result.attributes['SUBDIV_NAME'] ? titleCase(result.attributes['SUBDIV_NAME']):''}<br>`; 
            content.innerHTML += `Status: ${result.attributes['STATUS'] === 'A'? 'Active':'Reserved'}<br>`;    

            content.innerHTML += `Entered: ${result.attributes['DATE_ST_ENTERED'] ? new Date(result.attributes['DATE_ST_ENTERED']).toLocaleDateString('en-US') : ''}<br>`;       
            content.innerHTML += `Approved: ${result.attributes['DATE_APPROVED'] ? new Date(result.attributes['DATE_APPROVED']).toLocaleDateString('en-US') : ''}<br>`; 
            content.innerHTML += `Application #: ${result.attributes['APPL_NUM']}<br>`;       
      block.appendChild(content);

      item.appendChild(block);
      list.appendChild(item);
    });
}
function getCount(street){

    var featureLayer = "https://services.arcgis.com/v400IkDOw1ad7Yad/arcgis/rest/services/Wake_County_Street_Names/FeatureServer/0";

	var where = `${searchField} like '${street.toUpperCase()}%' or ${searchField} like '${street.toUpperCase().replace(' ', '')}`;
    var xmlhttp = new XMLHttpRequest();
    var url = featureLayer + "/query?where="+where+"&outFields=*&returnGeometry=false&returnCountOnly=true&f=json"


    xmlhttp.open("GET",url,false);
        xmlhttp.send();

 

    if (xmlhttp.status!==200){
        return "";
    } else {
        var responseJSON=JSON.parse(xmlhttp.responseText)
        if (responseJSON.error){
            return "";
        } else {
          return responseJSON;
        }
    }
}


function checkStreetName(street,offset,count){

    var featureLayer = "https://services.arcgis.com/v400IkDOw1ad7Yad/arcgis/rest/services/Wake_County_Street_Names/FeatureServer/0";

	var where = `${searchField} like '${street.toUpperCase()}%' or ${searchField} like '${street.toUpperCase().replace(' ', '')}`;
    var xmlhttp = new XMLHttpRequest();
    var url = featureLayer + "/query?where="+where+`&outFields=*&returnGeometry=false&orderByFields=ST_NAME ASC, ST_TYPE ASC, DIR_PREFIX ASC&resultRecordCount=${count.toString()}&resultOffset=${offset.toString()}&f=json`


    xmlhttp.open("GET",url,false);
        xmlhttp.send();

 

    if (xmlhttp.status!==200){
        return "";
    } else {
        var responseJSON=JSON.parse(xmlhttp.responseText)
        if (responseJSON.error){
            return "";
        } else {
          return responseJSON;
        }
    }
}

function titleCase(str) {
  str = str.toLowerCase().split(' ');
  for (var i = 0; i < str.length; i++) {
    str[i] = str[i].charAt(0).toUpperCase() + str[i].slice(1); 
  }
  return str.join(' ');
}
