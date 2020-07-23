import React from 'react';
import PropTypes from 'prop-types';

const Thumb = props => (
  <div className={props.classes}>
    <div class="caption-port">
        <div class="caption-port-content">
            {props.description}
            {props.pre ? "\n Prerequisites: " + props.pre : ""}
            {props.requirement ? "\n Requirement: " + props.requirement: ""}
        </div>
    </div>
    <img src={props.src} alt={props.alt}/>
  </div>
);

Thumb.propTypes = {
  alt: PropTypes.string,
  description: PropTypes.string,
  pre: PropTypes.string,
  title: PropTypes.string,
  requirement: PropTypes.string,
  classes: PropTypes.string,
  src: PropTypes.string.isRequired
};

export default Thumb;
