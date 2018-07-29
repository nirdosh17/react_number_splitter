import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Box(props) {
  let boxStyle;
  if (props.active_box === props.boxNumber) {
    boxStyle = { backgroundColor: randomColor() };
  } else {
    boxStyle = { backgroundColor: 'white' };
  } ;
  return (
    <div style={boxStyle} className='box'>{props.boxes[props.boxNumber]}</div>
  );
}

class Board extends React.Component {
  constructor(props) {
    super(props);
    let boxes = {};
    for (var i = 1; i <= this.props.divisions; i++) {
      let step = Object.values(boxes).sum() >= this.props.inputNumber ? 0 : 1;
      boxes[i] = step;
    }
    this.state = {
      inputNumber: this.props.inputNumber,
      divisions: this.props.divisions,
      remainingToFill: this.props.inputNumber-this.props.divisions,
      boxes: boxes,
      active_box: null,
      accumulated: this.props.divisions,
      delay: this.props.delay,
    };
  }

  render() {
    let boxes = [];
    for (var i = 1; i <= this.state.divisions; i++) {
      boxes.push(<Box boxes={this.state.boxes} active_box={this.state.active_box} boxNumber={i} key={i}/>);
    }
    return (
      <div className="main_display">
        <div>
          {boxes}
        </div>
        <div className="info">
          <p>{this.state.accumulated}/{this.state.inputNumber}</p>
        </div>
      </div>
    );
  }

  componentDidMount() {
    let boxesCollector = this;
    let state = this.state;
    let divisions = state.divisions;
    let boxes = state.boxes;
    let delay = state.delay;

    if (Object.values(boxes).sum() >= this.state.inputNumber) { return }

    (function theLoop (i) {
      setTimeout(function () {
        let randomNumber = Math.floor(Math.random() * divisions) + 1;
        boxes[randomNumber] = boxes[randomNumber] + 1;
        boxesCollector.setState({
          boxes: boxes,
          active_box: randomNumber,
          accumulated: Object.values(boxes).sum()
        });
        if (--i) {
          theLoop(i);
        }
      }, delay);
    })(state.remainingToFill, boxesCollector);
  }
};

Array.prototype.sum = function() {
  return this.reduce((a, b) => a + b, 0);
};

function randomColor() {
  var hexLetters = '0123456789ABCDEF';
  var colorCode = '#';
  for (var i = 0; i < 6; i++) {
    colorCode += hexLetters[Math.floor(Math.random() * 16)];
  }
  return colorCode;
}

ReactDOM.render(
  <Board inputNumber={500} divisions={50} delay={10}/>,
  document.getElementById('root')
);
