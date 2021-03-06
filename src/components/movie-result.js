import React, { Component } from 'react';
import { connect } from 'react-redux';
import styled, { keyframes } from 'styled-components';
import _ from 'lodash';
import { deleteMovie, addToWatchedList } from '../actions';

const riseUp = keyframes`
  0% {
    opacity: 0;
    transform: scale(0.9);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
`;

const StyledWatchedButton = styled.a`
  float: right;
  margin-top: 1rem;
  text-decoration: none;
  padding: 1rem;
  background-color: ${props => props.watched ? '#3498db' : 'grey' };
  box-shadow: 0 0.2rem 1rem rgba(0, 0, 0, .3);
  cursor: pointer;
  color: white;
  transition: all 0.2s;
  border-radius: 200px;

  &:link,
  &:visited {
    text-decoration: none;
    padding: 1rem;
    background-color: #3498db;
  }

  &:hover {
    box-shadow: 0 0.5rem 0.5rem rgba(0, 0, 0, .3);
    transform: translateY(-0.2rem);
  }
  &:active {
    box-shadow: 0 0.2rem 1rem rgba(0, 0, 0, .3);
    transform: translateY(-0.1rem);
  }

`;

const StyledMovieSection = styled.div`
  .welcome-section {
    text-align: center;
    height: 100%;
    width: 100%;
    font-size: 150%;
    text-transform: uppercase;

    h1 {
      font-weight: 300;
    }
  }

  .movie-container {
    position: relative;
    box-shadow: 0 1rem 2rem rgba(0, 0, 0, .3);
    display: flex;
    margin: 5rem;
    background-color: white;
    animation: ${riseUp} .5s ease-out;

    .btn-close {
      position: absolute;
      text-decoration: none;
      top: 1rem;
      right: 1rem;
      font-size: 150%;
      color: #c0392b;
      cursor: pointer;
    }
  }

  .movie-thumbnail-container {
    background-size: cover;
    flex: 30%;
    padding-right: 2rem;
    clip-path: polygon(0% 0%, 75% 0%, 100% 50%, 75% 100%, 0% 100%);
  }

  .movie-info-section {
    flex: 70%;
    padding: 2rem;
  }

  .ratings-section {
    display: flex;
    justify-content: space-between;
  }

  @media only screen and (max-width: 750px) {
    .movie-container {
      flex-direction: column;
      margin: 1rem;
      .btn-close {
        z-index: 10;
      }
    }

    .movie-thumbnail-container {
      height: 20rem;
      clip-path: polygon(0% 0%, 100% 0, 100% 75%, 50% 100%, 0 75%);
    }
  }

`;

class MovieResult extends Component {
  state = { watched: false };

  // on "Watched" button click, store movieData
  onWatchedBtnClick = () => {
    let { Poster, Title, Year, Plot, Ratings } = this.props.movieData;
    this.props.addToWatchedList({ Poster, Title, Year, Plot, Ratings });
  }

  // on card close, delete fetched movie
  onCloseClick = () => {
    this.props.deleteMovie();
  }

  renderRatings(ratings) {
    return ratings.map(rating => {
      let { Source, Value } = rating;
      return (
        <div className='movie-rating'>
          <strong>{Value}</strong>
          <br />
          {Source}
        </div>
      )
    })
  }

  renderSection() {
    let { movieData } = this.props;

    if(movieData.Error) {
      // render error message
      return (
        <div className='welcome-section'>
          <h1>
            No results found
          </h1>
          <p>
            please try again
          </p>
        </div>
      )
    }

    if(movieData.loading) {
      return (
        <div className='welcome-section'>
          <h1>
            ...
          </h1>
        </div>
      );
    }

    if(movieData.Title) {
      // if movie exists, render fetched data
      let { Poster, Title, Year, Plot, Ratings } = movieData;
      let watched = false;

      // check if fetched movie is present in watched movies list
      // pass watched as props in 'StyledWatchedButton' for theming 'Watched' button
      if(_.find(this.props.watchedMovies, { Poster, Title, Year })) {
        watched = true;
      }

      return (
        <div className='movie-container'>
          <i className="btn-close fas fa-times-circle" onClick={this.onCloseClick} />
          <div className='movie-thumbnail-container' style={{ backgroundImage: `url(${Poster})` }}>

          </div>
          <div className='movie-info-section'>
            <h1>{`${Title} (${Year})`}</h1>
            <div className='ratings-section'>
              {this.renderRatings(Ratings)}
            </div>
            <h3>Plot</h3>
            <p>{Plot}</p>
            <StyledWatchedButton onClick={this.onWatchedBtnClick} watched={watched}>
              Watched
            </StyledWatchedButton>
          </div>
        </div>
      )
    }


    // render welcome text if reducer is empty
    return (
      <div className='welcome-section'>
        <h1>
          Welcome to FilmBuff
        </h1>
        <p>
          Search for a movie
        </p>
      </div>
    )
  }

  render() {
    return (
      <StyledMovieSection>
        {this.renderSection()}
      </StyledMovieSection>
    )
  }
}

function mapStateToProps({ movieData, watchedMovies }) {
  return { movieData, watchedMovies };
}

export default connect(mapStateToProps, { deleteMovie, addToWatchedList })(MovieResult);
