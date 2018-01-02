import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Prompt, Link } from 'react-router-dom';

import { createPlayer, createSession } from '../actions';
import { playersSelector } from '../../Overview/selectors';

import css from './style.css';

const DEFAULT_BUYIN = 5;
const LEAVE_PROMPT = "Are you sure you want to leave?";

// Table structure
const Table = ({
  players,
  isAddingPerson,
  handleNewPersonChange,
  newPlayerName,
  handleChangePerson,
}) => (
  <table className={css.peopleList}>
    <thead>
      <tr>
        <th>Played</th>
        <th>Name</th>
        <th>Buyin</th>
        <th>Walkout</th>
      </tr>
    </thead>
    <tbody>
      {players.map((player, index) => (
        <tr key={index}>
          <td className={css.played}><input type="checkbox" /></td>
          <td className={css.name}>{player.name}</td>
          <td key="buyin" className={css.buyin}>
            {'$'}
            <input
              onChange={event => handleChangePerson(event, 'buyin', player)}
              type="number"
              defaultValue={DEFAULT_BUYIN}
              step={0.10}
              min={0}
            />
          </td>
          <td key="walkout" className={css.walkout}>
            {'$'}
            <input
              onChange={event => handleChangePerson(event, 'walkout', player)}
              type="number"
              step={0.10}
            />
          </td>
        </tr>
      ))}
      {isAddingPerson &&
        <tr key="newPlayer">
          <td className={css.played} />
          <td className={css.newPersonName}>
            <input
              placeholder="Name..."
              onChange={handleNewPersonChange}
              value={newPlayerName}
            />
          </td>
          <td key="buyin" className={css.buyin} />
          <td key="walkout" className={css.walkout} />
        </tr>
      }
    </tbody>
  </table>
);

class NewSession extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isAddingPerson: false,
      newPlayerName: '',
      players: props.players,
    };
  }

  componentWillReceiveProps(nextProps) {
    const { players } = this.state;

    const playerIds = players.map(p => p.id);
    const newPlayersFromStore = nextProps
      .players
      .filter(p => !playerIds.includes(p.id))
      .map(p => ({
        ...p,
        buyin: DEFAULT_BUYIN,
        walkout: null,
      }));

    this.setState({
      players: [...players, ...newPlayersFromStore],
    });
  }

  handleNewPersonChange = (event) => {
    this.setState({
      newPlayerName: event.target.value,
    });
  }

  handleAddPerson = () => {
    const { isAddingPerson } = this.state;

    this.setState({
      isAddingPerson: !isAddingPerson,
    });
  }

  handleChangePerson = (event, key, player) => {
    const { players } = this.state;

    const oldPlayerInfo = players.find(p => p.id === player.id);
    const filteredPlayers = players.filter(p => p.id !== player.id);

    this.setState({
      players: [...filteredPlayers, {
        ...oldPlayerInfo,
        [key]: event.target.value,
      }],
    });
  }

  createPlayer = () => {
    const { createPlayer: dispatchCreatePlayer } = this.props;
    const { newPlayerName } = this.state;

    dispatchCreatePlayer(newPlayerName);
    this.setState({ newPlayerName: '' });
  }

  render() {
    console.log(this.state.players);
    const { isAddingPerson, newPlayerName } = this.state;
    const { players } = this.props;

    const buttonMessage = isAddingPerson ? 'x Cancel' : '+ Add person';

    return (
      <div className={css.newSession}>
        <Prompt
          when
          message={LEAVE_PROMPT}
        />
        <h2>New Session</h2>

        <hr />

        <Table
          players={players}
          isAddingPerson={isAddingPerson}
          handleNewPersonChange={this.handleNewPersonChange}
          newPlayerName={newPlayerName}
          handleChangePerson={this.handleChangePerson}
        />
        <button
          onClick={this.handleAddPerson}
          className={css.newPerson}
        >
          {buttonMessage}
        </button>
        {isAddingPerson && <button onClick={this.createPlayer}>Save new user ✔</button>}

        <form>
          <field>
            <span>Session Date:* </span>
            <input type="date" className={css.dateField} required />
          </field>
          <field>
            <span>Session Time: </span>
            <input type="time" className={css.dateField} />
          </field>
          <Link to="/overview" className={css.close}>Close</Link>
          <button className={css.create} type="submit">Create Session ✔</button>
        </form>
      </div>
    );
  }
}

Table.propTypes = {
  players: PropTypes.array.isRequired,
  isAddingPerson: PropTypes.bool.isRequired,
  newPlayerName: PropTypes.string.isRequired,
  handleNewPersonChange: PropTypes.func.isRequired,
  handleChangePerson: PropTypes.func.isRequired,
};

NewSession.propTypes = {
  players: PropTypes.array.isRequired,
  createPlayer: PropTypes.func.isRequired,
};

export default connect(
  state => ({
    players: playersSelector(state),
  }),
  dispatch => ({
    createPlayer: (name) => dispatch(createPlayer(name)),
    createSession: (name, time, playerSessions) => dispatch(createSession(name, time, playerSessions)),
  }),
)(NewSession);
