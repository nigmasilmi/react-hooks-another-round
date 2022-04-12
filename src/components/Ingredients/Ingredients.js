import React, { useCallback, useReducer } from 'react';

import IngredientForm from './IngredientForm';
import IngredientList from './IngredientList';
import ErrrorModal from '../UI/ErrorModal';
import Search from './Search';

const ingredientsReducer = (currentIngredients, action) => {
  switch (action.type) {
    case 'SET':
      return action.ingredients;
    case 'ADD':
      return [action.ingredient, ...currentIngredients];
    case 'DELETE':
      return currentIngredients.filter((ing) => ing.id !== action.id);
    default:
      throw new Error('Should not get here');
  }
};

const httpReducer = (httpState, action) => {
  switch (action.type) {
    case 'SEND':
      return { isLoading: true, error: null };
    case 'RESPONSE':
      return { ...httpState, isLoading: false };
    case 'ERROR':
      return { isLoading: false, error: action.error };
    case 'CLEAR':
      return { ...httpState, error: null };
    default:
      throw new Error('Should not reach here');
  }
};

function Ingredients(props) {
  const [httpState, dispatchHttpAct] = useReducer(httpReducer, {
    isLoading: false,
    error: null,
  });
  const [ingredients, dispatchIngAct] = useReducer(ingredientsReducer, []);

  const saveIngredientInDB = (ingredient) => {
    dispatchHttpAct({ type: 'SEND' });

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
        dispatchIngAct({
          type: 'ADD',
          ingredient: { id: data.name, ...ingredient },
        });
        dispatchHttpAct({ type: 'RESPONSE' });
      })
      .catch((err) => {
        console.log(err.message);
        dispatchHttpAct({ type: 'ERROR', error: err.message });
      });
  };

  const removeItemHandler = (ingredientId) => {
    dispatchHttpAct({ type: 'SEND' });

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
        dispatchIngAct({ type: 'DELETE', id: ingredientId });
        dispatchHttpAct({ type: 'RESPONSE' });
      })
      .catch((err) => {
        console.log(err);
        dispatchHttpAct({ type: 'ERROR', error: err.message });
      });
  };

  const queryedIngredientsHandler = useCallback((comingIngredients) => {
    // if this is executing
    dispatchIngAct({ type: 'SET', ingredients: comingIngredients });
  }, []);

  return (
    <div className="App">
      <IngredientForm
        onAddIngredient={saveIngredientInDB}
        isLoading={httpState.isLoading}
      />

      <section>
        <Search onFilteredIngredients={queryedIngredientsHandler} />
        <IngredientList
          onRemoveItem={removeItemHandler}
          ingredients={ingredients}
        />
        {httpState.error && (
          <ErrrorModal onClose={() => dispatchHttpAct({ type: 'CLEAR' })}>
            {' '}
            <p>{httpState.error}</p>{' '}
          </ErrrorModal>
        )}
      </section>
    </div>
  );
}

export default Ingredients;
