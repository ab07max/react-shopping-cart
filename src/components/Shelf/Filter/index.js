import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';
import { updateFilters } from '../../../services/filters/actions';
import Checkbox from '../../Checkbox';
// import GithubStarButton from '../../github/StarButton';

import './style.scss';

const keywords = ['Programming', 'Python', 'Scratch', 'Math'];

const meeting = ['Saturday', 'Sunday'];

class Filter extends Component {
  static propTypes = {
    updateFilters: PropTypes.func.isRequired,
    filters: PropTypes.array
  };

  componentDidMount() {
    this.selectedCheckboxes = new Set();
    this.selectedCheckboxesMeeting = new Set();
  }

  toggleCheckbox = label => {
    if (this.selectedCheckboxes.has(label)) {
      this.selectedCheckboxes.delete(label);
    } else {
      this.selectedCheckboxes.add(label);
    }

    this.props.updateFilters(Array.from(this.selectedCheckboxes));
  };

  toggleCheckboxMeeting = label => {
    if (this.selectedCheckboxesMeeting.has(label)) {
      this.selectedCheckboxesMeeting.delete(label);
    } else {
      this.selectedCheckboxesMeeting.add(label);
    }

    this.props.updateFilters(Array.from(this.selectedCheckboxesMeeting));
  };

  createCheckbox = label => (
      <Checkbox
      classes="filters-available-size"
      label={label}
      handleCheckboxChange={this.toggleCheckbox}
      key={label}
    />
  );

  createCheckboxMeeting = label => (
    <Checkbox
      classes="filters-available-size"
      label={label}
      handleCheckboxChange={this.toggleCheckboxMeeting}
      key={label}
    />
  );

  createCheckboxes = () => keywords.map(this.createCheckbox);

  createCheckboxesMeeting = () => meeting.map(this.createCheckboxMeeting);

  render() {
    return (
      <div className="filters">
        <h4 className="title">Keywords:</h4>
        {this.createCheckboxes()}
        <h4 className="title">Meetings:</h4>
        {this.createCheckboxesMeeting()}
        {/* <GithubStarButton /> */}
      </div>
    );
  }
}

export default connect(
  null,
  { updateFilters }
)(Filter);
