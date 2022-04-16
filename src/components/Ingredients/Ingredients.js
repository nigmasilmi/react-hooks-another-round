import React, { useCallback, useReducer, useEffect, useMemo } from 'react';
import useHttp from '../../hooks/use-http';

import IngredientForm from './IngredientForm';
import IngredientList from './IngredientList';
import ErrorModal from '../UI/ErrorModal';
import Search from './Search';

const ingredientsReducer = (currentIngredients, action) => {
  switch (action.type) {
    case 'SET':
      return action.ingredients;
    case 'ADD':
      console.log('dispatching add');
      return [action.ingredient, ...currentIngredients];
    case 'DELETE':
      return currentIngredients.filter((ing) => ing.id !== action.id);
    default:
      throw new Error('Should not get here');
  }
};

function Ingredients(props) {
  const [ingredients, dispatchIngAct] = useReducer(ingredientsReducer, []);
  const {
    data,
    error,
    isLoading,
    sendRequest,
    reqExtra,
    reqIdentifier,
    clear,
  } = useHttp();

  useEffect(() => {
    console.log('isLoading', isLoading);
    console.log('error', error);
    console.log('reqIdentifier', reqIdentifier);
    if (!isLoading && !error && reqIdentifier === 'REMOVE_INGREDIENT') {
      dispatchIngAct({ type: 'DELETE', id: reqExtra });
    } else if (!isLoading && !error && reqIdentifier === 'ADD_INGREDIENT') {
      dispatchIngAct({
        type: 'ADD',
        ingredient: { id: data.name, ...reqExtra },
      });
    }
  }, [data, reqExtra, reqIdentifier, isLoading, error]);

  const saveIngredientInDB = useCallback(
    (ingredient) => {
      sendRequest(
        process.env.REACT_APP_FIREBASE_ENDPOINT,
        'POST',
        JSON.stringify(ingredient),
        ingredient,
        'ADD_INGREDIENT'
      );
    },
    [sendRequest]
  );

  const removeItemHandler = useCallback(
    (ingredientId) => {
      sendRequest(
        `${process.env.REACT_APP_FIREBASE_DELETE_BASE_ENDPOINT}/ingredients/${ingredientId}.json`,
        'DELETE',
        null,
        ingredientId,
        'REMOVE_INGREDIENT'
      );
    },
    [sendRequest]
  );

  const queryedIngredientsHandler = useCallback((comingIngredients) => {
    // if this is executing
    dispatchIngAct({ type: 'SET', ingredients: comingIngredients });
  }, []);

  const ingredientList = useMemo(() => {
    return (
      <IngredientList
        onRemoveItem={removeItemHandler}
        ingredients={ingredients}
      />
    );
  }, [removeItemHandler, ingredients]);

  return (
    <div className="App">
      <IngredientForm
        onAddIngredient={saveIngredientInDB}
        isLoading={isLoading}
      />

      <section>
        <Search onFilteredIngredients={queryedIngredientsHandler} />
        {ingredientList}
        {error && (
          <ErrorModal onClose={clear}>
            {' '}
            <p>{error}</p>{' '}
          </ErrorModal>
        )}
      </section>
    </div>
  );
}

export default Ingredients;
