import React, { useState } from "react";
import "./App.css";
import {
  InputGroup,
  Tab,
  Tabs,
  Card,
  Elevation,
  Button,
  Toast,
  Toaster,
} from "@blueprintjs/core";
import { IconNames } from "@blueprintjs/icons";

function App() {
  let [validResults, setValidResults] = useState(true);
  let [results, setResults] = useState([]);
  let [nominations, setNominations] = useState([]);
  let [nominationToast, setNominationToast] = useState(false);

  function handleSearchChange(e) {
    let tempResults = [];
    fetch(
      "http://www.omdbapi.com/?s=" +
        e.target.value +
        "&type=movie&apikey=" +
        process.env.REACT_APP_OMDB_API_KEY
    )
      .then((response) => response.json())
      .then((data) => {
        if (data["Response"] === "False") {
          setValidResults(false);
        } else {
          setValidResults(true);
          for (var i = 0; i < data["Search"].length; i++) {
            tempResults.push(data["Search"][i]);
          }
          setResults(tempResults);
        }
      });
  }

  function changeNominations(type, movie) {
    if (type === "add") {
      setNominations(nominations.concat(movie));
    } else {
      setNominations(
        nominations.slice(
          nominations.splice(
            nominations.findIndex((nom) => nom.imdbID === movie["imdbID"]),
            1
          )
        )
      );
    }
    if (nominations.length === 4) {
      setNominationToast(true);
    } else {
      setNominationToast(false);
    }
  }

  function MovieCard(props) {
    return (
      <Card className="Card" interactive={true} elevation={Elevation.TWO}>
        <div className="Card-flex">
          {props.movie["Poster"] !== "N/A" && (
            <img
              height="150"
              width="100"
              src={props.movie["Poster"]}
              alt={props.movie["Title"] + " movie poster"}
            ></img>
          )}
          <div className="Card-flex-content">
            <h4>{props.movie["Title"]}</h4>
            <p>{props.movie["Year"]}</p>
            <Button
              small={true}
              icon={
                props.button === "Nominate"
                  ? IconNames.ARROW_RIGHT
                  : IconNames.CROSS
              }
              disabled={
                props.button === "Nominate" &&
                nominations.find((nom) => nom.imdbID === props.movie["imdbID"])
              }
              intent={props.button === "Nominate" ? "success" : "danger"}
              onClick={
                props.button === "Nominate"
                  ? () => changeNominations("add", props.movie)
                  : () => changeNominations("remove", props.movie)
              }
            >
              {props.button}
            </Button>
          </div>
        </div>
      </Card>
    );
  }

  function ResultsPanel(props) {
    let cards = [];
    if (validResults) {
      for (var i = 0; i < props.results.length; i++) {
        cards.push(
          <MovieCard
            key={props.results[i]["Title"] + i}
            movie={props.results[i]}
            button="Nominate"
          />
        );
      }
      return <div>{cards}</div>;
    } else {
      return (
        <div className="Results-wrap">
          <p>
            Your search is either blank or is returning too many results. Try
            some other search terms!
          </p>
        </div>
      );
    }
  }

  function NominationsPanel(props) {
    let cards = [];

    if (props.nominations.length !== 0) {
      for (var i = 0; i < props.nominations.length; i++) {
        cards.push(
          <MovieCard
            key={props.nominations[i]["Title"] + i}
            movie={props.nominations[i]}
            button="Remove"
          />
        );
      }
      return <div>{cards}</div>;
    } else {
      return <p>You don't have any nominations yet!</p>;
    }
  }

  return (
    <div className="App-body">
      {nominationToast && (
        <Toaster>
          <Toast
            icon={IconNames.SAVED}
            intent="success"
            message="You now have 5 nominations!"
            onDismiss={() => setNominationToast(false)}
          />
        </Toaster>
      )}
      <h1>The Shoppies</h1>
      <div className="App-explanation">
        <p>
          Welcome to The Shoppies! This is Simran Thind's submission for the
          frontend internship challenge for Fall 2021. Check out the repository{" "}
          <a href="https://github.com/simcard0000/shopify-fall-2021-challenge-the-shoppies">
            here
          </a>{" "}
          for more information on the project.
        </p>
      </div>
      <InputGroup
        leftIcon={IconNames.SEARCH}
        placeholder="search for movies"
        onChange={handleSearchChange}
      />
      <Tabs id="mainTab" className="App-results-nominations">
        <Tab
          id="results"
          title="Search Results (Movies)"
          panel={<ResultsPanel results={results} />}
        />
        <Tab
          id="nominations"
          title="Your Nominations"
          panel={<NominationsPanel nominations={nominations} />}
        />
      </Tabs>
    </div>
  );
}

export default App;
