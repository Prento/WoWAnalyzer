import React from 'react';
import PropTypes from 'prop-types';
import Tooltip from 'common/Tooltip';
import SpellLink from '../../../../common/SpellLink';
import Icon from '../../../../common/Icon';

class Lane extends React.PureComponent {
  static propTypes = {
    children: PropTypes.arrayOf(PropTypes.object).isRequired,
    timestampOffset: PropTypes.number.isRequired,
    secondWidth: PropTypes.number.isRequired,
    style: PropTypes.object,
  };

  getOffsetLeft(timestamp) {
    return (timestamp - this.props.timestampOffset) / 1000 * this.props.secondWidth;
  }

  renderEvent(event) {
    switch (event.type) {
      case 'cast':
        return this.renderCast(event);
      case 'updatespellusable':
        if (event.trigger === 'restorecharge') {
          return (
            <React.Fragment key={`restorecharge-${event.timestamp}`}>
              {this.renderCooldown(event)}
              {this.renderRecharge(event)}
            </React.Fragment>
          );
        } else {
          return this.renderCooldown(event);
        }
      default:
        return null;
    }
  }
  renderCast(event) {
    const left = this.getOffsetLeft(event.timestamp);
    const spellId = event.ability.guid;

    return (
      <SpellLink
        key={`cast-${spellId}-${left}`}
        id={spellId}
        icon={false}
        className="cast"
        style={{ left }}
      >
        {/*<div style={{ height: level * 30 + 55, top: negative ? 0 : undefined, bottom: negative ? undefined : 0 }} />*/}
        <Icon
          icon={event.ability.abilityIcon.replace('.jpg', '')}
          alt={event.ability.name}
        />
      </SpellLink>
    );
  }
  renderCooldown(event) {
    const left = this.getOffsetLeft(event.start);
    const width = (event.timestamp - event.start) / 1000 * this.props.secondWidth;
    return (
      <Tooltip
        content={`Cooldown: ${((event.timestamp - event.start) / 1000).toFixed(1)}s`}
        key={`cooldown-${left}`}
        className="cooldown"
        wrapperStyles={{
          left,
          width,
          position: 'absolute',
        }}
        data-effect="float"
        hideUnderline
      />
    );
  }
  renderRecharge(event) {
    const left = this.getOffsetLeft(event.timestamp);
    return (
      <Tooltip
        key={`recharge-${left}`}
        content="Charge Restored"
        className="recharge"
        wrapperStyles={{
          left,
          position: 'absolute',
        }}
        hideUnderline
      />
    );
  }

  render() {
    const { children, style } = this.props;

    const ability = children[0].ability;

    return (
      <div
        className="lane"
        style={style}
      >
        <div className="legend">
          <Icon
            icon={ability.abilityIcon.replace('.jpg', '')}
            alt={ability.name}
          />
        </div>

        {children.map(event => this.renderEvent(event))}
      </div>
    );
  }
}

export default Lane;
