import React, { useState, useEffect } from 'react';

import Card from '../UI/Card';
import './Search.css';

const Search = React.memo(({ onFilteredIngredients }) => {
  // filter by state
  const [filterBy, setFilterBy] = useState('');

  useEffect(() => {
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
  }, [filterBy, onFilteredIngredients]);

  return (
    <section className="search">
      <Card>
        <div className="search-input">
          <label>Filter by Title</label>
          <input
            type="text"
            value={filterBy}
            onChange={(event) => setFilterBy(event.target.value)}
          />
        </div>
      </Card>
    </section>
  );
});

export default Search;
