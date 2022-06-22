import React, { useEffect, useState } from "react";
import Input from "../Input/Input";
import useSearch from "../../hooks/useSearch";
import { Button } from "semantic-ui-react";
import MainService from "../../../../../../../api/service";

import "./Dropdown.css";

const { getTaxonDetails } = MainService;

let selectStyle = { width: "100%", overflow: "auto" };

function Dropdown(props) {
  const [opts, isLoading, txt, setTxt] = useSearch();
  const [id, setId] = useState(-1);
  const [selectable, setSelectable] = useState(true);

  useEffect(() => {
    const handleInfo = async () => {
      const info = await getTaxonDetails(id);
      setId(-1);
      if (info.suggestions.length > 0) props.addSuggestions(info.suggestions);
    };
    if (id !== -1) {
      handleInfo();
    }
  }, [id, props.addSuggestions]);

  const onChangeTxt = (evt) => {
    if (selectable) {
      const value = evt.nativeEvent.target.value;
      setTxt(value);
    } else {
      evt.preventDefault();
    }
  };

  const onChange = (opt) => (evt) => {
    let option = { Id: opt.id, Entry: opt.tag_name };
    if (props.handleIfExists(option)) {
      props.popIndex(props.indexToPop);
      setTxt("");
      setSelectable(false);
    } else {
      props.data.props.onChange(option);
      props.handleData(option);
      setTxt(opt.tag_name);
      setId(opt.id);
      setSelectable(false);
    }
  };

  if (opts.length === 1)
    selectStyle = { ...selectStyle, ...{ padding: "10px 0", fontSize: 16 } };

  return selectable ? (
    <div style={{ display: "flex", flexDirection: "row", width: "100%" }}>
      <div style={{ width: "90%", marginTop: 3 }}>
        <Input onChange={onChangeTxt} value={txt} />
        {opts.length > 1 && (
          <select
            style={selectStyle}
            size={opts.length > 5 ? 5 : opts.length}
            name="select"
          >
            {opts.map((opt, i) => (
              <option
                className="tag-option"
                key={i}
                value={opt.id}
                onClick={onChange(opt)}
              >
                {opt.tag_name}
              </option>
            ))}
          </select>
        )}
        {opts.length === 1 && (
          <Input
            value={opts[0].tag_name}
            onClick={onChange(opts[0])}
            onHoverStyle={{
              color: "white",
              backgroundColor: "dodgerblue",
              cursor: "pointer",
            }}
          />
        )}
      </div>
    </div>
  ) : null;
}

export default Dropdown;
