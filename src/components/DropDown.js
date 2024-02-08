import React from "react";
import Dropdown from "react-dropdown";
import "react-dropdown/style.css";
const options = ["one", "two", "three"];
const defaultOption = options[0];
class DropDown extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedOption: options[0], // Set the default selected option
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
        value={selectedOption}
        placeholder="Select an option"
      />
    );
  }
}

export default DropDown;
