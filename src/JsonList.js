import React from "react";

const JsonList = ({ data, keyId }) => {
  if (data === null) {
    return <span>null</span>;
  }

  // Primitive values
  if (typeof data !== "object") {
    if (keyId && keyId.toLowerCase() == 'code'){
      return (<div class="textInfo">
        <pre>
          <code>
            {String(data)}
          </code>
        </pre>
      </div>);
    }
    else
      return <div class="textInfo"><span>{String(data)}</span></div>;
  }

  return (
    <ul style={{"list-style-type":"none", "padding":0, "margin":0}}>
      {Array.isArray(data)
        ? data.map((item, index) => (
            <li key={index}>
              <div class="textInfo">                          
                <JsonList data={item} keyId={keyId} />
              </div>
            </li>
          ))
        : Object.entries(data).map(([key, value]) => (
            <li key={key}>
              <span style={{paddingLeft:10, lineHeight: 2}}><strong>{key.split('_').map(each => each.charAt(0).toUpperCase() + each.slice(1)).join(' ')}:</strong>{" "}</span>
              <div class="textInfo">
                <JsonList data={value} keyId={key} />
              </div>
            </li>
          ))}
    </ul>
  );
};

export default JsonList;