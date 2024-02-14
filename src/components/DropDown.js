import React from "react";
import Dropdown from "react-dropdown";
import "react-dropdown/style.css";
const options = [
  "0-الكل",
  "1-مستشفى الجراحة",
  "2-مستشفى الباطنة",
  "3-مستشفى الجهاز التنفسي",
  "4-مستشفى الاسنان التخصصي",
  "5 الاستقبال و الطوارئ و الحوادث",
  "6-مستشفى الكلى",
  "7-مستشفى القلب التخصصي",
  "8-مستشفى العيون التخصصي",
  "9-السموم",
];
const defaultOption = "اختـــــــر";
class DropDown extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedOption: defaultOption, // Set the default selected option
    };
  }

  _onSelect = (selectedOption) => {
    this.setState({ selectedOption });
  };

  render() {
    const { selectedOption } = this.state;

    return (
      <Dropdown
        options={options}
        onChange={this._onSelect}
        value={defaultOption}
        placeholder="Select an option"
      />
    );
  }
}

export default DropDown;
