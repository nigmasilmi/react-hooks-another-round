import React, { useState, useEffect, useRef } from 'react';

import Card from '../UI/Card';
import './Search.css';

const Search = React.memo(({ onFilteredIngredients }) => {
  // filter by state
  const [filterBy, setFilterBy] = useState('');
  const searchByInputRef = useRef();

  useEffect(() => {
    // set a timer to send a request not on every key stroke but every period of time
    // but, only send the request if the period of time has passed
    // and the key when the timer started (when useEffect was triggered 500ms ago)
    // is the same from the filter when the search is going to be triggered
    const timer = setTimeout(() => {
      if (filterBy === searchByInputRef.current.value) {
        const query =
          filterBy.length === 0 ? '' : `?orderBy="title"&equalTo="${filterBy}"`;
        // perform the search
        fetch(`${process.env.REACT_APP_FIREBASE_ENDPOINT}${query}`).then(
          (response) => {
            return response
              .json()
              .then((data) => {
                const loadedIngredients = [];
                for (let key in data) {
                  loadedIngredients.push({
                    id: key,
                    title: data[key].title,
                    amount: data[key].amount,
                  });
                }
                // perform
                onFilteredIngredients(loadedIngredients);
              })
              .catch((err) => {
                console.log(err);
              });
          }
        );
      }
      return () => {
        clearTimeout(timer);
      };
    }, 1000);
  }, [filterBy, onFilteredIngredients, searchByInputRef]);

  return (
    <section className="search">
      <Card>
        <div className="search-input">
          <label>Filter by Title</label>
          <input
            type="text"
            value={filterBy}
            ref={searchByInputRef}
            onChange={(event) => setFilterBy(event.target.value)}
          />
        </div>
      </Card>
    </section>
  );
});

export default Search;
