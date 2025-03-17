import React from 'react'

export default function FormDropdown(props) 
{
  const {name, options, default_option, onChange, default_value, value, classnm, multiselect} = props;

  return (
    // value={default_value && default_value} 
    <select
      multiple={multiselect ? true : false}
      value={value}
      className={`${classnm} ${multiselect ? "f-ht-70" : ""}`}
      defaultValue={default_value && default_value}
      name={name}
      onChange={onChange}
      style={{ height: "50px!important" }}
    >
      {default_option && <option value="">- Select -</option>}

      {options &&
        options.map((option) => (
          <option key={option.id} value={option.value}>
            {option.label}
          </option>
        ))}
    </select>
  )
}
