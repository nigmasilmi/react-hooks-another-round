import React, { useState, useCallback } from 'react';

import IngredientForm from './IngredientForm';
import IngredientList from './IngredientList';
import ErrrorModal from '../UI/ErrorModal';
import Search from './Search';

function Ingredients(props) {
  const [ingredients, setIngredients] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const saveIngredientInDB = (ingredient) => {
    setIsLoading(true);
    fetch(process.env.REACT_APP_FIREBASE_ENDPOINT, {
      method: 'POST',
      body: JSON.stringify(ingredient),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => {
        // .json() extracts the body and converts it to a javascript object
        // returns a promise
        return response.json();
      })
      .then((data) => {
        setIngredients((prevIngredients) => [
          { id: data.name, ...ingredient },
          ...prevIngredients,
        ]);
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err.message);
        setIsLoading(false);
        setError('something went wrong');
      });
  };

  const removeItemHandler = (ingredientId) => {
    setIsLoading(true);

    fetch(
      `${process.env.REACT_APP_FIREBASE_DELETE_BASE_ENDPOINT}/ingredients/${ingredientId}.json`,
      {
        method: 'DELETE',
      }
    )
      .then((response) => {
        // .json() extracts the body and converts it to a javascript object
        // returns a promise
        return response.json();
      })
      .then((data) => {
        setIngredients((prevIngredients) =>
          prevIngredients.filter((ingredient) => ingredient.id !== ingredientId)
        );
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setIsLoading(false);
        setError('something went wrong');
      });
  };

  const queryedIngredientsHandler = useCallback((comingIngredients) => {
    // if this is executing
    setIngredients(comingIngredients);
  }, []);

  return (
    <div className="App">
      <IngredientForm
        onAddIngredient={saveIngredientInDB}
        isLoading={isLoading}
      />

      <section>
        <Search onFilteredIngredients={queryedIngredientsHandler} />
        <IngredientList
          onRemoveItem={removeItemHandler}
          ingredients={ingredients}
        />
        {error && (
          <ErrrorModal onClose={() => setError(null)}>
            {' '}
            <p>{error}</p>{' '}
          </ErrrorModal>
        )}
      </section>
    </div>
  );
}

export default Ingredients;
