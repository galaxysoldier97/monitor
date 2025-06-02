import React, { PropTypes } from 'react';
import { Paper } from '@material-ui/core';
import { grey } from '@material-ui/core/colors';

class InfoBox extends React.Component {


  render() {
    const styles = {
      paper: {
        overflow: 'hidden',
      },
      content: {
        padding: '5px 10px',
        marginLeft: 90,
        height: 80,
      },
      number: {
        display: 'block',
        fontSize: 18,
        color: grey[800],
        fontWeight: 'bold',
      },
      text: {
        fontSize: 20,
        color: grey[800],
      },
      iconSpan: {
        float: 'left',
        height: 90,
        width: 90,
        textAlign: 'center',
        backgroundColor: this.props.color,
      },
      icon: {
        color: 'white',
        height: 48,
        width: 48,
        marginTop: 20,
        maxWidth: '100%',

      },
    };
    const Icon = this.props.Icon;
    return (
      <Paper style={styles.paper}>
        <span style={styles.iconSpan}>
          <Icon color={grey[0]}
                style={styles.icon}
          />
        </span>

        <div style={styles.content}>
          <span style={styles.text}>{this.props.title}</span>
          <span style={styles.number}>{this.props.value}</span>
        </div>
      </Paper>
    );
  }
}

InfoBox.propTypes = {
  Icon: PropTypes.any, // eslint-disable-line
  color: PropTypes.string,
  title: PropTypes.string,
  value: PropTypes.string,
};

export default InfoBox;
