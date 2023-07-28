import React from "react";
import "./style.css";
import down_arrow from '../../assets/icons/down_arrow.svg';

class SelectBox extends React.Component {
  state = {
    items: this.props.items || [],
    showItems: false,
    selectedItem: this.props.items && this.props.items[0]
  };

  dropDown = () => {
    this.setState(prevState => ({
      showItems: !prevState.showItems
    }));
  };

  selectItem = item => {
    this.setState({
      selectedItem: item,
      showItems: false
    });
  };



  

  render() {
    return (
      <div className="form-control-div">
        <div className="select-box--container">
          <div className="select-box--selected-item" onClick={this.dropDown}>
            {this.state.selectedItem.value}
          </div>

          <img src={down_arrow} alt="KhulKe Logo" height={"24px"} width={"24px"} style={{position:"absolute"}} onClick={this.dropDown}/>
          <div
            style={{ display: this.state.showItems ? "block" : "none" }}
            className={"select-box--items"}
          >
          {this.state.items.map(item => (
              <div
                key={item.id}
                onClick={() => this.selectItem(item)}
                className={this.state.selectedItem === item ? "selected" : ""}
              >
                {item.value}
              </div>
            ))}

          </div>
        </div>
      </div>
    );
  }
}

export default SelectBox;
